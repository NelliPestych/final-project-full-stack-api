# 🚀 Інструкція запуску Foodies Backend API

## 🐳 Швидкий старт з Docker (Рекомендовано)

```bash
# Клонування репозиторію
git clone <repository-url>
cd final-project-full-stack-api

# Запуск з Docker Compose
npm run docker:dev
```

**Готово!** API доступне на http://localhost:3000

### Docker команди:
```bash
npm run docker:dev    # Розробка
npm run docker:prod  # Продакшн  
npm run docker:down  # Зупинка
npm run docker:clean # Очищення
```

## 🛠️ Локальна установка

### Передумови
- **Node.js** 18+
- **PostgreSQL** 14+
- **npm** або **yarn**

### 1. Клонування та встановлення
```bash
# Клонувати репозиторій
git clone <repository-url>
cd final-project-full-stack-api

# Встановити залежності
npm install
```

### 2. Встановлення PostgreSQL

#### macOS (з Homebrew):
```bash
# Встановити PostgreSQL
brew install postgresql@14

# Запустити PostgreSQL
brew services start postgresql@14

# Створити користувача postgres
createuser -s postgres
```

#### Ubuntu/Debian:
```bash
# Встановити PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Створити користувача postgres
sudo -u postgres createuser -s postgres
```

#### Windows:
- Завантажити PostgreSQL з офіційного сайту
- Встановити з налаштуваннями за замовчуванням

### 3. Налаштування бази даних
```bash
# Створити базу даних
createdb foodies_db

# Копіювати конфігурацію
cp .env.example .env

# Відредагувати змінні середовища
nano .env
```

### 4. Міграція та заповнення
```bash
# Створити таблиці
npm run migrate

# Заповнити тестовими даними
npm run seed
```

### 5. Запуск сервера
```bash
# Режим розробки (з автоперезавантаженням)
npm run dev

# Продакшн режим
npm start
```

### 6. Тестування
```bash
# Запуск тестів API
npm run test:api
```

## 📚 Доступ до сервісів

- **API**: http://localhost:3000
- **Swagger документація**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 🔧 Налаштування (.env)

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=foodies_db
DB_USER=postgres
DB_PASSWORD=password

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

## 🚨 Troubleshooting

### Проблема: `psql not found`
```bash
# macOS
brew install postgresql@14

# Ubuntu/Debian
sudo apt install postgresql-client
```

### Проблема: `role "postgres" does not exist`
```bash
# Створити користувача postgres
createuser -s postgres
```

### Проблема: `port 3000 already in use`
```bash
# Знайти процес на порту 3000
lsof -i :3000

# Зупинити процес
kill -9 <PID>
```

### Проблема: `docker-compose: command not found`
```bash
# Встановити Docker Desktop
# Або використовувати локальну установку
```

## 📋 Основні команди

```bash
# Розробка
npm run dev

# Продакшн
npm start

# Міграція БД
npm run migrate

# Заповнення БД
npm run seed

# Тестування API
npm run test:api

# Docker розробка
npm run docker:dev

# Docker продакшн
npm run docker:prod
```

## 🎯 Особливості проекту

- ✅ **ES Modules** - сучасний JavaScript
- ✅ **Docker** - контейнеризація
- ✅ **RESTful API** - правильні принципи
- ✅ **JWT авторизація** - безпека
- ✅ **Swagger документація** - автоматична
- ✅ **Валідація даних** - express-validator
- ✅ **Завантаження файлів** - multer
- ✅ **Безпека** - helmet, rate limiting

## 📞 Підтримка

При виникненні проблем:
1. Перевірте логи сервера
2. Переконайтеся, що PostgreSQL запущений
3. Перевірте налаштування в .env файлі
4. Спробуйте Docker варіант для швидкого старту