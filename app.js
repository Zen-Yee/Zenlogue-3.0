import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from './src/modules/auth/auth.routes.js';
// import postRouter from './src/modules/post/post.routes.js';
// import commentRouter from './src/modules/comment/comment.routes.js';
import errorMiddleware from './src/middleware/error.middleware.js';

dotenv.config(); // loads environment variables from .env file
const app = express(); 

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, // only if using cookies/auth
}));

// Set up Express middleware.
app.use(express.json()); //Parse incoming request with JSON body
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded form data (from HTML forms).

// Mounting routes
app.use('/auth', authRouter); // Log in, Log out, Register
// app.use('/post', postRouter); // fetch posts
// app.use('/comment', commentRouter); // fetch comments

app.use(errorMiddleware);

export default app;
