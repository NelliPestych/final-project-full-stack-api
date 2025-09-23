import pool from '../config/database.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

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
      cb(new Error('Only images are allowed!'));
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
        message: 'User not found'
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
      message: 'Server error while getting profile'
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
        message: 'User not found'
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
      message: 'Server error while getting user'
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
        message: 'Avatar file not provided'
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
      message: 'Avatar successfully updated',
      data: {
        avatar: result.rows[0].avatar
      }
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating avatar'
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
      message: 'Server error while getting followers'
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
      message: 'Server error while getting following'
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
        message: 'Cannot follow yourself'
      });
    }

    // Check if user exists
    const userResult = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
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
        message: 'You are already following this user'
      });
    }

    // Create follow relationship
    await pool.query(
      'INSERT INTO user_follows (follower_id, following_id) VALUES ($1, $2)',
      [followerId, id]
    );

    res.json({
      success: true,
      message: 'Successfully followed user'
    });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while following'
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
        message: 'You are not following this user'
      });
    }

    res.json({
      success: true,
      message: 'Successfully unfollowed user'
    });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while unfollowing'
    });
  }
};

// @desc    Update user profile (partial update)
// @route   PATCH /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }

    if (email !== undefined) {
      // Check if email is already taken by another user
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, userId]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'This email is already in use'
        });
      }

      updates.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No data to update'
      });
    }

    values.push(userId);
    const query = `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING id, name, email, avatar, created_at, updated_at`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile successfully updated',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};

export {
  getCurrentUser,
  getUserById,
  updateAvatar,
  updateProfile,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
  upload
};
