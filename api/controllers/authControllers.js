import User from "../models/Users.js";
import crypto from "crypto";
//import bcrypt from "bcryptjs";
import PasswordResetToken from "../models/PasswordResetToken.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const sendVerificationEmail = async (user) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const verificationToken = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
  const htmlContent = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); background-color: #ffffff;">
  <div style="text-align: center; margin-bottom: 20px;">
    <div style="display: inline-block; position: relative; width: 120px; height: 120px; overflow: hidden; border-radius: 50%; border: 4px solid #5d6544; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
      <img src="https://firebasestorage.googleapis.com/v0/b/hdarne-3d2b6.appspot.com/o/profilePics%2FfoodigoLogo.jpeg?alt=media&token=101a2049-1009-45e3-a364-534ee23c5153" 
           alt="Foodigo Logo" 
           style="width: 100%; height: 100%; object-fit: cover; display: block;">
    </div>
  </div>
  <h2 style="color: #5d6544; text-align: center; margin-bottom: 20px;">Welcome to Foodigo, ${user.name}!</h2>
  <p style="color: #333; font-size: 16px; line-height: 1.6;">We're excited to have you join us on your culinary journey!</p>
  <p style="color: #333; font-size: 16px; line-height: 1.6;">Foodigo is your go-to app for discovering and organizing recipes, creating grocery lists, and more. Before you get started, please confirm your email address to access all the tasty features we have in store.</p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="${process.env.BASE_URL}verify-email/${verificationToken}" 
        style="display: inline-block; padding: 15px 30px; background-color: #5d6544; color: white; font-size: 16px; text-decoration: none; border-radius: 50px; box-shadow: 0 4px 10px rgba(93, 101, 68, 0.3); transition: background-color 0.3s ease;"
       onmouseover="this.style.backgroundColor='#4a5238'; this.style.transform='scale(1.05)';" 
       onmouseout="this.style.backgroundColor='#5d6544'; this.style.transform='scale(1)';">
      Verify Your Email
    </a>
  </div>
  <p style="color: #333; font-size: 16px; line-height: 1.6;">If the button above doesn’t work, paste this link into your browser:</p>
  <p style="word-break: break-all; color: #5d6544; font-size: 14px;">
    <a href="${process.env.BASE_URL}/verify?token=${verificationToken}" 
       style="color: #5d6544; text-decoration: underline;">
      ${process.env.BASE_URL}/verify?token=${verificationToken}
    </a>
  </p>
  <p style="color: #333; font-size: 16px; line-height: 1.6;">Bon appétit, and happy cooking!</p>
  <p style="color: #333; font-size: 16px; line-height: 1.6; text-align: center;">The Foodigo Team</p>
</div>

  `;

  const message = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Welcome To Foodigo! 👩‍🍳",
    html: htmlContent,
  };

  await transporter.sendMail(message);
};

export const signup = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // Trim whitespace and convert to lowercase
    email = email.trim().toLowerCase();

    // Comprehensive email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Validate all fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Email format validation
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Password length validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      isVerified: false,
    });

    // Send the verification email
    await sendVerificationEmail(newUser);

    const token = signToken(newUser._id);
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      success: true,
      user: newUser,
      message: "Welcome to Foodigo! 🍲",
    });
  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  let { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Required",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No user Found with this email",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User Not Active!",
      });
    }

    if (!(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Wrong Password 🙁",
      });
    }

    const token = signToken(user._id);
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      user,
      message: "Logged in",
    });
  } catch (error) {
    console.error("Error in login Controller:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const { email } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error in email verification:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logged out Succesfully" });
};

export const CheckerificationEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No verification token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Email already verified",
      });
    }

    await User.findByIdAndUpdate(user._id, { isVerified: true });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error in email verification:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const generateResetToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

const sendResetEmail = async (user, token) => {
  const resetLink = `${process.env.BASE_URL}reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const htmlContent = `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #fafafa; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
  <div style="text-align: center; margin-bottom: 20px;">
    <div style="display: inline-block; position: relative; width: 120px; height: 120px; overflow: hidden; border-radius: 50%; border: 4px solid #5d6544; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
      <img src="https://firebasestorage.googleapis.com/v0/b/hdarne-3d2b6.appspot.com/o/profilePics%2FfoodigoLogo.jpeg?alt=media&token=101a2049-1009-45e3-a364-534ee23c5153" 
           alt="Foodigo Logo" 
           style="width: 100%; height: 100%; object-fit: cover; display: block;">
    </div>
  </div>
  
  <h2 style="color: #5a6f3a; font-size: 24px; margin-bottom: 10px;">Password Reset Request</h2>
  <p style="font-size: 16px; color: #333333;">We received a request to reset your password. To proceed, please click the button below:</p>

  <div style="text-align: center; margin-top: 30px;">
    <a href="${resetLink}" style="display: inline-block; padding: 15px 30px; background-color: #5d6544; color: white; font-size: 16px; text-decoration: none; border-radius: 50px; box-shadow: 0 4px 10px rgba(93, 101, 68, 0.3); transition: background-color 0.3s ease;">
      Reset Password
    </a>
  </div>

  <p style="font-size: 14px; color: #888888; text-align: center; margin-top: 20px;">
    If you did not request a password reset, please ignore this email.
  </p>

  <div style="margin-top: 40px; text-align: center;">
    <p style="font-size: 14px; color: #777777;">Bon appétit, and happy cooking! 🍳</p>
    <p style="font-size: 14px; color: #777777;">The Foodigo Team</p>
  </div>
</div>

`;

  const message = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password Reset Request",
    html: htmlContent,
  };

  await transporter.sendMail(message);
};

export const forgotPassword = async (req, res) => {
  let { email } = req.body;
  email = email.toLowerCase();
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetToken = generateResetToken();

  const resetTokenEntry = new PasswordResetToken({
    userId: user._id,
    token: resetToken,
    expiresAt: Date.now() + 3600000, // 1 hour in milliseconds
  });

  await resetTokenEntry.save();

  await sendResetEmail(user, resetToken);

  res.status(200).json({ message: "Password reset email sent" });
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }
    const resetTokenEntry = await PasswordResetToken.findOne({ token });

    if (!resetTokenEntry) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    if (Date.now() > resetTokenEntry.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "Token has expired",
      });
    }
    const user = await User.findById(resetTokenEntry.userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    user.password = newPassword;
    await user.save();
    await PasswordResetToken.findByIdAndDelete(resetTokenEntry._id);
    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const UpdateFCM = async (req, res) => {
  const { token } = req.body;
  const { userId } = req.body; // Get user ID from session or JWT token

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.updateFcmToken(token);
    res.status(200).json({ success: true, data: user.fcmToken });
  } catch (error) {
    res.status(500).json({ message: "Error updating FCM token", error });
  }
};

export const AdminLogin = async (req, res) => {
  let { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Required",
      });
    }

    // Search for the user by email and ensure both password and isAdmin fields are available
    const user = await User.findOne({ email, isAdmin: true }).select(
      "+password"
    );
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No admin user found with this email",
      });
    }

    // Validate password
    if (!(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Wrong Password 🙁",
      });
    }

    // CheckIf user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User is not active 🙁",
      });
    }
    // Generate JWT token
    const token = signToken(user._id);
    res.cookie("jwt", token, {
      maxAge: 60 * 60 * 1000, // 7 days in milliseconds
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      user,
      message: "Logged in as admin",
    });
  } catch (error) {
    console.error("Error in AdminLogin Controller:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
