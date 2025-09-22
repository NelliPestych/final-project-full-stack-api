const pool = require('../config/database');

// @desc    Get all areas
// @route   GET /api/areas
// @access  Public
const getAreas = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name FROM areas ORDER BY name ASC'
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get areas error:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка сервера при отриманні регіонів'
    });
  }
};

module.exports = {
  getAreas
};
