#!/bin/sh
set -e

cd /var/www

echo "==> Preparing Laravel environment..."

mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache
chmod -R 775 storage bootstrap/cache || true

if [ ! -d "vendor" ]; then
  echo "==> Installing composer dependencies..."
  composer install --no-interaction --prefer-dist --optimize-autoloader
fi

if [ ! -f ".env" ] && [ -f ".env.example" ]; then
  echo "==> Creating .env from .env.example..."
  cp .env.example .env
fi

APP_KEY_VALUE=$(php -r "echo getenv('APP_KEY') ?: '';" || true)
if [ -z "$APP_KEY_VALUE" ] || [ "$APP_KEY_VALUE" = "base64:" ]; then
  echo "==> Generating APP_KEY..."
  php artisan key:generate --force || true
fi

DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-3306}"

echo "==> Waiting for DB at ${DB_HOST}:${DB_PORT} ..."
i=0
until php -r "exit(@fsockopen(getenv('DB_HOST') ?: '${DB_HOST}', (int)(getenv('DB_PORT') ?: '${DB_PORT}')) ? 0 : 1);" >/dev/null 2>&1
do
  i=$((i+1))
  if [ $i -ge 60 ]; then
    echo "DB is not reachable after 60 seconds. Continue anyway."
    break
  fi
  sleep 1
done

echo "==> Running migrations..."
php artisan migrate --force

echo "==> Checking if seeding is needed..."
php -r "
\$dsn = 'mysql:host='.(getenv('DB_HOST') ?: '${DB_HOST}').';port='.(getenv('DB_PORT') ?: '${DB_PORT}').';dbname='.(getenv('DB_DATABASE') ?: '');
\$user = getenv('DB_USERNAME') ?: '';
\$pass = getenv('DB_PASSWORD') ?: '';
try {
  \$pdo = new PDO(\$dsn, \$user, \$pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
  \$count = (int)\$pdo->query('SELECT COUNT(*) FROM articles')->fetchColumn();
  exit(\$count === 0 ? 0 : 1);
} catch (Throwable \$e) { exit(2); }
" >/dev/null 2>&1

SEED_NEEDED=$?

if [ "$SEED_NEEDED" = "0" ]; then
  echo "==> Seeding database..."
  php artisan db:seed --force
elif [ "$SEED_NEEDED" = "1" ]; then
  echo "==> Seed skipped (articles already exist)."
else
  echo "==> Seed check failed. Skipping seeding."
fi

echo "==> Starting PHP-FPM..."
exec "$@"