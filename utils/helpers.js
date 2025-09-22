// Utility functions for the Foodies API

/**
 * Format pagination response
 * @param {Array} data - Array of data
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {Object} Formatted pagination response
 */
const formatPagination = (data, page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

/**
 * Generate random string
 * @param {number} length - String length
 * @returns {string} Random string
 */
const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Sanitize filename for upload
 * @param {string} filename - Original filename
 * @returns {string} Sanitized filename
 */
const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Calculate recipe popularity score
 * @param {number} favoritesCount - Number of favorites
 * @param {number} viewsCount - Number of views (if available)
 * @param {Date} createdAt - Creation date
 * @returns {number} Popularity score
 */
const calculatePopularityScore = (favoritesCount, viewsCount = 0, createdAt) => {
  const now = new Date();
  const daysSinceCreation = Math.floor((now - new Date(createdAt)) / (1000 * 60 * 60 * 24));
  const timeDecay = Math.max(0.1, 1 - (daysSinceCreation / 365)); // Decay over a year
  
  return (favoritesCount * 2 + viewsCount) * timeDecay;
};

/**
 * Format recipe response with additional data
 * @param {Object} recipe - Recipe object from database
 * @param {Array} ingredients - Recipe ingredients
 * @param {number} favoritesCount - Number of favorites
 * @returns {Object} Formatted recipe response
 */
const formatRecipeResponse = (recipe, ingredients = [], favoritesCount = 0) => {
  return {
    ...recipe,
    ingredients,
    favoritesCount,
    popularityScore: calculatePopularityScore(favoritesCount, 0, recipe.created_at)
  };
};

/**
 * Check if user can perform action on resource
 * @param {number} userId - Current user ID
 * @param {number} resourceOwnerId - Resource owner ID
 * @param {string} action - Action being performed
 * @returns {boolean} Can perform action
 */
const canPerformAction = (userId, resourceOwnerId, action) => {
  if (userId === resourceOwnerId) return true;
  
  // Add more complex permission logic here if needed
  switch (action) {
    case 'read':
      return true; // Most resources are readable by everyone
    case 'update':
    case 'delete':
      return false; // Only owner can update/delete
    default:
      return false;
  }
};

/**
 * Generate search query conditions for recipes
 * @param {Object} filters - Search filters
 * @returns {Object} Query conditions and parameters
 */
const buildRecipeSearchQuery = (filters) => {
  const conditions = [];
  const params = [];
  let paramCount = 0;

  if (filters.category) {
    paramCount++;
    conditions.push(`c.name = $${paramCount}`);
    params.push(filters.category);
  }

  if (filters.area) {
    paramCount++;
    conditions.push(`a.name = $${paramCount}`);
    params.push(filters.area);
  }

  if (filters.ingredient) {
    paramCount++;
    conditions.push(`ri.ingredient_id IN (
      SELECT id FROM ingredients WHERE name ILIKE $${paramCount}
    )`);
    params.push(`%${filters.ingredient}%`);
  }

  if (filters.title) {
    paramCount++;
    conditions.push(`r.title ILIKE $${paramCount}`);
    params.push(`%${filters.title}%`);
  }

  if (filters.timeMin) {
    paramCount++;
    conditions.push(`r.time >= $${paramCount}`);
    params.push(parseInt(filters.timeMin));
  }

  if (filters.timeMax) {
    paramCount++;
    conditions.push(`r.time <= $${paramCount}`);
    params.push(parseInt(filters.timeMax));
  }

  return {
    whereClause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    params
  };
};

module.exports = {
  formatPagination,
  generateRandomString,
  sanitizeFilename,
  isValidEmail,
  calculatePopularityScore,
  formatRecipeResponse,
  canPerformAction,
  buildRecipeSearchQuery
};
