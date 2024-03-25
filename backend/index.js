import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Pool from "pg-pool";

dotenv.config();

const app = express();
const port = 4000;
const saltRounds = 10;
const tokenExpirationTime = "24h";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});

/**
 * Function to make database queries
 * @param {*} sql query string
 * @param {*} params query parameters
 * @returns query result
 */
async function query(sql, params) {
  const client = await db.connect();
  try {
    // remove the logs later
    if (params) {
      console.log("SQL:", sql, params);
      return await client.query(sql, params);
    } else {
      console.log("SQL:", sql);
      return await client.query(sql);
    }
  } finally {
    client.release();
  }
}

// Register a new user
const usernameExists = async (username) => {
  const result = await query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rowCount > 0;
};

const emailExists = async (email) => {
  const result = await query("SELECT * FROM users WHERE email = $1", [email]);
  if (result.rowCount === 0) return false;
  return result.rows[0];
};

const createUser = async (username, email, password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  const currentTime = new Date().toISOString();
  const defaultRole = "user";

  console.log(
    "createUser",
    username,
    email,
    hashedPassword,
    currentTime,
    defaultRole
  );

  const result = await query(
    "INSERT INTO users (username, email, password, created_at, updated_at, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [username, email, hashedPassword, currentTime, currentTime, defaultRole]
  );
  if (result.rowCount === 0) return false;
  return result.rows[0];
};

const generateJwtToken = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: tokenExpirationTime,
    }
  );
  return token;
};

const matchPassword = async (password, hashedPassword) => {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
};

// Registration route
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (await usernameExists(username)) {
    return res.status(400).json({ message: "Username already exists." });
  }
  if (await emailExists(email)) {
    return res.status(400).json({ message: "Email already exists." });
  }
  const user = await createUser(username, email, password);
  if (!user) {
    return res.status(500).json({ message: "Failed to create user." });
  }
  res.status(201).json({ message: "User created." });
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await emailExists(email);
  const messageText = "Invalid email or password.";

  if (!user) {
    return res.status(400).json({ message: messageText });
  }

  const isMatch = await matchPassword(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: messageText });
  }

  const token = generateJwtToken(user);
  console.log("Token:", token);
  res.json({
    message: "Logged in successfully",
    user: { username: user.username, email: user.email, token },
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
