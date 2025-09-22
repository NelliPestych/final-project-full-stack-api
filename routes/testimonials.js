const express = require('express');
const { getTestimonials } = require('../controllers/testimonialController');

const router = express.Router();

/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     summary: Отримати список відгуків
 *     tags: [Testimonials]
 *     responses:
 *       200:
 *         description: Список відгуків
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
 *                     $ref: '#/components/schemas/Testimonial'
 */
router.get('/', getTestimonials);

module.exports = router;
