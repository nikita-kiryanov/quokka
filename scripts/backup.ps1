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

foreach ($var in @("RemoteHost", "RemoteUser", "PemKey", "RemoteImages", "LocalDest")) {
    if (-not (Get-Variable -Name $var -Scope Script -ErrorAction SilentlyContinue)) {
        Write-Error "Missing required .env variable: $var"
        exit 1
    }
}

$timestamp  = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$archiveName = "backup_$timestamp.tar.gz"
$remoteTmp   = "/tmp/$archiveName"

Write-Host "Creating backup on $RemoteHost..."

$remoteCmd = @"
set -e
pg_dumpall -U postgres > /tmp/db_dump.sql
tar -czf $remoteTmp /tmp/db_dump.sql $RemoteImages
rm /tmp/db_dump.sql
"@

# The remote shell is Linux and only treats `n as a line ending, so the CRLF
# this here-string picks up from the file must be normalized to LF before
# being sent over -- otherwise each line keeps a trailing `r that corrupts
# commands and file paths (e.g. "db_dump.sql`r", "thumbnails`r").
$remoteCmd = $remoteCmd -replace "`r`n", "`n"

ssh -i $PemKey -o StrictHostKeyChecking=no "${RemoteUser}@${RemoteHost}" $remoteCmd

if ($LASTEXITCODE -ne 0) {
    Write-Error "Remote backup failed."
    exit 1
}

if (-not (Test-Path $LocalDest)) {
    New-Item -ItemType Directory -Force $LocalDest | Out-Null
}

$localFile = Join-Path $LocalDest $archiveName

Write-Host "Downloading $archiveName..."

scp -i $PemKey -o StrictHostKeyChecking=no `
    "${RemoteUser}@${RemoteHost}:${remoteTmp}" `
    $localFile

if ($LASTEXITCODE -ne 0) {
    Write-Error "Download failed."
    exit 1
}

Write-Host "Cleaning up remote temp file..."
ssh -i $PemKey -o StrictHostKeyChecking=no "${RemoteUser}@${RemoteHost}" "rm $remoteTmp"

Write-Host "Done. Backup saved to: $localFile"

Get-ChildItem -Path $LocalDest -Filter "backup_*.tar.gz" |
    Sort-Object Name -Descending |
    Select-Object -Skip 3 |
    ForEach-Object {
        Write-Host "Removing old backup: $($_.Name)"
        Remove-Item $_.FullName
    }
