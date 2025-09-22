const express = require('express');
const { getCurrentUser, getUserById, updateAvatar, getFollowers, getFollowing, followUser, unfollowUser, upload } = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Отримати профіль поточного користувача
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Профіль користувача
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
 *     summary: Отримати профіль користувача за ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID користувача
 *     responses:
 *       200:
 *         description: Профіль користувача
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
 *     summary: Оновити аватарку користувача
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
 *                 description: Файл зображення аватарки
 *     responses:
 *       200:
 *         description: Аватарка успішно оновлена
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
 *                   example: "Аватарка успішно оновлена"
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
 * /api/users/followers:
 *   get:
 *     summary: Отримати список підписників
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список підписників
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
 *     summary: Отримати список підписок
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список підписок
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
 * /api/users/follow/{id}:
 *   post:
 *     summary: Підписатися на користувача
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID користувача для підписки
 *     responses:
 *       200:
 *         description: Успішно підписались
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
 *                   example: "Успішно підписались на користувача"
 *       400:
 *         description: Помилка підписки
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/follow/:id', auth, followUser);

/**
 * @swagger
 * /api/users/follow/{id}:
 *   delete:
 *     summary: Відписатися від користувача
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID користувача для відписки
 *     responses:
 *       200:
 *         description: Успішно відписались
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
 *                   example: "Успішно відписались від користувача"
 *       404:
 *         description: Підписка не знайдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/follow/:id', auth, unfollowUser);

module.exports = router;
