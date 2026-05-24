import db from "../../config/pool.js";
import bcrypt from "bcrypt";

export const createUser = async (username, email, password) => {
  // Check existing user
  const existingUser = await findByEmail(email);
  if (existingUser) {
    const err = new Error("Email already exists");
    err.status = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, 10);
  const query = `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, username, email, role`;
  const result = await db.query(query, [username, email, hashed]);
  return result.rows[0];
};

export const loginUser = async (username, password) => {
  const query = `SELECT user_id, username, role, password_hash FROM users WHERE username = $1`;
  const result = await db.query(query, [username]);

  const invalidErr = () => {
    const err = new Error("Invalid credentials");
    err.status = 401;
    return err;
  };

  if (result.rows.length === 0) throw invalidErr();

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) throw invalidErr();

  return user;
};

export const findByEmail = async (email) => {
  const query = `SELECT user_id, email FROM users WHERE email =  $1`;

  const result = await db.query(query, [email]);

  return result.rows[0];
};
