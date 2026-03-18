#!/usr/bin/env bash
set -e

set -a
source /home/gabriel/pilar/.env
set +a

echo "Rodando post-fixtures..."

docker exec -i pilar-mysql mysql \
  --default-character-set=utf8mb4 \
  -u"${DB_USERNAME}" \
  -p"${DB_PASSWORD}" \
  "${DB_DATABASE}" < /home/gabriel/pilar/backend/database/post-fixtures.sql

echo "Post-fixtures finalizadas."