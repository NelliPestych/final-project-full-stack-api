const express = require('express');
const { getIngredients } = require('../controllers/ingredientController');

const router = express.Router();

/**
 * @swagger
 * /api/ingredients:
 *   get:
 *     summary: Отримати список інгредієнтів
 *     tags: [Ingredients]
 *     responses:
 *       200:
 *         description: Список інгредієнтів
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
 *                     $ref: '#/components/schemas/Ingredient'
 */
router.get('/', getIngredients);

module.exports = router;
