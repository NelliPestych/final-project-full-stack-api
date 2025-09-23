import express from 'express';
import { body } from 'express-validator';
import { 
  searchRecipes, 
  getRecipeById, 
  getPopularRecipes, 
  createRecipe, 
  getMyRecipes, 
  deleteRecipe, 
  addToFavorites, 
  removeFromFavorites, 
  getFavoriteRecipes,
  checkRecipeExists
} from '../controllers/recipeController.js';
import { validate } from '../middleware/validation.js';
import auth from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/recipes/search:
 *   get:
 *     summary: Пошук рецептів
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Назва категорії
 *       - in: query
 *         name: ingredient
 *         schema:
 *           type: string
 *         description: Назва інгредієнта
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *         description: Назва регіону
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Назва рецепту
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер сторінки
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Кількість рецептів на сторінці
 *     responses:
 *       200:
 *         description: Результати пошуку
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     recipes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Recipe'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalItems:
 *                           type: integer
 *                         itemsPerPage:
 *                           type: integer
 */
router.get('/search', searchRecipes);

/**
 * @swagger
 * /api/recipes/popular:
 *   get:
 *     summary: Отримати популярні рецепти
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Кількість рецептів
 *     responses:
 *       200:
 *         description: Список популярних рецептів
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
 *                     $ref: '#/components/schemas/Recipe'
 */
router.get('/popular', getPopularRecipes);

/**
 * @swagger
 * /api/recipes/{id}:
 *   head:
 *     summary: Перевірити існування рецепту
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID рецепту
 *     responses:
 *       200:
 *         description: Рецепт існує
 *       404:
 *         description: Рецепт не знайдений
 */
router.head('/:id', checkRecipeExists);

/**
 * @swagger
 * /api/recipes/favorites:
 *   get:
 *     summary: Отримати улюблені рецепти
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер сторінки
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Кількість рецептів на сторінці
 *     responses:
 *       200:
 *         description: Список улюблених рецептів
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     recipes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Recipe'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalItems:
 *                           type: integer
 *                         itemsPerPage:
 *                           type: integer
 */
router.get('/favorites', auth, getFavoriteRecipes);

/**
 * @swagger
 * /api/recipes/my:
 *   get:
 *     summary: Отримати мої рецепти
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер сторінки
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Кількість рецептів на сторінці
 *     responses:
 *       200:
 *         description: Список моїх рецептів
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     recipes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Recipe'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalItems:
 *                           type: integer
 *                         itemsPerPage:
 *                           type: integer
 */
router.get('/my', auth, getMyRecipes);

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Отримати рецепт за ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID рецепту
 *     responses:
 *       200:
 *         description: Детальна інформація про рецепт
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
 *                     - $ref: '#/components/schemas/Recipe'
 *                     - type: object
 *                       properties:
 *                         ingredients:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               measure:
 *                                 type: string
 *                         favoritesCount:
 *                           type: integer
 *       404:
 *         description: Рецепт не знайдений
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getRecipeById);

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     summary: Створити новий рецепт
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - instructions
 *               - category
 *               - area
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Борщ український"
 *               description:
 *                 type: string
 *                 example: "Традиційний український борщ"
 *               instructions:
 *                 type: string
 *                 example: "1. Зварити м'ясо..."
 *               thumb:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/borch.jpg"
 *               time:
 *                 type: integer
 *                 example: 120
 *               category:
 *                 type: string
 *                 example: "Soup"
 *               area:
 *                 type: string
 *                 example: "Ukrainian"
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     measure:
 *                       type: string
 *                       example: "500g"
 *     responses:
 *       201:
 *         description: Рецепт успішно створений
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
 *                   example: "Рецепт успішно створений"
 *                 data:
 *                   $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Помилка валідації
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', [
  body('title')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Назва рецепту повинна містити від 2 до 200 символів'),
  body('instructions')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Інструкції повинні містити мінімум 10 символів'),
  body('category')
    .notEmpty()
    .withMessage('Категорія обов\'язкова'),
  body('area')
    .notEmpty()
    .withMessage('Регіон обов\'язковий'),
  body('time')
    .isInt({ min: 1 })
    .withMessage('Час приготування повинен бути додатним числом')
], validate, auth, createRecipe);

/**
 * @swagger
 * /api/recipes/{id}:
 *   delete:
 *     summary: Видалити рецепт
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID рецепту
 *     responses:
 *       200:
 *         description: Рецепт успішно видалений
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
 *                   example: "Рецепт успішно видалений"
 *       404:
 *         description: Рецепт не знайдений
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', auth, deleteRecipe);

/**
 * @swagger
 * /api/recipes/{id}/favorite:
 *   post:
 *     summary: Додати рецепт до улюблених
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID рецепту
 *     responses:
 *       200:
 *         description: Рецепт додано до улюблених
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
 *                   example: "Рецепт додано до улюблених"
 *       400:
 *         description: Рецепт вже в улюблених
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Рецепт не знайдений
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/favorite', auth, addToFavorites);

/**
 * @swagger
 * /api/recipes/{id}/favorite:
 *   delete:
 *     summary: Видалити рецепт з улюблених
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID рецепту
 *     responses:
 *       200:
 *         description: Рецепт видалено з улюблених
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
 *                   example: "Рецепт видалено з улюблених"
 *       404:
 *         description: Рецепт не знайдений в улюблених
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id/favorite', auth, removeFromFavorites);

export default router;
