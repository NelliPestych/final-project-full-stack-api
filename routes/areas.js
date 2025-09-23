import express from 'express';
import { getAreas } from '../controllers/areaController.js';

const router = express.Router();

/**
 * @swagger
 * /api/areas:
 *   get:
 *     summary: Отримати список регіонів походження страв
 *     tags: [Areas]
 *     responses:
 *       200:
 *         description: Список регіонів
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
 *                     $ref: '#/components/schemas/Area'
 */
router.get('/', getAreas);

export default router;
