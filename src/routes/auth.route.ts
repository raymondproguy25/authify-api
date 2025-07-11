// src/routes/auth.route.ts
import express from "express";
import { signUpUsers, signInUser } from 
"../controllers/auth.controller.ts";

const router = express.Router();

router.post("/signup", signUpUsers);
router.post("/signin", signInUser);

export default router;
