import db from "../../config/pool.js";
import bcrypt from "bcrypt";

export const createUser = async (username, email, password) => {
  const hashed = await bcrypt.hash(password, 10);
  const query = `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, username, email`;
  const result = await db.query(
    query,
    [username, email, hashed]
  );
  return result.rows[0];
};

export const loginUser = async (username, password) => {

  const query = `SELECT * FROM users WHERE user_name = $1`;
  const result = await db.query(
    query,
    [username]
  );
  
  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    throw new Error("Invalid password");
  }

  return user;
};

export const findByEmail = async (email) => {

  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  return rows[0];
};
