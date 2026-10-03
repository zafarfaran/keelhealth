# Source before any command so nothing writes outside the repo.
# Usage: . videos/keel-launch/tools/env.sh
W="$(pwd)/videos/keel-launch/_work"
mkdir -p "$W/tmp" "$W/media-home" "$W/npm-cache"
export TMP="$W/tmp" TEMP="$W/tmp" TMPDIR="$W/tmp"
export HYPERFRAMES_NO_TELEMETRY=1
export HYPERFRAMES_MEDIA_HOME="$W/media-home"
export npm_config_cache="$W/npm-cache"
export npm_config_update_notifier=false
export DO_NOT_TRACK=1
