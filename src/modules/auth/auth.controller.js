import * as authService from "./auth.service.js";
import jwt from "jsonwebtoken";

export const signupSubmit = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

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

    const existingUser = await authService.findByEmail(email);

    if (existingUser) {
      const err = new Error("Email already exists");
      err.status = 409;
      return next(err);
    }

    // insert into database
    const user = await authService.createUser(username, email, password);

    // Sign JWT Token
    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    console.log();

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,  
      sameSite: "lax",
    });

    res.json({
      success: true,
      message: "Register Success",
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

export const loginSubmit = async (req, res) => {
  try {
    const { username, password } = req.body;

    // search username in database
    const user = await authService.loginUser(username, password);

    // Sign JWT token
    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
    });

    res.json({
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
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

 res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};
