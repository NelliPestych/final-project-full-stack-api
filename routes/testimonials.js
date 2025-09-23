import express from 'express';
import { getTestimonials } from '../controllers/testimonialController.js';

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

export default router;
