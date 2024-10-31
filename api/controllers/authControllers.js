import User from "../models/Users.js";
import jwt from "jsonwebtoken";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
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
      user: newUser,
    });
  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      // && !(await user.matchPassword(password)) Tested And its working
      return res.status(401).json({
        success: false,
        message: "No user Found with this email",
      });
    }

    // password only ==>>
    if (!(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Wrong Password 🙁",
      });
    }

    const token = signToken(user._id);
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days in milliseconds
      httpOnly: true, // prevents xss attacks
      sameSite: "strict", //prevents CSRF attacks
      secure: process.env.NODE_ENV === "production", //so in the development it isn't secure but in the production it is
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
export const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logged out Succesfully" });
};
