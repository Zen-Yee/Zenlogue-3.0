import * as authService from "./auth.service.js";
import jwt from 'jsonwebtoken';

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

    // insert into database
    const user = await authService.createUser(username, email, password);

    // Automatically log in after success register, store user in session 
    req.session.user = {
      user_id: user.user_id,
      userName: user.user_name,
      role: user.role
    };

    // Sign JWT Token
    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true if using HTTPS
      maxAge: 60 * 60 * 1000
    });

    // Redirect to homepage 
    res.redirect("/");

  } catch (err) {
    next(err);
  }
};

export const loginSubmit = async (req, res) => {
  try {
    const { username, password } = req.body;

    // search username in database
    const user = await authService.loginUser(username, password);

    // Store user in session
    req.session.user = {
      user_id: user.user_id,
      userName: user.user_name,
      role: user.role
    };

    // Sign JWT token
    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true if using HTTPS
      maxAge: 60 * 60 * 1000
    });

    res.redirect("/"); // now nav buttons see currentUser

  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
