import express from 'express';
import { getCategories } from '../controllers/categoryController.js';

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Отримати список категорій рецептів
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Список категорій
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
 *                     $ref: '#/components/schemas/Category'
 */
router.get('/', getCategories);

export default router;
