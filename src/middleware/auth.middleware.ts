// src/middleware/auth.middleware.07:17:56

import Jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

 export interface AuthRequest extends Request
{
  user?: any;
}

// Middleware to verify jwt token 
export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeder = req.headers.authorization;

    // Check for Bearer token
    if (!authHeder || !authHeder.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized no token provided" });
    }
    const token = authHeder.split("")[1];

    // Verify token 
    const decode = Jwt.verify(token, process.env.JWT_SECRET as string);

    //Add decode token to request body
    req.user = decode;
    next();
  } catch (error) {
    console.error("JWT error", error);

    return res.status(401).json({ message: "Unauthorized: invalid token"});
  }
};


