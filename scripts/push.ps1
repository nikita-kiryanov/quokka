$ErrorActionPreference = "Stop"

$envFile = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envFile)) {
    Write-Error ".env file not found at $envFile"
    exit 1
}

Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#\s][^=]*)=(.*)$') {
        Set-Variable -Name $Matches[1].Trim() -Value $Matches[2].Trim() -Scope Script
    }
}

foreach ($var in @("RemoteHost", "RemoteUser", "PemKey", "RemoteAppDir")) {
    if (-not (Get-Variable -Name $var -Scope Script -ErrorAction SilentlyContinue)) {
        Write-Error "Missing required .env variable: $var"
        exit 1
    }
}

$repoRoot = Split-Path $PSScriptRoot -Parent

Push-Location $repoRoot
$dirty = git status --porcelain
Pop-Location
if ($dirty) {
    Write-Warning "You have uncommitted changes that will NOT be included (git archive only packages committed content):"
    Write-Host $dirty
}

$timestamp     = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$archiveName   = "quokka_$timestamp.zip"
$localArchive  = Join-Path $env:TEMP $archiveName
$remoteArchive = "/tmp/$archiveName"

Write-Host "Archiving tracked files from $repoRoot (HEAD)..."
Push-Location $repoRoot
git archive --format=zip -o $localArchive HEAD
Pop-Location

Write-Host "Uploading to ${RemoteHost}:${remoteArchive}..."
scp -i $PemKey -o StrictHostKeyChecking=no $localArchive "${RemoteUser}@${RemoteHost}:${remoteArchive}"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Upload failed."
    exit 1
}

Remove-Item $localArchive

$remoteStaging = "/tmp/quokka_deploy_$timestamp"

Write-Host "Deploying to ${RemoteAppDir} on ${RemoteHost}..."

# Extracts the archive to a staging dir, then replaces only these specific
# paths in the live app -- nothing else is touched, so backend/public,
# backend/.env, frontend/.env, node_modules, package.json/lock,
# db/, and scripts/ are all left exactly as they are on the server:
#   backend:  bin/, lib/, routes/, and the top-level *.js files
#   frontend: public/, src/, and index.html, then rebuilt (npm install +
#             npm run build) so frontend/dist reflects the new source
# --delete on the directory syncs removes files that were deleted from the
# repo, not just overwrites what's present; it's safe here because each
# target is one of these directories in full, never a mix with other content.
$remoteCmd = @"
set -e
mkdir -p $remoteStaging
unzip -q $remoteArchive -d $remoteStaging

sudo rsync -a --delete $remoteStaging/backend/bin/ $RemoteAppDir/backend/bin/
sudo rsync -a --delete $remoteStaging/backend/lib/ $RemoteAppDir/backend/lib/
sudo rsync -a --delete $remoteStaging/backend/routes/ $RemoteAppDir/backend/routes/
sudo cp $remoteStaging/backend/*.js $RemoteAppDir/backend/

sudo rsync -a --delete $remoteStaging/frontend/public/ $RemoteAppDir/frontend/public/
sudo rsync -a --delete $remoteStaging/frontend/src/ $RemoteAppDir/frontend/src/
sudo cp $remoteStaging/frontend/index.html $RemoteAppDir/frontend/index.html

cd $RemoteAppDir/frontend
sudo npm install
sudo npm run build

rm -rf $remoteStaging $remoteArchive
"@

# The remote shell is Linux and only treats `n as a line ending, so the CRLF
# this here-string picks up from the file must be normalized to LF before
# being sent over -- otherwise each line keeps a trailing `r that corrupts
# commands and paths (see backup.ps1, which hit the same issue).
$remoteCmd = $remoteCmd -replace "`r`n", "`n"

# -t allocates a pty so sudo can prompt for a password if it isn't
# passwordless for this user -- $RemoteAppDir (under /srv/www) isn't
# writable by $RemoteUser otherwise.
ssh -t -i $PemKey -o StrictHostKeyChecking=no "${RemoteUser}@${RemoteHost}" $remoteCmd

if ($LASTEXITCODE -ne 0) {
    Write-Error "Remote deploy failed."
    exit 1
}

Write-Host "Done. Deployed and rebuilt frontend on ${RemoteHost}:${RemoteAppDir}"
Write-Host "If backend dependencies changed, or the app needs restarting, SSH in to handle that."
