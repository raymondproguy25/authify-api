// src/routes/auth.route.ts
import express from "express";
import { signUpUsers } from 
"../controllers/auth.controller.ts";

const router = express.Router();

router.post("/signup", signUpUsers);

export default router;
