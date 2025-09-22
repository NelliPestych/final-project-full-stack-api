const pool = require('../config/database');

// @desc    Get all ingredients
// @route   GET /api/ingredients
// @access  Public
const getIngredients = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name FROM ingredients ORDER BY name ASC'
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get ingredients error:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка сервера при отриманні інгредієнтів'
    });
  }
};

module.exports = {
  getIngredients
};
