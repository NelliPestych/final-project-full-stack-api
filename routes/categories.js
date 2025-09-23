import express from 'express';
import { getCategories } from '../controllers/categoryController.js';

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get recipe categories list
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories list
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
