#!/bin/sh
set -e

# Ensure the data directory is writable by the node user (UID 1000)
# This is needed because Dokku volume mounts may be owned by root
chown -R node:node /app/data

exec su -s /bin/sh node -c "node scripts/migrate.mjs && exec pnpm start"
