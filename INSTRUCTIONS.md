# 🚀 Інструкція запуску Foodies Backend API

## Передумови

Перед запуском переконайтеся, що у вас встановлено:
- **Node.js** версії 14 або вище
- **PostgreSQL** версії 12 або вище
- **npm** або **yarn**

## 1. Клонування та встановлення

```bash
# Клонувати репозиторій
git clone <repository-url>
cd final-project-full-stack-api

# Встановити залежності
npm install
```

## 2. Встановлення PostgreSQL

### macOS (з Homebrew):
```bash
# Встановити PostgreSQL
brew install postgresql@14

# Запустити PostgreSQL
brew services start postgresql@14

# Створити користувача postgres
/opt/homebrew/opt/postgresql@14/bin/createuser -s postgres
```

### Ubuntu/Debian:
```bash
# Встановити PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Запустити PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Створити користувача postgres
sudo -u postgres createuser --superuser postgres
```

### Windows:
1. Завантажте PostgreSQL з офіційного сайту
2. Встановіть з налаштуваннями за замовчуванням
3. Запам'ятайте пароль для користувача postgres

## 3. Налаштування бази даних

```bash
# Створити базу даних
createdb foodies_db

# Або через psql
psql -c "CREATE DATABASE foodies_db;"
```

## 4. Налаштування змінних середовища

```bash
# Скопіювати файл з прикладом налаштувань
cp env.example .env
```

Відредагуйте файл `.env` з вашими налаштуваннями:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=foodies_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

## 5. Міграція та заповнення бази даних

```bash
# Створити таблиці в базі даних
npm run migrate

# Заповнити базу даних початковими даними
npm run seed
```

## 6. Запуск сервера

```bash
# Режим розробки (з автоматичним перезапуском)
npm run dev

# Режим продакшн
npm start
```

## 7. Перевірка роботи

Після запуску сервера перевірте:

- **Сервер**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **API Документація**: http://localhost:3000/api-docs

### Тестовий запит:
```bash
curl http://localhost:3000/health
```

Очікувана відповідь:
```json
{
  "status": "OK",
  "timestamp": "2025-09-22T19:25:07.817Z",
  "uptime": 247.149629792
}
```

## 8. Тестування API

```bash
# Запустити автоматичні тести
npm run test:api
```

## 🔧 Вирішення проблем

### Помилка "role postgres does not exist"
```bash
# Створити користувача postgres
createuser -s postgres
```

### Помилка "database foodies_db does not exist"
```bash
# Створити базу даних
createdb foodies_db
```

### Помилка "port 3000 already in use"
```bash
# Зупинити процес на порту 3000
lsof -ti:3000 | xargs kill -9

# Або змінити порт в .env файлі
PORT=3001
```

### Помилка підключення до PostgreSQL
1. Перевірте, чи запущений PostgreSQL
2. Перевірте налаштування в `.env` файлі
3. Переконайтеся, що база даних `foodies_db` існує

## 📚 Корисні команди

```bash
# Переглянути логи сервера
npm run dev

# Зупинити сервер
Ctrl + C

# Перезапустити базу даних
npm run migrate drop
npm run migrate
npm run seed

# Перевірити статус PostgreSQL (macOS)
brew services list | grep postgresql

# Перевірити статус PostgreSQL (Linux)
sudo systemctl status postgresql
```

## 🌐 Доступні ендпоінти

### Публічні:
- `GET /api/categories` - категорії рецептів
- `GET /api/areas` - регіони походження
- `GET /api/ingredients` - інгредієнти
- `GET /api/testimonials` - відгуки
- `GET /api/recipes/search` - пошук рецептів
- `GET /api/recipes/popular` - популярні рецепти
- `GET /api/recipes/:id` - деталі рецепту

### Авторизація:
- `POST /api/auth/register` - реєстрація
- `POST /api/auth/login` - логін
- `POST /api/auth/logout` - логаут

### Приватні (потребують токен):
- `GET /api/users/profile` - мій профіль
- `GET /api/users/:id` - профіль користувача
- `PUT /api/users/avatar` - оновлення аватарки
- `GET /api/users/followers` - мої підписники
- `GET /api/users/following` - мої підписки
- `POST /api/users/follow/:id` - підписатися
- `DELETE /api/users/follow/:id` - відписатися
- `POST /api/recipes` - створити рецепт
- `GET /api/recipes/my` - мої рецепти
- `DELETE /api/recipes/:id` - видалити рецепт
- `POST /api/recipes/:id/favorite` - додати до улюблених
- `DELETE /api/recipes/:id/favorite` - видалити з улюблених
- `GET /api/recipes/favorites` - улюблені рецепти

## 📖 Документація

Повна інтерактивна документація API доступна за адресою:
**http://localhost:3000/api-docs**

Тут ви можете:
- Переглянути всі ендпоінти
- Протестувати API прямо в браузері
- Побачити приклади запитів та відповідей
- Завантажити схему API

## 🆘 Підтримка

Якщо виникли проблеми:
1. Перевірте логи сервера в терміналі
2. Переконайтеся, що всі залежності встановлені
3. Перевірте налаштування бази даних
4. Запустіть тести для діагностики: `npm run test:api`

---

**Успішного розробки! 🎉**
