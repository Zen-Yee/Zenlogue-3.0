import * as authService from "./auth.service.js";
import jwt from 'jsonwebtoken';

export const signupSubmit = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      const err = new Error("All fields are required");
      err.status = 400;
      return next(err);
    }

    if (password !== confirmPassword) {
      const err = new Error("Passwords do not match");
      err.status = 400;
      return next(err);
    }

    const user = await authService.createUser(username, email, password);

    // Store user in session
    req.session.user = {
      user_id: user.user_id,
      userName: user.user_name,
      role: user.role
    };

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true if using HTTPS
      maxAge: 60 * 60 * 1000
    });

    res.redirect("/");

  } catch (err) {
    next(err);
  }
};

export const loginSubmit = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await authService.loginUser(username, password);

    // Store user in session
    req.session.user = {
      user_id: user.user_id,
      userName: user.user_name,
      role: user.role
    };

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

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
