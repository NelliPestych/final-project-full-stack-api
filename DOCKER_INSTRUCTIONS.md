# 🐳 Docker Інструкції для Foodies API

## Швидкий старт з Docker

### 1. Запуск в режимі розробки

```bash
# Клонування репозиторію
git clone <repository-url>
cd final-project-full-stack-api

# Запуск з Docker Compose
npm run docker:dev
```

Це автоматично:
- ✅ Створить PostgreSQL контейнер
- ✅ Встановить залежності Node.js
- ✅ Запустить сервер на порту 3000
- ✅ Налаштує базу даних

### 2. Доступ до сервісів

- **API**: http://localhost:3000
- **Swagger документація**: http://localhost:3000/api-docs
- **PostgreSQL**: localhost:5432
  - База: `foodies_db`
  - Користувач: `postgres`
  - Пароль: `password`

### 3. Команди Docker

```bash
# Запуск в режимі розробки
npm run docker:dev

# Запуск в продакшн режимі
npm run docker:prod

# Зупинка контейнерів
npm run docker:down

# Повне очищення (включаючи дані)
npm run docker:clean
```

### 4. Робота з базою даних

```bash
# Підключення до PostgreSQL контейнера
docker exec -it foodies_postgres psql -U postgres -d foodies_db

# Перегляд логів
docker logs foodies_app
docker logs foodies_postgres

# Виконання міграцій (всередині контейнера)
docker exec -it foodies_app npm run migrate
docker exec -it foodies_app npm run seed
```

### 5. Структура Docker

```
├── Dockerfile              # Конфігурація Node.js контейнера
├── docker-compose.yml      # Розробка
├── docker-compose.prod.yml # Продакшн
├── .dockerignore           # Файли для ігнорування
└── uploads/                # Папка для завантажень
```

### 6. Переваги Docker підходу

- 🚀 **Швидкий старт**: Одна команда для запуску
- 🔒 **Ізоляція**: Окремі контейнери для кожного сервісу
- 📦 **Консистентність**: Однакове середовище для всіх
- 🔄 **Масштабованість**: Легко додати нові сервіси
- 🛠️ **Розробка**: Hot reload для Node.js

### 7. Налаштування для різних середовищ

#### Розробка (.env)
```env
NODE_ENV=development
DB_HOST=postgres
DB_PORT=5432
DB_NAME=foodies_db
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
```

#### Продакшн (.env.prod)
```env
NODE_ENV=production
DB_HOST=postgres
DB_PORT=5432
DB_NAME=foodies_db_prod
DB_USER=postgres
DB_PASSWORD=secure_production_password
JWT_SECRET=very_secure_jwt_secret_for_production
```

### 8. Troubleshooting

#### Проблема: Порт зайнятий
```bash
# Перевірка зайнятих портів
lsof -i :3000
lsof -i :5432

# Зупинка конфліктуючих процесів
npm run docker:down
```

#### Проблема: База даних не підключається
```bash
# Перевірка статусу контейнерів
docker ps

# Перегляд логів PostgreSQL
docker logs foodies_postgres

# Перезапуск з очищенням
npm run docker:clean
npm run docker:dev
```

#### Проблема: Зміни не відображаються
```bash
# Перезапуск тільки app контейнера
docker-compose restart app

# Повний перезапуск
npm run docker:down
npm run docker:dev
```

### 9. Продакшн деплой

```bash
# Використання продакшн конфігурації
docker-compose -f docker-compose.prod.yml up -d

# З перемінними середовища
DB_PASSWORD=secure_password JWT_SECRET=secret docker-compose -f docker-compose.prod.yml up -d
```

### 10. Моніторинг

```bash
# Статус контейнерів
docker ps

# Використання ресурсів
docker stats

# Логи в реальному часі
docker-compose logs -f
```

---

## 🎯 Переваги для команди

- **Нові розробники**: Запуск за 2 хвилини
- **CI/CD**: Легка інтеграція з пайплайнами
- **Тестування**: Ізольовані тестові середовища
- **Продакшн**: Консистентне розгортання
