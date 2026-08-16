
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// =====================
// SIGNUP
// =====================

export const signup = async (req, res) => {
  try {
    const { username, email, password } =
      req.body;

    const userExists =
      await User.findOne({
        $or: [
          { email },
          { username },
        ],
      });

    if (userExists) {
      return res.status(400).json({
        message:
          "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await User.create({
        username,
        email,
        password:
          hashedPassword,
      });

    res.status(201).json({
      message:
        "Signup successful",
      user: {
        id: user._id,
        username:
          user.username,
        email: user.email,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Server Error",
    });

  }
};

// =====================
// LOGIN
// =====================

export const login = async (
  req,
  res
) => {
  try {

    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res
        .status(400)
        .json({
          message:
            "Invalid Credentials",
        });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res
        .status(400)
        .json({
          message:
            "Invalid Credentials",
        });
    }

    const token =
      jwt.sign(
        {
          id: user._id,
          username:
            user.username,
          email:
            user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn:
            "7d",
        }
      );

    res.cookie(
      "token",
      token,
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge:
          7 *
          24 *
          60 *
          60 *
          1000,
      }
    );

    res.status(200).json({
      message:
        "Login Successful",
      user: {
        id: user._id,
        username:
          user.username,
        email:
          user.email,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Server Error",
    });

  }
};

// =====================
// VERIFY USER
// =====================

export const verifyUser =
  async (req, res) => {

    res.status(200).json({
      authenticated: true,
      user: req.user,
    });

  };

 
// =====================
// CURRENT USER (GOOGLE)
// =====================

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    res.status(200).json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
      },
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// =====================
// GOOGLE CALLBACK
// =====================

export const googleCallback = async (req, res) => {
  try {
    const token = jwt.sign(
      {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect("http://localhost:5173/home");

  } catch (error) {
    console.log(error);

    res.redirect("http://localhost:5173/login");
  }
};

// =====================
// FORGOT PASSWORD
// =====================

export const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const resetLink =
      `http://localhost:5173/reset-password/${token}`;

    await sendEmail(
      user.email,
      "Reset your CodeSync password",
      `
      <h2>Password Reset</h2>

      <p>Click the button below to reset your password.</p>

      <a
        href="${resetLink}"
        style="
          background:#2563eb;
          color:white;
          padding:12px 24px;
          text-decoration:none;
          border-radius:8px;
        "
      >
        Reset Password
      </a>

      <p>This link expires in 15 minutes.</p>
      `
    );

    res.json({
      message: "Password reset email sent.",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// =====================
// RESET PASSWORD
// =====================

export const resetPassword = async (req, res) => {
  try {

    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isSamePassword = await bcrypt.compare(
  password,
  user.password
);

if (isSamePassword) {
  return res.status(400).json({
    message:
      "New password cannot be the same as your current password.",
  });
}

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
    });

  } catch (error) {

    console.log(error);

    return res.status(400).json({
      message: "Invalid or expired reset link",
    });

  }
};

// =====================
// LOGOUT
// =====================

export const logout =
  async (req, res) => {

    res.clearCookie(
      "token"
    );

    res.status(200).json({
      message:
        "Logged out",
    });

  };

