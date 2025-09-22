# 🚀 Швидкий старт Foodies Backend

## Передумови
- Node.js 14+
- PostgreSQL 12+
- npm або yarn

## 1. Встановлення залежностей
```bash
npm install
```

## 2. Налаштування бази даних
```bash
# Створити базу даних
createdb foodies_db

# Або через psql
psql -c "CREATE DATABASE foodies_db;"
```

## 3. Налаштування змінних середовища
Створіть файл `.env` на основі `env.example`:
```bash
cp env.example .env
```

Відредагуйте `.env` файл з вашими налаштуваннями:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=foodies_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_here
```

## 4. Міграція та заповнення БД
```bash
# Створити таблиці
npm run migrate

# Заповнити початковими даними
npm run seed
```

## 5. Запуск сервера
```bash
# Режим розробки
npm run dev

# Режим продакшн
npm start
```

## 6. Тестування API
```bash
# Запустити тести (після запуску сервера)
npm run test:api
```

## 7. Перевірка роботи
- **Сервер**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **API Docs**: http://localhost:3000/api-docs

## 🔧 Основні команди

```bash
# Розробка
npm run dev              # Запуск з nodemon
npm start               # Запуск сервера

# База даних
npm run migrate         # Створити таблиці
npm run seed           # Заповнити даними
npm run migrate drop   # Видалити таблиці

# Тестування
npm run test:api       # Тестування API
```

## 📋 Перевірка ендпоінтів

### Публічні ендпоінти (без авторизації)
```bash
# Health check
curl http://localhost:3000/health

# Категорії
curl http://localhost:3000/api/categories

# Регіони
curl http://localhost:3000/api/areas

# Інгредієнти
curl http://localhost:3000/api/ingredients

# Відгуки
curl http://localhost:3000/api/testimonials

# Пошук рецептів
curl "http://localhost:3000/api/recipes/search?limit=5"

# Популярні рецепти
curl http://localhost:3000/api/recipes/popular
```

### Приватні ендпоінти (з авторизацією)
```bash
# Реєстрація
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Вхід (отримати токен)
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.data.token')

# Профіль користувача
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/users/profile

# Мої рецепти
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/recipes/my
```

## 🐛 Вирішення проблем

### Помилка підключення до БД
- Перевірте, чи запущений PostgreSQL
- Перевірте налаштування в `.env` файлі
- Переконайтеся, що база даних `foodies_db` існує

### Помилка "Module not found"
```bash
npm install
```

### Помилка "Permission denied" при створенні БД
```bash
# Створити користувача PostgreSQL
sudo -u postgres createuser --interactive

# Або використати існуючого користувача
```

### Порт 3000 зайнятий
```bash
# Змінити порт в .env файлі
PORT=3001
```

## 📚 Додаткова інформація

- **Повна документація**: README.md
- **API документація**: http://localhost:3000/api-docs
- **Структура БД**: scripts/migrate.js
- **Тестові дані**: foodies/ папка

## 🆘 Підтримка

Якщо виникли проблеми:
1. Перевірте логи сервера
2. Переконайтеся, що всі залежності встановлені
3. Перевірте налаштування бази даних
4. Запустіть тести для діагностики
