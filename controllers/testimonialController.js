import pool from '../config/database.js';

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.id, t.testimonial, t.created_at,
             u.name as owner_name, u.avatar as owner_avatar
      FROM testimonials t
      JOIN users u ON t.owner_id = u.id
      ORDER BY t.created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while getting testimonials'
    });
  }
};

export {
  getTestimonials
};
