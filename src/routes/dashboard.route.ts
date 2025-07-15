// src/routes/dashboard.route.ts

/**
 * @swagger
 * /api/v1/dashboard:
 *   get:
 *     summary: Access dashboard (protected)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
 *       401:
 *         description: Unauthorized
 */

import express from "express"
import { protect, } from "../middleware/auth.middleware.ts";
import type { AuthRequest } from "../middleware/auth.middleware.ts";

const router = express.Router();

router.get("/dashboard", protect, (req: AuthRequest, res) =>{
  res.json({ message: `Welcome to your dashboard, user ID: ${req.user.userId}`, });
});  

export default router;
