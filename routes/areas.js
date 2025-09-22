const express = require('express');
const { getAreas } = require('../controllers/areaController');

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

module.exports = router;
