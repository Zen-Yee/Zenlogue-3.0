import express from "express";
import session from "express-session";
import dotenv from "dotenv";

import authRouter from './src/modules/auth/auth.routes.js';

dotenv.config(); // loads environment variables from .env file
const app = express(); 

// Set up session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // true if using HTTPS
  })
);

// Set up Express middleware.
app.use(express.json()); //Parse incoming request with JSON body
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded form data (from HTML forms).

// Mounting routes
app.use('/auth', authRouter); // Log in, Log out, Register

export default app;
