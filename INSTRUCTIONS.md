# 🚀 Foodies Backend API Setup Instructions

## 🐳 Quick Start with Docker (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd final-project-full-stack-api

# Run with Docker Compose
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

## 🛠️ Local Installation

### Prerequisites
- **Node.js** 18+
- **PostgreSQL** 14+
- **npm** or **yarn**

### 1. Clone and install
```bash
# Clone repository
git clone <repository-url>
cd final-project-full-stack-api

# Install dependencies
npm install
```

### 2. Install PostgreSQL

#### macOS (with Homebrew):
```bash
# Install PostgreSQL
brew install postgresql@14

# Start PostgreSQL
brew services start postgresql@14

# Create postgres user
createuser -s postgres
```

#### Ubuntu/Debian:
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create postgres user
sudo -u postgres createuser -s postgres
```

#### Windows:
- Download PostgreSQL from official website
- Install with default settings

### 3. Database setup
```bash
# Create database
createdb foodies_db

# Copy configuration
cp .env.example .env

# Edit environment variables
nano .env
```

### 4. Migration and seeding
```bash
# Create tables
npm run migrate

# Seed with test data
npm run seed
```

### 5. Start server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### 6. Testing
```bash
# Run API tests
npm run test:api
```

## 📚 Service Access

- **API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 🔧 Configuration (.env)

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

### Issue: `psql not found`
```bash
# macOS
brew install postgresql@14

# Ubuntu/Debian
sudo apt install postgresql-client
```

### Issue: `role "postgres" does not exist`
```bash
# Create postgres user
createuser -s postgres
```

### Issue: `port 3000 already in use`
```bash
# Find process on port 3000
lsof -i :3000

# Stop process
kill -9 <PID>
```

### Issue: `docker-compose: command not found`
```bash
# Install Docker Desktop
# Or use local installation
```

## 📋 Main Commands

```bash
# Development
npm run dev

# Production
npm start

# Database migration
npm run migrate

# Database seeding
npm run seed

# API testing
npm run test:api

# Docker development
npm run docker:dev

# Docker production
npm run docker:prod
```

## 🎯 Project Features

- ✅ **ES Modules** - modern JavaScript
- ✅ **Docker** - containerization
- ✅ **RESTful API** - proper principles
- ✅ **JWT authorization** - security
- ✅ **Swagger documentation** - automatic
- ✅ **Data validation** - express-validator
- ✅ **File uploads** - multer
- ✅ **Security** - helmet, rate limiting

## 📞 Support

If you encounter issues:
1. Check server logs
2. Make sure PostgreSQL is running
3. Check settings in .env file
4. Try Docker option for quick start