#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
. ./docker/compose-command.sh

docker version --format '{{.Server.Version}}' >/dev/null
if [ ! -x .tools/supabase ]; then
    echo "The Linux Supabase CLI is missing from .tools/supabase." >&2
    exit 1
fi
echo "Starting the migrated Supabase database..."
if ! ./.tools/supabase start -x logflare,vector,realtime > .tools/supabase-start.log 2>&1; then
    echo "Supabase failed to start. See .tools/supabase-start.log." >&2
    exit 1
fi
compose up --build -d
echo "App ready: http://localhost:3000"
