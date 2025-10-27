import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    return res.status(200).json({
      success: true,
      message: `Welcome ${user.name}`,
      user: userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to register",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email }).select("name email password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.name}`,
      user: userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

export const logoutUser = async (_, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 0,
      })
      .json({ success: true, message: "Logged out Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to Logout" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.id).select("_id name email");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
