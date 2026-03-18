#!/usr/bin/env bash
set -e

echo "⚠️  Isso vai APAGAR TODOS os dados do banco."
read -r -p "Tem certeza que deseja continuar? Digite 'SIM' para confirmar: " CONFIRM

if [ "$CONFIRM" != "SIM" ]; then
  echo "Operação cancelada."
  exit 1
fi

docker exec -it pilar-backend php artisan migrate:fresh

if [ -f "$(dirname "$0")/post-fixtures.sh" ]; then
  bash "$(dirname "$0")/post-fixtures.sh"
fi