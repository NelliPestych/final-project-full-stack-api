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
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_ALREADY_EXISTS: 'User with this email already exists',
  TOKEN_REQUIRED: 'Access denied. No token provided.',
  TOKEN_INVALID: 'Token is not valid.',
  TOKEN_EXPIRED: 'Token expired',
  
  // User errors
  USER_NOT_FOUND: 'User not found',
  CANNOT_FOLLOW_SELF: 'Cannot follow yourself',
  ALREADY_FOLLOWING: 'You are already following this user',
  NOT_FOLLOWING: 'You are not following this user',
  
  // Recipe errors
  RECIPE_NOT_FOUND: 'Recipe not found',
  RECIPE_ALREADY_FAVORITE: 'Recipe already in favorites',
  RECIPE_NOT_FAVORITE: 'Recipe not found in favorites',
  RECIPE_PERMISSION_DENIED: 'You do not have permission for this recipe action',
  CATEGORY_NOT_FOUND: 'Category not found',
  AREA_NOT_FOUND: 'Area not found',
  
  // Validation errors
  VALIDATION_FAILED: 'Validation failed',
  NAME_REQUIRED: 'Name is required',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Enter a valid email',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: 'Password must contain at least 6 characters',
  TITLE_REQUIRED: 'Recipe title is required',
  INSTRUCTIONS_REQUIRED: 'Instructions are required',
  CATEGORY_REQUIRED: 'Category is required',
  AREA_REQUIRED: 'Area is required',
  TIME_INVALID: 'Cooking time must be a positive number',
  
  // File upload errors
  FILE_REQUIRED: 'File not provided',
  FILE_TYPE_INVALID: 'Only images are allowed!',
  FILE_TOO_LARGE: 'File too large',
  
  // Server errors
  SERVER_ERROR: 'Server error',
  DATABASE_ERROR: 'Database error',
  UPLOAD_ERROR: 'File upload error'
};

const SUCCESS_MESSAGES = {
  // Auth success
  USER_REGISTERED: 'User successfully registered',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  
  // User success
  AVATAR_UPDATED: 'Avatar successfully updated',
  FOLLOW_SUCCESS: 'Successfully followed user',
  UNFOLLOW_SUCCESS: 'Successfully unfollowed user',
  
  // Recipe success
  RECIPE_CREATED: 'Recipe successfully created',
  RECIPE_DELETED: 'Recipe successfully deleted',
  RECIPE_FAVORITED: 'Recipe added to favorites',
  RECIPE_UNFAVORITED: 'Recipe removed from favorites'
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
