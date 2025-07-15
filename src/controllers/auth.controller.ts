// src/controllers/auth.controller.ts
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserInfo from "../models/user.models.ts";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */

/**
 * @desc    SignUp a user
 * @route   POST /api/v1/auth/signup
 * @access  Public
 */

export const signUpUsers = async (req: Request, res: Response) =>{
  try {
    let { username, email, phone, password } = req.body;
    email = email.trim().toLowerCase();

    // Checks for duplicate email in database
    const checkIfUserExits = await 
    UserInfo.findOne( { email });
    if(checkIfUserExits) {
      return res.status(400).json({ message: `User with ${email} already exits` });
    }
    // Hased password with bcrypt for security
    const hidPassword = await bcrypt.hash(password, 10);
    const accountCreated = await UserInfo.create({
      username,
      email,
      phone,
      password: hidPassword,
    });

    //keep password and phone number from user 
    return res.status(201).json({ message: "User created successfully ",
     user: {
       id: accountCreated._id,
       username: accountCreated.username,
       email: accountCreated.email,
     },
    });

  } catch (error) {
    console.error("Opps can't register user somthing missing", error);

    return res.json(500).json({ message: "Server error" });
  }
};

/**
 * @swagger
 * /api/v1/auth/signin:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

/**
 * @desc    SignIn a user
 * @route   POST /api/v1/auth/signin
 * @access  Public
 */

 export const signInUser = async (req: Request, 
                                  res: Response) =>{
  try {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();
    const user = await UserInfo.findOne({ email }); 
    // check if user with email exits
    if (!user) {
      return res.status(400).json({ message: "Invalid credentails, please try again "});
    }
    // compare password fir safty
    const comfirmPassword = await bcrypt.compare(password, user.password);
    if (!comfirmPassword) {
      return res.status(401).json({ message: "Invalid credentails"});
    } 
    // generate token for user
    const generateToken = jwt.sign({userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    return res.status(201).json({ message: "Login successfully ", generateToken, user: {
     id: user._id,
     username: user.username,
     email: user.email,
      },
    });
  } catch (error) {
    console.error("Opps can't login somthing went wrong trying to login:", error);

    res.status(500).json({ message: "Server error" });
  }
};

