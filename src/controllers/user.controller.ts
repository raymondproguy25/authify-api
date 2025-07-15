// src/controllers/user.controller.ts
import type { Response } from "express";
import bcrypt from "bcryptjs";
import UserInfo from "../models/user.models.ts";
import type { AuthRequest } from "../middleware/auth.middleware.ts";

/**
 * @swagger
 * /api/v1/auth/update-profile:
 *   patch:
 *     summary: Update user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @desc    Update user profile
 * @route   PATCH /api/v1/auth/update-profile
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

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   patch:
 *     summary: Change user password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Unauthorized or current password is incorrect
 *       500:
 *         description: Server error
 */

/**
 * @desc    Change user password
 * @route   PATCH /api/v1/auth/change-password
 * @access  Private (requires JWT)
 */
export const changePassword = async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await UserInfo.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash and update the new password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    user.password = hashed;

    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
