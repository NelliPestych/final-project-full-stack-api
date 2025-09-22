const pool = require('../config/database');

// @desc    Search recipes
// @route   GET /api/recipes/search
// @access  Public
const searchRecipes = async (req, res) => {
  try {
    const { 
      category, 
      ingredient, 
      area, 
      page = 1, 
      limit = 12,
      title 
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    let paramCount = 0;

    // Build WHERE conditions
    if (category) {
      paramCount++;
      whereConditions.push(`c.name = $${paramCount}`);
      queryParams.push(category);
    }

    if (area) {
      paramCount++;
      whereConditions.push(`a.name = $${paramCount}`);
      queryParams.push(area);
    }

    if (ingredient) {
      paramCount++;
      whereConditions.push(`ri.ingredient_id IN (
        SELECT id FROM ingredients WHERE name ILIKE $${paramCount}
      )`);
      queryParams.push(`%${ingredient}%`);
    }

    if (title) {
      paramCount++;
      whereConditions.push(`r.title ILIKE $${paramCount}`);
      queryParams.push(`%${title}%`);
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Build main query
    let mainQuery = `
      SELECT r.id, r.title, r.description, r.thumb, r.time, 
             c.name as category, a.name as area,
             u.name as owner_name, u.avatar as owner_avatar,
             COUNT(ufr.id) as favorites_count
      FROM recipes r
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN areas a ON r.area_id = a.id
      LEFT JOIN users u ON r.owner_id = u.id
      LEFT JOIN user_favorite_recipes ufr ON r.id = ufr.recipe_id
      LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
      ${whereClause}
      GROUP BY r.id, r.title, r.description, r.thumb, r.time, 
               c.name, a.name, u.name, u.avatar, r.created_at
      ORDER BY r.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(parseInt(limit), offset);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(DISTINCT r.id) as total
      FROM recipes r
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN areas a ON r.area_id = a.id
      LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
      ${whereClause}
    `;

    const [recipesResult, countResult] = await Promise.all([
      pool.query(mainQuery, queryParams),
      pool.query(countQuery, queryParams.slice(0, -2))
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        recipes: recipesResult.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Search recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка сервера при пошуку рецептів'
    });
  }
};

// @desc    Get recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get recipe details
    const recipeResult = await pool.query(`
      SELECT r.id, r.title, r.description, r.instructions, r.thumb, r.time,
             c.name as category, a.name as area,
             u.id as owner_id, u.name as owner_name, u.avatar as owner_avatar,
             r.created_at, r.updated_at
      FROM recipes r
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN areas a ON r.area_id = a.id
      LEFT JOIN users u ON r.owner_id = u.id
      WHERE r.id = $1
    `, [id]);

    if (recipeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Рецепт не знайдений'
      });
    }

    const recipe = recipeResult.rows[0];

    // Get recipe ingredients
    const ingredientsResult = await pool.query(`
      SELECT i.id, i.name, ri.measure
      FROM recipe_ingredients ri
      JOIN ingredients i ON ri.ingredient_id = i.id
      WHERE ri.recipe_id = $1
      ORDER BY i.name
    `, [id]);

    // Get favorites count
    const favoritesResult = await pool.query(
      'SELECT COUNT(*) as count FROM user_favorite_recipes WHERE recipe_id = $1',
      [id]
    );

    res.json({
      success: true,
      data: {
        ...recipe,
        ingredients: ingredientsResult.rows,
        favoritesCount: parseInt(favoritesResult.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Get recipe by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка сервера при отриманні рецепту'
    });
  }
};

// @desc    Get popular recipes
// @route   GET /api/recipes/popular
// @access  Public
const getPopularRecipes = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const result = await pool.query(`
      SELECT r.id, r.title, r.description, r.thumb, r.time,
             c.name as category, a.name as area,
             u.name as owner_name, u.avatar as owner_avatar,
             COUNT(ufr.id) as favorites_count
      FROM recipes r
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN areas a ON r.area_id = a.id
      LEFT JOIN users u ON r.owner_id = u.id
      LEFT JOIN user_favorite_recipes ufr ON r.id = ufr.recipe_id
      GROUP BY r.id, r.title, r.description, r.thumb, r.time, 
               c.name, a.name, u.name, u.avatar
      ORDER BY favorites_count DESC, r.created_at DESC
      LIMIT $1
    `, [parseInt(limit)]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get popular recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка сервера при отриманні популярних рецептів'
    });
  }
};

// @desc    Create recipe
// @route   POST /api/recipes
// @access  Private
const createRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      instructions,
      thumb,
      time,
      category,
      area,
      ingredients
    } = req.body;

    const ownerId = req.user.id;

    // Get category and area IDs
    const [categoryResult, areaResult] = await Promise.all([
      pool.query('SELECT id FROM categories WHERE name = $1', [category]),
      pool.query('SELECT id FROM areas WHERE name = $1', [area])
    ]);

    const categoryId = categoryResult.rows[0]?.id;
    const areaId = areaResult.rows[0]?.id;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Категорія не знайдена'
      });
    }

    if (!areaId) {
      return res.status(400).json({
        success: false,
        message: 'Регіон не знайдений'
      });
    }

    // Create recipe
    const recipeResult = await pool.query(`
      INSERT INTO recipes (title, description, instructions, thumb, time, category_id, area_id, owner_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, title, description, instructions, thumb, time, created_at
    `, [title, description, instructions, thumb, parseInt(time), categoryId, areaId, ownerId]);

    const recipe = recipeResult.rows[0];

    // Add ingredients
    if (ingredients && Array.isArray(ingredients)) {
      for (const ingredient of ingredients) {
        await pool.query(`
          INSERT INTO recipe_ingredients (recipe_id, ingredient_id, measure)
          VALUES ($1, $2, $3)
        `, [recipe.id, ingredient.id, ingredient.measure]);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Рецепт успішно створений',
      data: recipe
    });
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка сервера при створенні рецепту'
    });
  }
};

// @desc    Get user's recipes
// @route   GET /api/recipes/my
// @access  Private
const getMyRecipes = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const [recipesResult, countResult] = await Promise.all([
      pool.query(`
        SELECT r.id, r.title, r.description, r.thumb, r.time,
               c.name as category, a.name as area,
               COUNT(ufr.id) as favorites_count
        FROM recipes r
        LEFT JOIN categories c ON r.category_id = c.id
        LEFT JOIN areas a ON r.area_id = a.id
        LEFT JOIN user_favorite_recipes ufr ON r.id = ufr.recipe_id
        WHERE r.owner_id = $1
        GROUP BY r.id, r.title, r.description, r.thumb, r.time, c.name, a.name
        ORDER BY r.created_at DESC
        LIMIT $2 OFFSET $3
      `, [ownerId, parseInt(limit), offset]),
      pool.query('SELECT COUNT(*) as count FROM recipes WHERE owner_id = $1', [ownerId])
    ]);

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        recipes: recipesResult.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get my recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка сервера при отриманні ваших рецептів'
    });
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private
const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.id;

    const result = await pool.query(
      'DELETE FROM recipes WHERE id = $1 AND owner_id = $2',
      [id, ownerId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Рецепт не знайдений або ви не маєте прав на його видалення'
      });
    }

    res.json({
      success: true,
      message: 'Рецепт успішно видалений'
    });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка сервера при видаленні рецепту'
    });
  }
};

// @desc    Add recipe to favorites
// @route   POST /api/recipes/:id/favorite
// @access  Private
const addToFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if recipe exists
    const recipeResult = await pool.query('SELECT id FROM recipes WHERE id = $1', [id]);
    if (recipeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Рецепт не знайдений'
      });
    }

    // Check if already in favorites
    const existingFavorite = await pool.query(
      'SELECT id FROM user_favorite_recipes WHERE user_id = $1 AND recipe_id = $2',
      [userId, id]
    );

    if (existingFavorite.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Рецепт вже в улюблених'
      });
    }

    // Add to favorites
    await pool.query(
      'INSERT INTO user_favorite_recipes (user_id, recipe_id) VALUES ($1, $2)',
      [userId, id]
    );

    res.json({
      success: true,
      message: 'Рецепт додано до улюблених'
    });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка сервера при додаванні до улюблених'
    });
  }
};

// @desc    Remove recipe from favorites
// @route   DELETE /api/recipes/:id/favorite
// @access  Private
const removeFromFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'DELETE FROM user_favorite_recipes WHERE user_id = $1 AND recipe_id = $2',
      [userId, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Рецепт не знайдений в улюблених'
      });
    }

    res.json({
      success: true,
      message: 'Рецепт видалено з улюблених'
    });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка сервера при видаленні з улюблених'
    });
  }
};

// @desc    Get favorite recipes
// @route   GET /api/recipes/favorites
// @access  Private
const getFavoriteRecipes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const [recipesResult, countResult] = await Promise.all([
      pool.query(`
        SELECT r.id, r.title, r.description, r.thumb, r.time,
               c.name as category, a.name as area,
               u.name as owner_name, u.avatar as owner_avatar,
               ufr.created_at as favorited_at
        FROM user_favorite_recipes ufr
        JOIN recipes r ON ufr.recipe_id = r.id
        LEFT JOIN categories c ON r.category_id = c.id
        LEFT JOIN areas a ON r.area_id = a.id
        LEFT JOIN users u ON r.owner_id = u.id
        WHERE ufr.user_id = $1
        ORDER BY ufr.created_at DESC
        LIMIT $2 OFFSET $3
      `, [userId, parseInt(limit), offset]),
      pool.query('SELECT COUNT(*) as count FROM user_favorite_recipes WHERE user_id = $1', [userId])
    ]);

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        recipes: recipesResult.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get favorite recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка сервера при отриманні улюблених рецептів'
    });
  }
};

module.exports = {
  searchRecipes,
  getRecipeById,
  getPopularRecipes,
  createRecipe,
  getMyRecipes,
  deleteRecipe,
  addToFavorites,
  removeFromFavorites,
  getFavoriteRecipes
};
