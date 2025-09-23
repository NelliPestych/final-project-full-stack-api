import express from 'express';
import { getTestimonials } from '../controllers/testimonialController.js';

const router = express.Router();

/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     summary: Get testimonials list
 *     tags: [Testimonials]
 *     responses:
 *       200:
 *         description: Testimonials list
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
