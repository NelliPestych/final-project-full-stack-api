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
 *     summary: Search recipes
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category name
 *       - in: query
 *         name: ingredient
 *         schema:
 *           type: string
 *         description: Ingredient name
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *         description: Area name
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Recipe name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Number of recipes per page
 *     responses:
 *       200:
 *         description: Search results
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
 *     summary: Get popular recipes
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of recipes
 *     responses:
 *       200:
 *         description: Popular recipes list
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
 *     summary: Check recipe existence
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe exists
 *       404:
 *         description: Recipe not found
 */
router.head('/:id', checkRecipeExists);

/**
 * @swagger
 * /api/recipes/favorites:
 *   get:
 *     summary: Get favorite recipes
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Number of recipes per page
 *     responses:
 *       200:
 *         description: Favorite recipes list
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
 *     summary: Get my recipes
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Number of recipes per page
 *     responses:
 *       200:
 *         description: My recipes list
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
 *     summary: Get recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Detailed recipe information
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
 *         description: Recipe not found
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
 *     summary: Create new recipe
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
 *                 example: "Ukrainian Borscht"
 *               description:
 *                 type: string
 *                 example: "Traditional Ukrainian borscht"
 *               instructions:
 *                 type: string
 *                 example: "1. Cook meat..."
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
 *         description: Recipe successfully created
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
 *                   example: "Recipe successfully created"
 *                 data:
 *                   $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', [
  body('title')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Recipe title must contain 2 to 200 characters'),
  body('instructions')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Instructions must contain at least 10 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required'),
  body('area')
    .notEmpty()
    .withMessage('Area is required'),
  body('time')
    .isInt({ min: 1 })
    .withMessage('Cooking time must be a positive number')
], validate, auth, createRecipe);

/**
 * @swagger
 * /api/recipes/{id}:
 *   delete:
 *     summary: Delete recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe successfully deleted
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
 *                   example: "Recipe successfully deleted"
 *       404:
 *         description: Recipe not found
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
 *     summary: Add recipe to favorites
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe added to favorites
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
 *                   example: "Recipe added to favorites"
 *       400:
 *         description: Recipe already in favorites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Recipe not found
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
 *     summary: Remove recipe from favorites
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe removed from favorites
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
 *                   example: "Recipe removed from favorites"
 *       404:
 *         description: Recipe not found in favorites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id/favorite', auth, removeFromFavorites);

export default router;
