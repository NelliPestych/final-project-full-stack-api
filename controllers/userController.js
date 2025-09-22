const pool = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/avatars';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Тільки зображення дозволені!'));
    }
  }
});

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user basic info
    const userResult = await pool.query(
      'SELECT id, name, email, avatar, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Користувач не знайдений'
      });
    }

    const user = userResult.rows[0];

    // Get user statistics
    const [
      recipesCount,
      favoritesCount,
      followersCount,
      followingCount
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM recipes WHERE owner_id = $1', [userId]),
      pool.query('SELECT COUNT(*) as count FROM user_favorite_recipes WHERE user_id = $1', [userId]),
      pool.query('SELECT COUNT(*) as count FROM user_follows WHERE following_id = $1', [userId]),
      pool.query('SELECT COUNT(*) as count FROM user_follows WHERE follower_id = $1', [userId])
    ]);

    res.json({
      success: true,
      data: {
        ...user,
        recipesCount: parseInt(recipesCount.rows[0].count),
        favoritesCount: parseInt(favoritesCount.rows[0].count),
        followersCount: parseInt(followersCount.rows[0].count),
        followingCount: parseInt(followingCount.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка сервера при отриманні профілю'
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get user basic info
    const userResult = await pool.query(
      'SELECT id, name, email, avatar, created_at FROM users WHERE id = $1',
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Користувач не знайдений'
      });
    }

    const user = userResult.rows[0];

    // Get user statistics
    const [recipesCount, followersCount] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM recipes WHERE owner_id = $1', [id]),
      pool.query('SELECT COUNT(*) as count FROM user_follows WHERE following_id = $1', [id])
    ]);

    res.json({
      success: true,
      data: {
        ...user,
        recipesCount: parseInt(recipesCount.rows[0].count),
        followersCount: parseInt(followersCount.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка сервера при отриманні користувача'
    });
  }
};

// @desc    Update user avatar
// @route   PUT /api/users/avatar
// @access  Private
const updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Файл аватарки не надано'
      });
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    // Update user avatar in database
    const result = await pool.query(
      'UPDATE users SET avatar = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING avatar',
      [avatarPath, userId]
    );

    res.json({
      success: true,
      message: 'Аватарка успішно оновлена',
      data: {
        avatar: result.rows[0].avatar
      }
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка сервера при оновленні аватарки'
    });
  }
};

// @desc    Get user followers
// @route   GET /api/users/followers
// @access  Private
const getFollowers = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT u.id, u.name, u.email, u.avatar, uf.created_at as followed_at
      FROM users u
      JOIN user_follows uf ON u.id = uf.follower_id
      WHERE uf.following_id = $1
      ORDER BY uf.created_at DESC
    `, [userId]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка сервера при отриманні підписників'
    });
  }
};

// @desc    Get user following
// @route   GET /api/users/following
// @access  Private
const getFollowing = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT u.id, u.name, u.email, u.avatar, uf.created_at as followed_at
      FROM users u
      JOIN user_follows uf ON u.id = uf.following_id
      WHERE uf.follower_id = $1
      ORDER BY uf.created_at DESC
    `, [userId]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка сервера при отриманні підписок'
    });
  }
};

// @desc    Follow user
// @route   POST /api/users/follow/:id
// @access  Private
const followUser = async (req, res) => {
  try {
    const { id } = req.params;
    const followerId = req.user.id;

    if (followerId === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'Не можна підписатися на самого себе'
      });
    }

    // Check if user exists
    const userResult = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Користувач не знайдений'
      });
    }

    // Check if already following
    const existingFollow = await pool.query(
      'SELECT id FROM user_follows WHERE follower_id = $1 AND following_id = $2',
      [followerId, id]
    );

    if (existingFollow.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ви вже підписані на цього користувача'
      });
    }

    // Create follow relationship
    await pool.query(
      'INSERT INTO user_follows (follower_id, following_id) VALUES ($1, $2)',
      [followerId, id]
    );

    res.json({
      success: true,
      message: 'Успішно підписались на користувача'
    });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка сервера при підписці'
    });
  }
};

// @desc    Unfollow user
// @route   DELETE /api/users/follow/:id
// @access  Private
const unfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const followerId = req.user.id;

    const result = await pool.query(
      'DELETE FROM user_follows WHERE follower_id = $1 AND following_id = $2',
      [followerId, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ви не підписані на цього користувача'
      });
    }

    res.json({
      success: true,
      message: 'Успішно відписались від користувача'
    });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка сервера при відписці'
    });
  }
};

module.exports = {
  getCurrentUser,
  getUserById,
  updateAvatar,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
  upload
};
