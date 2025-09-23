# Foodies Backend API

Backend API for the Foodies culinary application, built on Node.js using PostgreSQL.

## 🚀 Technologies

- **Node.js** - server platform
- **Express.js** - web framework
- **PostgreSQL** - database
- **JWT** - authorization
- **bcryptjs** - password hashing
- **Swagger** - API documentation
- **Multer** - file uploads
- **Docker** - containerization
- **ES Modules** - modern JavaScript

## 🐳 Docker (Recommended)

Fastest way to get started:

```bash
# Run with Docker
npm run docker:dev
```

**Done!** API is available at http://localhost:3000

### Docker commands:
```bash
npm run docker:dev    # Development
npm run docker:prod  # Production  
npm run docker:down  # Stop
npm run docker:clean # Clean up
```

## 📋 Features

### Authentication (`/api/auth`)
- ✅ User registration
- ✅ User login
- ✅ User logout
- ✅ Authorization middleware

### Users (`/api/users`)
- ✅ Get current user profile
- ✅ Get other user profile
- ✅ Update avatar
- ✅ Get followers list
- ✅ Get following list
- ✅ Follow user
- ✅ Unfollow user

### Public endpoints
- ✅ Recipe categories (`/api/categories`)
- ✅ Origin regions (`/api/areas`)
- ✅ Ingredients (`/api/ingredients`)
- ✅ Testimonials (`/api/testimonials`)

### Recipes (`/api/recipes`)
- ✅ Search recipes with filters
- ✅ Get recipe details
- ✅ Popular recipes
- ✅ Create recipe
- ✅ Get own recipes
- ✅ Delete recipe
- ✅ Add to favorites
- ✅ Remove from favorites
- ✅ Get favorite recipes

## 🛠 Installation and Setup

### Prerequisites
- Node.js (version 14 or higher)
- PostgreSQL (version 12 or higher)

### 1. Clone repository
```bash
git clone <repository-url>
cd final-project-full-stack-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment variables setup
Copy `env.example` file to `.env` and configure variables:

```bash
cp env.example .env
```

Edit `.env` file:
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

### 4. Create database
```bash
# Create PostgreSQL database
createdb foodies_db
```

### 5. Database migration
```bash
# Create tables
npm run migrate

# Seed with initial data
npm run seed
```

### 6. Start server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📚 API Documentation

After starting the server, Swagger documentation will be available at:
- **Development**: http://localhost:3000/api-docs
- **Production**: https://your-api-domain.com/api-docs

## 🔧 Available Scripts

- `npm start` - start server in production mode
- `npm run dev` - start server in development mode with nodemon
- `npm run migrate` - create database tables
- `npm run seed` - populate database with initial data

## 🗄 Database Structure

### Main tables:
- `users` - users
- `recipes` - recipes
- `categories` - recipe categories
- `areas` - origin regions
- `ingredients` - ingredients
- `testimonials` - testimonials
- `recipe_ingredients` - recipe-ingredient relationships
- `user_follows` - user subscriptions
- `user_favorite_recipes` - favorite recipes

## 🔐 Authorization

API uses JWT tokens for authorization. To access private endpoints, add the header:

```
Authorization: Bearer <your-jwt-token>
```

## 📁 Project Structure

```
├── config/
│   ├── database.js      # Database configuration
│   └── swagger.js       # Swagger configuration
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── recipeController.js
│   ├── categoryController.js
│   ├── areaController.js
│   ├── ingredientController.js
│   └── testimonialController.js
├── middleware/
│   ├── auth.js          # Authorization middleware
│   ├── errorHandler.js  # Error handling
│   └── validation.js    # Data validation
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── recipes.js
│   ├── categories.js
│   ├── areas.js
│   ├── ingredients.js
│   └── testimonials.js
├── scripts/
│   ├── migrate.js       # Database migration
│   └── seed.js          # Database seeding
├── uploads/             # Uploaded files
├── foodies/             # JSON data for import
├── server.js            # Main server file
└── package.json
```

## 🌐 Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users/profile` - My profile
- `GET /api/users/:id` - User profile
- `PUT /api/users/avatar` - Update avatar
- `GET /api/users/followers` - My followers
- `GET /api/users/following` - My following
- `POST /api/users/follow/:id` - Follow user
- `DELETE /api/users/follow/:id` - Unfollow user

### Recipes
- `GET /api/recipes/search` - Search recipes
- `GET /api/recipes/popular` - Popular recipes
- `GET /api/recipes/:id` - Recipe details
- `POST /api/recipes` - Create recipe
- `GET /api/recipes/my` - My recipes
- `DELETE /api/recipes/:id` - Delete recipe
- `POST /api/recipes/:id/favorite` - Add to favorites
- `DELETE /api/recipes/:id/favorite` - Remove from favorites
- `GET /api/recipes/favorites` - Favorite recipes

### Public
- `GET /api/categories` - Categories
- `GET /api/areas` - Regions
- `GET /api/ingredients` - Ingredients
- `GET /api/testimonials` - Testimonials

## 🚦 Status Codes

- `200` - Success
- `201` - Resource created
- `400` - Validation error
- `401` - Unauthorized
- `403` - Access forbidden
- `404` - Resource not found
- `500` - Server error

## 📝 Usage Examples

### User registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Search recipes
```bash
curl "http://localhost:3000/api/recipes/search?category=Soup&page=1&limit=10"
```

### Create recipe (with authorization)
```bash
curl -X POST http://localhost:3000/api/recipes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "title": "Ukrainian Borscht",
    "description": "Traditional Ukrainian borscht",
    "instructions": "1. Cook meat...",
    "time": 120,
    "category": "Soup",
    "area": "Ukrainian",
    "ingredients": [
      {"id": 1, "measure": "500g"},
      {"id": 2, "measure": "2 pcs"}
    ]
  }'
```

## 🤝 Contributing

1. Fork the repository
2. Create a branch for new feature (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.