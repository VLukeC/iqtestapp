#!/bin/sh
# Source this after changing to the project root.
compose() {
    if docker compose version >/dev/null 2>&1; then
        docker compose "$@"
    elif [ -x /usr/libexec/docker/cli-plugins/docker-compose ]; then
        # Docker Desktop can leave stale links ahead of Ubuntu's native plugins.
        # Use the installed native plugins without changing system files.
        mkdir -p .tools/docker-cli
        printf '%s\n' '{"cliPluginsExtraDirs":["/usr/libexec/docker/cli-plugins"]}' > .tools/docker-cli/config.json
        docker --config "$PWD/.tools/docker-cli" compose "$@"
    else
        echo "Docker Compose is not installed in Ubuntu." >&2
        return 1
    fi
}
