// src/controllers/auth.controller.ts
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserInfo from "../models/user.models.ts";
import jwt from "jsonwebtoken";
import type { AuthRequest } from "../middleware/auth.middleware.ts";

// @desc Register new account
// @route POST /auth/signup
// @access Public

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
 * @desc    Login a user
 * @route   POST /auth/signin
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

/**
 * @desc    Update user profile
 * @route   PATCH /auth/update-profile
 * @access  Private (requires JWT)
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { username, phone } = req.body;

  try {
    // Ensure user is authenticated
    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find and update user
    const user = await UserInfo.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) user.username = username.trim();
    if (phone) user.phone = phone;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        phone: user.phone,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
