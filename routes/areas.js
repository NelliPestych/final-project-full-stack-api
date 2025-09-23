import express from 'express';
import { getAreas } from '../controllers/areaController.js';

const router = express.Router();

/**
 * @swagger
 * /api/areas:
 *   get:
 *     summary: Get cuisine origin regions list
 *     tags: [Areas]
 *     responses:
 *       200:
 *         description: Areas list
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
