// Constants for the Foodies API

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

const ERROR_MESSAGES = {
  // Auth errors
  INVALID_CREDENTIALS: 'Невірний email або пароль',
  USER_ALREADY_EXISTS: 'Користувач з таким email вже існує',
  TOKEN_REQUIRED: 'Access denied. No token provided.',
  TOKEN_INVALID: 'Token is not valid.',
  TOKEN_EXPIRED: 'Token expired',
  
  // User errors
  USER_NOT_FOUND: 'Користувач не знайдений',
  CANNOT_FOLLOW_SELF: 'Не можна підписатися на самого себе',
  ALREADY_FOLLOWING: 'Ви вже підписані на цього користувача',
  NOT_FOLLOWING: 'Ви не підписані на цього користувача',
  
  // Recipe errors
  RECIPE_NOT_FOUND: 'Рецепт не знайдений',
  RECIPE_ALREADY_FAVORITE: 'Рецепт вже в улюблених',
  RECIPE_NOT_FAVORITE: 'Рецепт не знайдений в улюблених',
  RECIPE_PERMISSION_DENIED: 'Ви не маєте прав на цю дію з рецептом',
  CATEGORY_NOT_FOUND: 'Категорія не знайдена',
  AREA_NOT_FOUND: 'Регіон не знайдений',
  
  // Validation errors
  VALIDATION_FAILED: 'Validation failed',
  NAME_REQUIRED: 'Ім\'я обов\'язкове',
  EMAIL_REQUIRED: 'Email обов\'язковий',
  EMAIL_INVALID: 'Введіть валідний email',
  PASSWORD_REQUIRED: 'Пароль обов\'язковий',
  PASSWORD_TOO_SHORT: 'Пароль повинен містити мінімум 6 символів',
  TITLE_REQUIRED: 'Назва рецепту обов\'язкова',
  INSTRUCTIONS_REQUIRED: 'Інструкції обов\'язкові',
  CATEGORY_REQUIRED: 'Категорія обов\'язкова',
  AREA_REQUIRED: 'Регіон обов\'язковий',
  TIME_INVALID: 'Час приготування повинен бути додатним числом',
  
  // File upload errors
  FILE_REQUIRED: 'Файл не надано',
  FILE_TYPE_INVALID: 'Тільки зображення дозволені!',
  FILE_TOO_LARGE: 'Файл занадто великий',
  
  // Server errors
  SERVER_ERROR: 'Помилка сервера',
  DATABASE_ERROR: 'Помилка бази даних',
  UPLOAD_ERROR: 'Помилка завантаження файлу'
};

const SUCCESS_MESSAGES = {
  // Auth success
  USER_REGISTERED: 'Користувач успішно зареєстрований',
  LOGIN_SUCCESS: 'Успішний вхід',
  LOGOUT_SUCCESS: 'Успішний вихід',
  
  // User success
  AVATAR_UPDATED: 'Аватарка успішно оновлена',
  FOLLOW_SUCCESS: 'Успішно підписались на користувача',
  UNFOLLOW_SUCCESS: 'Успішно відписались від користувача',
  
  // Recipe success
  RECIPE_CREATED: 'Рецепт успішно створений',
  RECIPE_DELETED: 'Рецепт успішно видалений',
  RECIPE_FAVORITED: 'Рецепт додано до улюблених',
  RECIPE_UNFAVORITED: 'Рецепт видалено з улюблених'
};

const VALIDATION_RULES = {
  USER: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    PASSWORD_MIN_LENGTH: 6,
    EMAIL_MAX_LENGTH: 255
  },
  RECIPE: {
    TITLE_MIN_LENGTH: 2,
    TITLE_MAX_LENGTH: 200,
    DESCRIPTION_MAX_LENGTH: 1000,
    INSTRUCTIONS_MIN_LENGTH: 10,
    INSTRUCTIONS_MAX_LENGTH: 5000,
    TIME_MIN: 1,
    TIME_MAX: 1440 // 24 hours in minutes
  },
  FILE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif']
  }
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100
};

const JWT_CONFIG = {
  DEFAULT_EXPIRES_IN: '7d',
  ALGORITHM: 'HS256'
};

const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100
};

const CORS_ORIGINS = {
  DEVELOPMENT: ['http://localhost:3000', 'http://localhost:3001'],
  PRODUCTION: ['https://your-frontend-domain.com']
};

module.exports = {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_RULES,
  PAGINATION,
  JWT_CONFIG,
  RATE_LIMIT,
  CORS_ORIGINS
};
