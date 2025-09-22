# Foodies Backend API

Backend API для кулінарного додатку Foodies, створений на Node.js з використанням PostgreSQL.

## 🚀 Технології

- **Node.js** - серверна платформа
- **Express.js** - веб-фреймворк
- **PostgreSQL** - база даних
- **JWT** - авторизація
- **bcryptjs** - хешування паролів
- **Swagger** - документація API
- **Multer** - завантаження файлів

## 📋 Функціональність

### Авторизація (`/api/auth`)
- ✅ Реєстрація користувача
- ✅ Вхід користувача
- ✅ Вихід користувача
- ✅ Middleware авторизації

### Користувачі (`/api/users`)
- ✅ Отримання профілю поточного користувача
- ✅ Отримання профілю іншого користувача
- ✅ Оновлення аватарки
- ✅ Отримання списку підписників
- ✅ Отримання списку підписок
- ✅ Підписка на користувача
- ✅ Відписка від користувача

### Публічні ендпоінти
- ✅ Категорії рецептів (`/api/categories`)
- ✅ Регіони походження (`/api/areas`)
- ✅ Інгредієнти (`/api/ingredients`)
- ✅ Відгуки (`/api/testimonials`)

### Рецепти (`/api/recipes`)
- ✅ Пошук рецептів з фільтрами
- ✅ Отримання деталей рецепту
- ✅ Популярні рецепти
- ✅ Створення рецепту
- ✅ Отримання власних рецептів
- ✅ Видалення рецепту
- ✅ Додавання до улюблених
- ✅ Видалення з улюблених
- ✅ Отримання улюблених рецептів

## 🛠 Встановлення та запуск

### Передумови
- Node.js (версія 14 або вище)
- PostgreSQL (версія 12 або вище)

### 1. Клонування репозиторію
```bash
git clone <repository-url>
cd final-project-full-stack-api
```

### 2. Встановлення залежностей
```bash
npm install
```

### 3. Налаштування змінних середовища
Скопіюйте файл `env.example` в `.env` та налаштуйте змінні:

```bash
cp env.example .env
```

Відредагуйте `.env` файл:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=foodies_db
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### 4. Створення бази даних
```bash
# Створити базу даних PostgreSQL
createdb foodies_db
```

### 5. Міграція бази даних
```bash
# Створити таблиці
npm run migrate

# Заповнити початковими даними
npm run seed
```

### 6. Запуск сервера
```bash
# Режим розробки
npm run dev

# Режим продакшн
npm start
```

## 📚 API Документація

Після запуску сервера, Swagger документація буде доступна за адресою:
- **Development**: http://localhost:3000/api-docs
- **Production**: https://your-api-domain.com/api-docs

## 🔧 Доступні скрипти

- `npm start` - запуск сервера в продакшн режимі
- `npm run dev` - запуск сервера в режимі розробки з nodemon
- `npm run migrate` - створення таблиць бази даних
- `npm run seed` - заповнення бази даних початковими даними

## 🗄 Структура бази даних

### Основні таблиці:
- `users` - користувачі
- `recipes` - рецепти
- `categories` - категорії рецептів
- `areas` - регіони походження
- `ingredients` - інгредієнти
- `testimonials` - відгуки
- `recipe_ingredients` - зв'язок рецептів з інгредієнтами
- `user_follows` - підписки користувачів
- `user_favorite_recipes` - улюблені рецепти

## 🔐 Авторизація

API використовує JWT токени для авторизації. Для доступу до приватних ендпоінтів додайте заголовок:

```
Authorization: Bearer <your-jwt-token>
```

## 📁 Структура проекту

```
├── config/
│   ├── database.js      # Конфігурація БД
│   └── swagger.js       # Конфігурація Swagger
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── recipeController.js
│   ├── categoryController.js
│   ├── areaController.js
│   ├── ingredientController.js
│   └── testimonialController.js
├── middleware/
│   ├── auth.js          # Middleware авторизації
│   ├── errorHandler.js  # Обробка помилок
│   └── validation.js    # Валідація даних
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── recipes.js
│   ├── categories.js
│   ├── areas.js
│   ├── ingredients.js
│   └── testimonials.js
├── scripts/
│   ├── migrate.js       # Міграція БД
│   └── seed.js          # Заповнення БД
├── uploads/             # Завантажені файли
├── foodies/             # JSON дані для імпорту
├── server.js            # Головний файл сервера
└── package.json
```

## 🌐 Ендпоінти

### Авторизація
- `POST /api/auth/register` - Реєстрація
- `POST /api/auth/login` - Вхід
- `POST /api/auth/logout` - Вихід

### Користувачі
- `GET /api/users/profile` - Мій профіль
- `GET /api/users/:id` - Профіль користувача
- `PUT /api/users/avatar` - Оновлення аватарки
- `GET /api/users/followers` - Мої підписники
- `GET /api/users/following` - Мої підписки
- `POST /api/users/follow/:id` - Підписатися
- `DELETE /api/users/follow/:id` - Відписатися

### Рецепти
- `GET /api/recipes/search` - Пошук рецептів
- `GET /api/recipes/popular` - Популярні рецепти
- `GET /api/recipes/:id` - Деталі рецепту
- `POST /api/recipes` - Створити рецепт
- `GET /api/recipes/my` - Мої рецепти
- `DELETE /api/recipes/:id` - Видалити рецепт
- `POST /api/recipes/:id/favorite` - Додати до улюблених
- `DELETE /api/recipes/:id/favorite` - Видалити з улюблених
- `GET /api/recipes/favorites` - Улюблені рецепти

### Публічні
- `GET /api/categories` - Категорії
- `GET /api/areas` - Регіони
- `GET /api/ingredients` - Інгредієнти
- `GET /api/testimonials` - Відгуки

## 🚦 Статус коди

- `200` - Успішний запит
- `201` - Ресурс створений
- `400` - Помилка валідації
- `401` - Не авторизований
- `403` - Доступ заборонений
- `404` - Ресурс не знайдений
- `500` - Помилка сервера

## 📝 Приклади використання

### Реєстрація користувача
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Іван Іванов",
    "email": "ivan@example.com",
    "password": "password123"
  }'
```

### Пошук рецептів
```bash
curl "http://localhost:3000/api/recipes/search?category=Soup&page=1&limit=10"
```

### Створення рецепту (з авторизацією)
```bash
curl -X POST http://localhost:3000/api/recipes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "title": "Борщ український",
    "description": "Традиційний український борщ",
    "instructions": "1. Зварити м'ясо...",
    "time": 120,
    "category": "Soup",
    "area": "Ukrainian",
    "ingredients": [
      {"id": 1, "measure": "500g"},
      {"id": 2, "measure": "2 шт"}
    ]
  }'
```

## 🤝 Внесок у розробку

1. Форкніть репозиторій
2. Створіть гілку для нової функції (`git checkout -b feature/amazing-feature`)
3. Зробіть коміт змін (`git commit -m 'Add amazing feature'`)
4. Відправте зміни (`git push origin feature/amazing-feature`)
5. Відкрийте Pull Request

## 📄 Ліцензія

Цей проект ліцензований під MIT License.