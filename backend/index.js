import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Pool from "pg-pool";
import auth from "./auth/auth.js";

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
  res.json({
    message: "Logged in successfully",
    user: { username: user.username, email: user.email, token },
  });
});

// Get all items
app.get("/items", async (req, res) => {
  const result = await query("SELECT * FROM items");
  result.rows.sort((a, b) => a.title.localeCompare(b.title));
  res.json(result.rows);
});

// Get a single item
app.get("/items/:id", async (req, res) => {
  const { id } = req.params;
  const result = await query("SELECT * FROM items WHERE id = $1", [id]);
  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Item not found." });
  }
  res.json(result.rows[0]);
});

// get all users
app.get("/users", async (req, res) => {
  const result = await query("SELECT * FROM users");
  res.json(result.rows);
});

// remove a user
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const result = await query("DELETE FROM users WHERE id = $1", [id]);
  if (result.rowCount === 0) {
    return res.status(404).json({ message: "User not found." });
  }
  res.json({ message: "User deleted." });
});

// update a user
app.put("/users/:id", async (req, res) => {
  const { id, username, email, role } = req.body;
  console.log(id);
  console.log(req.body);
  const result = await query(
    "UPDATE users SET username = $1, email = $2, role = $3 WHERE id = $4",
    [username, email, role, id]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ message: "User not found." });
  }
  res.json({ message: "User updated." });
});

// add an item
app.post("/items", auth, async (req, res) => {
  const user = req.user;
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  console.log(req.body);
  const { title, price, image, description } = req.body;
  let category = req.body.category;
  const currentTime = new Date().toISOString();

  // Capitalize the first letter of the category
  category = category.charAt(0).toUpperCase() + category.slice(1);

  const result = await query(
    "INSERT INTO items (title, price, image, description, category, rating, user_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    [
      title,
      price,
      image,
      description,
      category,
      0,
      user.id,
      currentTime,
      currentTime,
    ]
  );
  if (result.rowCount === 0) {
    return res.status(500).json({ message: "Failed to create item." });
  }
  res.status(201).json({ message: "Item created." });
});

// delete an item
app.delete("/items/:id", auth, async (req, res) => {
  console.log("DELETE ITEM");
  const user = req.user;
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  const id = req.params.id;

  const result = await query("DELETE FROM items WHERE id = $1", [id]);

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Item not found." });
  }
  res.json({ message: "Item deleted." });
});

//update an item
app.put("/items/:id", auth, async (req, res) => {
  console.log(req.body);
  const user = req.user;
  console.log(user);

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const { id } = req.params;

  const { title, price, image, description } = req.body;
  const currentTime = new Date().toISOString();
  let category =
    req.body.category.charAt(0).toUpperCase() + req.body.category.slice(1);

  const result = await query(
    "UPDATE items SET title = $1, price = $2, image = $3, description = $4, category = $5, updated_at = $6 WHERE id = $7",
    [title, price, image, description, category, currentTime, id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Item not found." });
  }
  res.status(200).json({ message: "Item updated." });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
