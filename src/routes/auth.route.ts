// src/routes/auth.route.ts
import express from "express";
import { signUpUsers, signInUser } from 
"../controllers/auth.controller.ts";
import UserInfo from "../models/user.models.ts";
import type { AuthRequest } from "../middleware/auth.middleware.ts";
import { protect } from "../middleware/auth.middleware.ts";
const router = express.Router();

router.post("/signup", signUpUsers);
router.post("/signin", signInUser);

// Logout route for front end to trigger logout
router.post("/logout", (_req, res) =>{
  // Just a succes message nothing more
  res.status(200).json({ message: "Logged out succesfully "});
})

// Get current user profile (protected route)
router.get("/profile", protect, async (req: AuthRequest, res) =>{
  try {
    console.log("Decoded user in request:", req.user);
    const { userId, email } = req.body || {};
     res.status(200).json({ message: "User profile fatched succesfully:", user: { userId, email}, });
  } catch (error) {
    console.error("Profile error:", error);

    res.status(500).json({ message: "Server error" });
  }
});

export default router;
