#!/bin/sh
set -e

PORT="${BACKEND_PORT:-${PORT:-8000}}"

python manage.py migrate --noinput

exec gunicorn BE.wsgi:application \
  --bind "0.0.0.0:${PORT}" \
  --workers 2 \
  --timeout 120 \
  --access-logfile - \
  --error-logfile -
