#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
. ./docker/compose-command.sh
compose stop
if ! ./.tools/supabase stop > .tools/supabase-stop.log 2>&1; then
    echo "Supabase failed to stop. See .tools/supabase-stop.log." >&2
    exit 1
fi
echo "App and Supabase stopped. Database volumes preserved."
