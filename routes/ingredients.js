import express from 'express';
import { getIngredients } from '../controllers/ingredientController.js';

const router = express.Router();

/**
 * @swagger
 * /api/ingredients:
 *   get:
 *     summary: Get ingredients list
 *     tags: [Ingredients]
 *     responses:
 *       200:
 *         description: Ingredients list
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

export default router;
