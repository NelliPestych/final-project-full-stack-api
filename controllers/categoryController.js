import pool from '../config/database.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name FROM categories ORDER BY name ASC'
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка сервера при отриманні категорій'
    });
  }
};

export {
  getCategories
};
