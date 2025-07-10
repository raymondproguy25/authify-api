// src/controllers/auth.controller.ts
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserInfo from "../models/user.models.ts";

//@desc Register new account
//@route POST /auth/signup
//@access Public

export const signUpUsers = async (req: Request, res: Response) =>{
  try {
    const { username, email, phone, password } = req.body;

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

    return res.json(500).json({ message: "Somthing went wrong" });
  }
};
