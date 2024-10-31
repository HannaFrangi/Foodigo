import jwt from "jsonwebtoken";
import User from "../models/Users.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.coookies.jwt;
    if (!token) {
      return res.status(401).json({
        succes: false,
        message: "Not authorized . No token provided",
      });
    }
    //check the token if valid
    const decoded = jwt.verify(token.process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Not authorized . Invalid token",
      });
    }
    //iza wesel la hon ye3ne the user is auth..
    const currentUser = await User.findById(decoded.id);

    req.user = currentUser;
    next();
  } catch (error) {
    console.log("Error in auth middleware:", error);
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }
};
