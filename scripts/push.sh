#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
env_file="$script_dir/.env"

if [[ ! -f "$env_file" ]]; then
    echo "Error: .env file not found at $env_file" >&2
    exit 1
fi

while IFS='=' read -r key value; do
    [[ -z "$key" || "$key" == \#* ]] && continue
    key="$(echo "$key" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
    value="$(echo "$value" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
    export "$key=$value"
done < "$env_file"

for var in RemoteHost RemoteUser PemKey RemoteAppDir; do
    if [[ -z "${!var:-}" ]]; then
        echo "Error: Missing required .env variable: $var" >&2
        exit 1
    fi
done

repo_root="$(cd "$script_dir/.." && pwd)"

dirty="$(cd "$repo_root" && git status --porcelain)"
if [[ -n "$dirty" ]]; then
    echo "Warning: You have uncommitted changes that will NOT be included (git archive only packages committed content):" >&2
    echo "$dirty" >&2
fi

timestamp="$(date +%Y-%m-%d_%H-%M-%S)"
archive_name="quokka_${timestamp}.zip"
local_archive="$(printf '%s' "${TMPDIR:-/tmp}" | sed 's:/*$:/:')${archive_name}"
remote_archive="/tmp/$archive_name"

echo "Archiving tracked files from $repo_root (HEAD)..."
(cd "$repo_root" && git archive --format=zip -o "$local_archive" HEAD)

echo "Uploading to ${RemoteHost}:${remote_archive}..."
scp -i "$PemKey" -o StrictHostKeyChecking=no "$local_archive" "${RemoteUser}@${RemoteHost}:${remote_archive}"

rm "$local_archive"

remote_staging="/tmp/quokka_deploy_${timestamp}"

echo "Deploying to ${RemoteAppDir} on ${RemoteHost}..."

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
remote_cmd=$(cat <<EOF
set -e
mkdir -p $remote_staging
unzip -q $remote_archive -d $remote_staging

sudo rsync -a --delete $remote_staging/backend/bin/ $RemoteAppDir/backend/bin/
sudo rsync -a --delete $remote_staging/backend/lib/ $RemoteAppDir/backend/lib/
sudo rsync -a --delete $remote_staging/backend/routes/ $RemoteAppDir/backend/routes/
sudo cp $remote_staging/backend/*.js $RemoteAppDir/backend/

sudo rsync -a --delete $remote_staging/frontend/public/ $RemoteAppDir/frontend/public/
sudo rsync -a --delete $remote_staging/frontend/src/ $RemoteAppDir/frontend/src/
sudo cp $remote_staging/frontend/index.html $RemoteAppDir/frontend/index.html

cd $RemoteAppDir/frontend
sudo npm install
sudo npm run build

rm -rf $remote_staging $remote_archive
EOF
)

# -t allocates a pty so sudo can prompt for a password if it isn't
# passwordless for this user -- $RemoteAppDir (under /srv/www) isn't
# writable by $RemoteUser otherwise.
ssh -t -i "$PemKey" -o StrictHostKeyChecking=no "${RemoteUser}@${RemoteHost}" "$remote_cmd"

echo "Done. Deployed and rebuilt frontend on ${RemoteHost}:${RemoteAppDir}"
echo "If backend dependencies changed, or the app needs restarting, SSH in to handle that."
