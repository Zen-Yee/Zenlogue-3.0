import * as authService from "./auth.service.js";
import jwt from "jsonwebtoken";

const TOKEN_EXPIRY_MS = 60 * 60 * 1000;

export const signupSubmit = async (req, res, next) => {
  try {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase(); // lowercase email too

    const { password, confirmPassword } = req.body;

    // Check if all required information exist, if not, return error
    if (!username || !email || !password || !confirmPassword) {
      const err = new Error("All fields are required");
      err.status = 400;
      return next(err);
    }

    // Check if password entry match with confirm password entry, if not, return error
    if (password !== confirmPassword) {
      const err = new Error("Passwords do not match");
      err.status = 400;
      return next(err);
    }

    // insert into database
    const user = await authService.createUser(username, email, password);

    // Sign JWT Token
    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY_MS / 1000 },
    );

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: TOKEN_EXPIRY_MS,
      sameSite: "lax",
    });

    res.status(201).json({
      success: true,
      message: "Register Success",
      user: {
        id: user.user_id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const loginSubmit = async (req, res, next) => {
  try {
    const username = req.body.username?.trim();
    const { password } = req.body;

    if (!username || !password) {
      const err = new Error("All fields are required");
      err.status = 400;
      return next(err);
    }

    // search username in database
    const user = await authService.loginUser(username, password);

    // Sign JWT token
    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY_MS / 1000 },
    );

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: TOKEN_EXPIRY_MS,
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Login Success",
      user: {
        id: user.user_id,
        username: user.user_name,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res, next) => {
  try {

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error); 
  }
};
