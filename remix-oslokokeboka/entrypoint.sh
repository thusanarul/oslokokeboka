#!/bin/sh

if [ -z "$DATABASE_CONNECTION_LIMIT" ]; then
  export DATABASE_CONNECTION_LIMIT="4"
  echo "Setting default connection limit ($DATABASE_CONNECTION_LIMIT)"
fi

# Naive, could break
export DATABASE_URL="$DATABASE_URL?connection_limit=$DATABASE_CONNECTION_LIMIT"
echo "Updated connection limit ($DATABASE_CONNECTION_LIMIT)"

exec "$@"