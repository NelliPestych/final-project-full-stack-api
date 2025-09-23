import express from 'express';
import { getCurrentUser, getUserById, updateAvatar, updateProfile, getFollowers, getFollowing, followUser, unfollowUser, upload } from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/User'
 *                     - type: object
 *                       properties:
 *                         recipesCount:
 *                           type: integer
 *                           example: 15
 *                         favoritesCount:
 *                           type: integer
 *                           example: 42
 *                         followersCount:
 *                           type: integer
 *                           example: 128
 *                         followingCount:
 *                           type: integer
 *                           example: 67
 */
router.get('/profile', auth, getCurrentUser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/User'
 *                     - type: object
 *                       properties:
 *                         recipesCount:
 *                           type: integer
 *                           example: 15
 *                         followersCount:
 *                           type: integer
 *                           example: 128
 */
router.get('/:id', auth, getUserById);

/**
 * @swagger
 * /api/users/avatar:
 *   put:
 *     summary: Update user avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file
 *     responses:
 *       200:
 *         description: Avatar successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Avatar successfully updated"
 *                 data:
 *                   type: object
 *                   properties:
 *                     avatar:
 *                       type: string
 *                       example: "/uploads/avatars/avatar-1234567890.jpg"
 */
router.put('/avatar', auth, upload.single('avatar'), updateAvatar);

/**
 * @swagger
 * /api/users/profile:
 *   patch:
 *     summary: Partially update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New name"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "new@example.com"
 *     responses:
 *       200:
 *         description: Profile successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Profile successfully updated"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/profile', auth, updateProfile);

/**
 * @swagger
 * /api/users/followers:
 *   get:
 *     summary: Get followers list
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Followers list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/User'
 *                       - type: object
 *                         properties:
 *                           followed_at:
 *                             type: string
 *                             format: date-time
 */
router.get('/followers', auth, getFollowers);

/**
 * @swagger
 * /api/users/following:
 *   get:
 *     summary: Get following list
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Following list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/User'
 *                       - type: object
 *                         properties:
 *                           followed_at:
 *                             type: string
 *                             format: date-time
 */
router.get('/following', auth, getFollowing);

/**
 * @swagger
 * /api/users/{id}/follow:
 *   post:
 *     summary: Follow user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to follow
 *     responses:
 *       200:
 *         description: Successfully followed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Successfully followed user"
 *       400:
 *         description: Follow error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/follow', auth, followUser);

/**
 * @swagger
 * /api/users/{id}/follow:
 *   delete:
 *     summary: Unfollow user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to unfollow
 *     responses:
 *       200:
 *         description: Successfully unfollowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Successfully unfollowed user"
 *       404:
 *         description: Follow not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id/follow', auth, unfollowUser);

export default router;
