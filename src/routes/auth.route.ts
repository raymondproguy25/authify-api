// src/routes/auth.route.ts
import express from "express";
import { signUpUsers, signInUser } from 
"../controllers/auth.controller.ts";

const router = express.Router();

router.post("/signup", signUpUsers);
router.post("/signin", signInUser);

// Logout route for front end to trigger logout
router.post("/logout", (_req, res) =>{
  // Just a succes message nothing more
  res.status(200).json({ message: "Logged out succesfully "});
})

export default router;
