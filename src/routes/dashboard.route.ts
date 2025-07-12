// src/routes/dashboard.route.ts
import express from "express"
import { protect, } from "../middleware/auth.middleware.ts";
import type { AuthRequest } from "../middleware/auth.middleware.ts";

const router = express.Router();

router.get("/dashboard", protect, (req: AuthRequest, res) =>{
  res.json({ message: `Welcome to your dashboard, user ID: ${req.user.userId}`, });
});  

export default router;
