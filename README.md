
# Блог на Laravel + React

Простенькая штука: статьи + комментарии к ним.  
Делал как тестовое задание, поэтому всё довольно прямолинейно и без лишних сложностей.

## Что внутри

- Laravel — бэкенд и REST API  
- React + Vite + React Router — фронтенд  
- MySQL 8  
- Всё завернуто в Docker (php-fpm + nginx + mysql + node)

## Как быстро запустить

Нужен Docker + docker compose.

```bash
# 1. Поднимаем контейнеры
docker compose up -d --build

# 2. Миграции + тестовые данные (если не запустились автоматически)
docker compose exec app php artisan migrate --seed
```

После запуска:

- фронтенд → http://localhost:5173  
- API       → http://localhost:8000

## Что умеет

### Статьи

```
GET    /api/articles             — список всех статей
GET    /api/articles/{id}        — одна статья + комментарии
POST   /api/articles             — создать статью
PUT    /api/articles/{id}        — обновить статью
DELETE /api/articles/{id}        — удалить статью
```

Тело для POST и PUT:

```json
{
  "title": "Заголовок статьи",
  "content": "Текст статьи..."
}
```

### Комментарии

```
POST /api/articles/{id}/comments   — добавить комментарий к статье
```

Тело:

```json
{
  "author_name": "Вася Пупкин",
  "content": "Очень интересно, спасибо!"
}
```

Авторизации нет — всё открыто (это же тестовое).

## Полезные команды

```bash
# Посмотреть логи
docker compose logs -f app
docker compose logs -f nginx
docker compose logs -f frontend

# Зайти в контейнер
docker compose exec app bash

# Убить всё вместе с базой (если нужно с нуля)
docker compose down -v
```

## Windows / PowerShell подсказки

В PowerShell `curl` — это не настоящий curl. Используйте:

```powershell
# нормальный curl
curl.exe http://localhost:8000/api/articles

# или через встроенный
Invoke-RestMethod -Method Get -Uri http://localhost:8000/api/articles
```

Если при сборке Docker ругается на `node_modules`:

```powershell
Remove-Item -Recurse -Force .\frontend\node_modules
```

## Важно

- `.env` **не коммитим**  
- используем `.env.example` как шаблон

```