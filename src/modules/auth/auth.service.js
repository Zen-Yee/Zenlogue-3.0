import db from "../../config/pool.js";
import bcrypt from "bcrypt";

export const createUser = async (userName, eMail, passWord) => {
  const hashed = await bcrypt.hash(passWord, 10);

  const result = await db.query(
    "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, user_name, email",
    [userName, eMail, hashed]
  );

  return result.rows[0];
};

export const loginUser = async (userName, passWord) => {
  const result = await db.query(
    "SELECT * FROM users WHERE user_name = $1",
    [userName]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(passWord, user.password_hash);

  if (!match) {
    throw new Error("Invalid password");
  }

  return user;
};
