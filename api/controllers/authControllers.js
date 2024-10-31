import User from "../models/Users.js";
import jwt from "jsonwebtoken";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, age, gender, genderPreference } = req.body;
    if (!name || !email || !password || !age || !gender || !genderPreference) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (age < 18) {
      return res.status(400).json({
        success: false,
        message: "You must be at leat 18 Years old",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at leat 6 characters",
      });
    }
    const newUser = await User.create({
      name,
      email,
      password,
      age,
      gender,
      genderPreference,
    });
    const token = signToken(newUser._id);

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days in milliseconds
      httpOnly: true, // prevents xss attacks
      sameSite: "strict", //prevents CSRF attacks
      secure: process.env.NODE_ENV === "production", //so in the development it isn't secure but in the production it is
    });
    res.status(201).json({
      success: true,
      tuser: newUser,
    });
  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ success: false, nessage: "Server error" });
  }
};
export const login = async (req, res) => {};
export const logout = async (req, res) => {};
