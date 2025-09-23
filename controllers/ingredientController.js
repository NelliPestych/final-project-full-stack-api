import pool from '../config/database.js';

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
      message: 'Server error while getting ingredients'
    });
  }
};

export {
  getIngredients
};
