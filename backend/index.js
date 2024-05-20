import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Pool from "pg-pool";
import auth from "./auth/auth.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const port = 4000; // backend port
const saltRounds = 10; // bcrypt salt rounds
const tokenExpirationTime = "24h"; // token expiration time
const frontendUrl = "http://localhost:5173"; // frontend url

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    if (!file) {
      return callBack("No file uploaded", null);
    }
    callBack(null, "uploads");
  },
  filename: (req, file, callBack) => {
    if (!file) {
      return callBack("No file uploaded", null);
    }
    const extension = file.originalname.split(".").pop();
    const fileName = file.originalname.replace(`.${extension}`, "");
    const currentTime = new Date().toISOString();

    const fullName = `${fileName}-${currentTime}.${extension}`;
    callBack(null, fullName);
  },
});
let upload = multer({ storage: storage });

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // comment the ssl line for local development because it will cause an error if the database is not set up for ssl connections
  ssl: {
    rejectUnauthorized: false,
  },
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

// Reset password route
app.post("/reset-password", async (req, res) => {
  // check if email is provided
  if (req.body.email === undefined) {
    return res.status(400).json({ message: "Email is required." });
  }

  // check if user exists with this email
  const user = await emailExists(req.body.email);
  if (user) {
    // Generate a reset token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    // store the token in the database
    await query("UPDATE users SET reset_token = $1 WHERE email = $2", [
      token,
      user.email,
    ]);

    // send email with reset password link
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Reset Your Sale-seeker Account Password",
      text: `Hello,
    
    We received a request to reset your Sale-seeker account password. To reset your password, please click on the link below:
    
    Reset Password: ${frontendUrl}/reset-password/${token}
    
    If you did not initiate this request or believe it's a mistake, you can safely ignore this email. Your account security is important to us.
    
    Thank you,
    The Sale-seeker Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email", error);
        return res.status(500).json({ message: "Failed to send email." });
      }
      console.log("Email sent: " + info.response);
      res.status(200).json({
        message: "Check your email for instructions to reset your password",
      });
    });
  } else {
    res.status(200).json({
      message: "Check your email for instructions to reset your password",
    });
  }
});

// Reset to update password route
app.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await query(
      "UPDATE users SET password = $1, reset_token = $2 WHERE email = $3",
      [hashedPassword, null, decoded.email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "Password updated." });
  });
});

// Get all items
app.get("/items", async (req, res) => {
  const result = await query("SELECT * FROM items");
  result.rows.sort((a, b) => a.id - b.id);
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

// get items for a user
app.get("/items/user/:id", async (req, res) => {
  const { id } = req.params;
  const result = await query("SELECT * FROM items WHERE user_id = $1", [id]);
  if (result.rowCount === 0) {
    return res.json([]);
  }
  res.json(result.rows);
});

app.get("/itemsPaged", async (req, res) => {
  const { page, itemsPerPage, search } = req.query;

  if (itemsPerPage < 1 || isNaN(itemsPerPage)) {
    return res.status(400).json({ message: "Invalid items per page number." });
  }
  if (page <= 0 || isNaN(page)) {
    return res.status(400).json({ message: "Invalid page number." });
  }
  const offset = (page - 1) * itemsPerPage;

  // "SELECT item_id, AVG(rating) FROM reviews GROUP BY item_id"

  // Query for items matching the search term with average rating
  const result = await query(
    `SELECT items.*, COALESCE(avg_rating.avg_rating, 0) AS average_rating
    FROM items
    LEFT JOIN (
        SELECT item_id, AVG(rating) AS avg_rating 
        FROM reviews 
        GROUP BY item_id
    ) AS avg_rating 
    ON items.id = avg_rating.item_id
    WHERE title ILIKE $1 OR description ILIKE $1 
    ORDER BY items.created_at DESC 
    OFFSET $2 
    LIMIT $3`,
    [`%${search}%`, offset, itemsPerPage]
  );

  // Query for the total count of items matching the search term
  const totalCountResult = await query(
    `SELECT COUNT(*) FROM items WHERE title ILIKE $1 OR description ILIKE $1`,
    [`%${search}%`]
  );

  const totalCount = parseInt(totalCountResult.rows[0].count);

  if (result.rowCount === 0) {
    return res.json({ items: [], totalCount: 0 });
  }

  res.json({ items: result.rows, totalCount });
});

// get all users
app.get("/users", auth, async (req, res) => {
  const user = req.user;
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  const result = await query("SELECT * FROM users");
  res.json(result.rows);
});

app.get("/usersPaged", auth, async (req, res) => {
  const user = req.user;
  const { page, itemsPerPage } = req.query;

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (itemsPerPage < 1 || isNaN(itemsPerPage)) {
    return res.status(400).json({ message: "Invalid items per page number." });
  }
  if (page <= 0 || isNaN(page)) {
    return res.status(400).json({ message: "Invalid page number." });
  }
  const offset = (page - 1) * itemsPerPage;

  const result = await query(
    "SELECT * FROM users ORDER BY created_at DESC OFFSET $1 LIMIT $2",
    [offset, itemsPerPage]
  );

  const totalCountResult = await query("SELECT COUNT(*) FROM users");

  const totalCount = parseInt(totalCountResult.rows[0].count);

  if (result.rowCount === 0) {
    return res.json({ users: [], totalCount: 0 });
  }
  res.json({ users: result.rows, totalCount });
});

// get a single user by id
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const result = await query(
    "SELECT id, username, email, role, created_at, updated_at FROM users WHERE id = $1",
    [id]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ message: "User not found." });
  }
  res.json(result.rows[0]);
});

// remove a user
app.delete("/users/:id", auth, async (req, res) => {
  const user = req.user;
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  const { id } = req.params;
  await query("DELETE FROM reviews WHERE user_id = $1", [id]);
  await query("DELETE FROM items WHERE user_id = $1", [id]);
  await query("DELETE FROM orders WHERE user_id = $1", [id]);
  const result = await query("DELETE FROM users WHERE id = $1", [id]);
  if (result.rowCount === 0) {
    return res.status(404).json({ message: "User not found." });
  }
  res.json({ message: "User deleted." });
});

// update a user
app.put("/users/:id", auth, async (req, res) => {
  const user = req.user;
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  const { id, username, email, role } = req.body;
  const result = await query(
    "UPDATE users SET username = $1, email = $2, role = $3 WHERE id = $4",
    [username, email, role, id]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ message: "User not found." });
  }
  res.json({ message: "User updated." });
});

app.post("/upload", upload.single("file"), auth, async (req, res) => {
  if (!req.file) {
    // return without the error message to prevent the frontend from crashing
    return res.status(200).json({ message: "Failed to upload file." });
  }
  const filePath = req.file.path;
  let isEdited = false;

  if (req.body.id) {
    isEdited = true;
    const id = req.body.id;
    const prevImage = await query("SELECT * FROM images WHERE item_id = $1", [
      id,
    ]);
    let image = await query("SELECT image FROM items WHERE id = $1", [id]);
    image = image.rows[0].image;

    // remove the image from cloudinary
    if (image) {
      const publicId = prevImage.rows[0].public_id;
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.log("Error deleting image from cloudinary", error);
        }
      });
    }
  }

  const result = await cloudinary.uploader.upload(filePath, {
    folder: "sale-seeker",
    use_filename: true,
  });

  if (isEdited) {
    const id = req.body.id;
    await query(
      "UPDATE images SET url = $1, public_id = $2 WHERE item_id = $3",
      [result.secure_url, result.public_id, id]
    );
  }

  if (!result) {
    return res.status(500).json({ message: "Failed to upload file." });
  }

  // remove the image in the uploads folder
  fs.unlinkSync(filePath);

  res.json({ url: result });
});

// add an item
app.post("/items", auth, async (req, res) => {
  const user = req.user;
  if (["admin", "seller"].includes(user.role) === false) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  const { title, price, image, description } = req.body;
  let category = req.body.category;
  const currentTime = new Date().toISOString();

  // Capitalize the first letter of the category
  category = category.charAt(0).toUpperCase() + category.slice(1);

  if (image?.secure_url === undefined) {
    return res.status(400).json({ message: "Image is required." });
  }

  const result = await query(
    "INSERT INTO items (title, price, image, description, category, rating, user_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
    [
      title,
      price,
      image.secure_url,
      description,
      category,
      0.0,
      user.id,
      currentTime,
      currentTime,
    ]
  );

  if (result.rowCount === 0) {
    return res.status(500).json({ message: "Failed to create item." });
  }
  const createdItemsId = result.rows[0].id;

  await query(
    "INSERT INTO images (url, public_id, item_id) VALUES ($1, $2, $3)",
    [image.secure_url, image.public_id, createdItemsId]
  );
  res.status(201).json({ message: "Item created." });
});

// delete an item
app.delete("/items/:id", auth, async (req, res) => {
  const user = req.user;
  if (["admin", "seller"].includes(user.role) === false) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const item = await query("SELECT user_id FROM items WHERE id = $1", [
    req.params.id,
  ]);

  if (user.role !== "admin" && item.rows[0].user_id !== user.id) {
    res.status(403).json({ message: "Unauthorized" });
  }

  const id = req.params.id;

  const currentImage = await query("SELECT * FROM images WHERE item_id = $1", [
    id,
  ]);

  const public_id = currentImage.rows[0]?.public_id;

  cloudinary.uploader.destroy(public_id, (error, result) => {
    // check if file exists before deleting it

    if (fs.existsSync(`uploads/${public_id}`)) {
      fs.unlinkSync(`uploads/${public_id}`);
    }
    if (error) {
      console.log("Error deleting image from cloudinary", error);
    }
  });

  await query("DELETE FROM images WHERE item_id = $1", [id]);

  const result = await query("DELETE FROM items WHERE id = $1", [id]);

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Item not found." });
  }
  res.json({ message: "Item deleted." });
});

//update an item
app.put("/items/:id", auth, async (req, res) => {
  const user = req.user;

  if (["admin", "seller"].includes(user.role) === false) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const item = await query("SELECT user_id FROM items WHERE id = $1", [
    req.params.id,
  ]);

  if (user.role !== "admin" && item.rows[0].user_id !== user.id) {
    res.status(403).json({ message: "Unauthorized" });
  }

  const { id } = req.params;

  const { title, price, description } = req.body;
  let image = req.body.image;
  if (!image) {
    const prevImage = await query("SELECT image FROM items WHERE id = $1", [
      id,
    ]);
    image = prevImage.rows[0].image;
  }
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

// get reviews
app.get("/reviews/:id", async (req, res) => {
  const { id } = req.params;

  const result = await query(
    "SELECT * FROM reviews WHERE item_id = $1 ORDER BY created_at DESC",
    [id]
  );

  if (result.rowCount === 0) {
    return res.json([]);
  }

  const user = await query("SELECT * FROM users WHERE id = $1", [
    result.rows[0].user_id,
  ]);

  const reviews = result.rows.map((review) => {
    return {
      id: review.id,
      title: review.title,
      user: user.rows[0].username,
      description: review.description,
      rating: review.rating,
    };
  });

  res.json(reviews);
});

app.get("/reviewsPaged/:id", async (req, res) => {
  const { id } = req.params;
  const { page, itemsPerPage } = req.query;

  if (itemsPerPage < 1 || isNaN(itemsPerPage)) {
    return res.status(400).json({ message: "Invalid items per page number." });
  }
  if (page <= 0 || isNaN(page)) {
    return res.status(400).json({ message: "Invalid page number." });
  }
  const offset = (page - 1) * itemsPerPage;

  const result = await query(
    `SELECT reviews.*, users.username 
    FROM reviews 
    INNER JOIN users ON reviews.user_id = users.id 
    WHERE item_id = $1 
    ORDER BY created_at DESC 
    OFFSET $2 
    LIMIT $3`,
    [id, offset, itemsPerPage]
  );

  const totalCountResult = await query(
    "SELECT COUNT(*) FROM reviews WHERE item_id = $1",
    [id]
  );

  const totalCount = parseInt(totalCountResult.rows[0].count);

  if (result.rowCount === 0) {
    return res.json({ reviews: [], totalCount: 0 });
  }

  res.json({ reviews: result.rows, totalCount });
});

// add review
app.post("/reviews", auth, async (req, res) => {
  const { id, comment, rating, userId } = req.body;
  const currentTime = new Date().toISOString();

  const result = await query(
    "INSERT INTO reviews (title, item_id, user_id, description, rating, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    ["Comment", id, userId, comment, rating, currentTime, currentTime]
  );

  if (result.rowCount === 0) {
    return res.status(500).json({ message: "Failed to create review." });
  }
  res.status(201).json({ message: "Review created." });
});

// get average rating for an item
app.get("/reviews/average/:id", async (req, res) => {
  const { id } = req.params;
  const result = await query(
    "SELECT AVG(rating) FROM reviews WHERE item_id = $1",
    [id]
  );
  res.json(result.rows[0]);
});

// get all reviews average for each item
app.get("/allReviews/average", async (req, res) => {
  const result = await query(
    "SELECT item_id, AVG(rating) FROM reviews GROUP BY item_id"
  );

  if (result.rowCount === 0) {
    return res.json([]);
  }
  res.json(result.rows);
});

// payment information
app.post("/payment", auth, async (req, res) => {
  // will need to check if user didn't change the prices in the frontend later here
  const { cartItems, totalPrice } = req.body;

  const userId = req.user.id;
  const currentTime = new Date().toISOString();

  const result = await query(
    "INSERT INTO orders (user_id, total, items, created_at) VALUES ($1, $2, $3, $4)",
    [userId, totalPrice, JSON.stringify(cartItems), currentTime]
  );

  if (result.rowCount === 0) {
    return res.status(500).json({ message: "Failed to create order." });
  }

  res.json({ message: "Payment received." });
});

// get all orders
app.get("/orders", auth, async (req, res) => {
  const user = req.user;

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const result = await query(
    "SELECT orders.*, users.username FROM orders INNER JOIN users ON orders.user_id = users.id"
  );

  if (result.rowCount === 0) {
    return res.json([]);
  }

  res.json(result.rows);
});

app.get("/ordersPaged", auth, async (req, res) => {
  const user = req.user;
  const { page, itemsPerPage } = req.query;

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (itemsPerPage < 1 || isNaN(itemsPerPage)) {
    return res.status(400).json({ message: "Invalid items per page number." });
  }
  if (page <= 0 || isNaN(page)) {
    return res.status(400).json({ message: "Invalid page number." });
  }
  const offset = (page - 1) * itemsPerPage;

  const result = await query(
    "SELECT orders.*, users.username FROM orders INNER JOIN users ON orders.user_id = users.id ORDER BY orders.created_at DESC OFFSET $1 LIMIT $2",
    [offset, itemsPerPage]
  );

  const totalCountResult = await query("SELECT COUNT(*) FROM orders");

  const totalCount = parseInt(totalCountResult.rows[0].count);

  if (result.rowCount === 0) {
    return res.json({ orders: [], totalCount: 0 });
  }
  res.json({ orders: result.rows, totalCount });
});

// delete an order
app.delete("/orders/:id", auth, async (req, res) => {
  const user = req.user;
  const orderId = req.params.id;

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const result = await query("DELETE FROM orders WHERE id = $1", [orderId]);

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Order not found." });
  }
  res.json({ message: "Order deleted." });
});

// change order status
app.put("/orderStatusChange/:id", auth, async (req, res) => {
  const user = req.user;
  const orderId = req.params.id;
  const { status } = req.body;

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const result = await query("UPDATE orders SET status = $1 WHERE id = $2", [
    status,
    orderId,
  ]);

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Order not found." });
  }

  res.json({ message: "Order status changed." });
});

// get orders for a user
app.get("/orders/user/:id", auth, async (req, res) => {
  const user = req.user;
  const userId = req.params.id;

  if (user.id !== parseInt(userId)) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const result = await query("SELECT * FROM orders WHERE user_id = $1", [
    userId,
  ]);

  if (result.rowCount === 0) {
    return res.json([]);
  }
  res.json(result.rows);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
