import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";
import Database from "better-sqlite3";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const db = new Database("edutoolspro.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user',
    userId TEXT UNIQUE,
    name TEXT,
    class TEXT,
    roll TEXT,
    school TEXT,
    address TEXT,
    subscription_status TEXT DEFAULT 'free',
    subscription_expiry DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    receiver_id INTEGER,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    type TEXT, -- monthly, yearly
    questions TEXT, -- JSON
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    quiz_id INTEGER,
    score INTEGER,
    attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer);
  const PORT = 3000;

  app.use(express.json());

  // Auth Routes
  app.post("/api/auth/register", (req, res) => {
    const { username, email, phone, password, name, class: className, roll, school, address } = req.body;
    const userId = "E" + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    try {
      const stmt = db.prepare("INSERT INTO users (username, email, phone, password, userId, name, class, roll, school, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
      const result = stmt.run(username, email, phone, password, userId, name, className, roll, school, address);
      res.json({ success: true, userId, id: result.lastInsertRowid });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { identifier, password } = req.body; // identifier can be email, username, or phone
    const stmt = db.prepare("SELECT * FROM users WHERE (email = ? OR username = ? OR phone = ?) AND password = ?");
    const user = stmt.get(identifier, identifier, identifier, password);
    
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  });

  // User Data
  app.get("/api/users/:id", (req, res) => {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
    res.json(user);
  });

  // Notices
  app.get("/api/notices", (req, res) => {
    const notices = db.prepare("SELECT * FROM notices ORDER BY created_at DESC").all();
    res.json(notices);
  });

  app.post("/api/notices", (req, res) => {
    const { title, content } = req.body;
    try {
      db.prepare("INSERT INTO notices (title, content) VALUES (?, ?)").run(title, content);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.delete("/api/notices/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM notices WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // Admin: User Management
  app.get("/api/admin/users", (req, res) => {
    const users = db.prepare("SELECT id, username, email, phone, role, userId, name, class, roll, school, subscription_status, created_at FROM users").all();
    res.json(users);
  });

  app.post("/api/admin/users/:id/role", (req, res) => {
    const { role } = req.body;
    try {
      db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.delete("/api/admin/users/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // Subscription
  app.post("/api/subscription/upgrade", (req, res) => {
    const { userId, plan } = req.body;
    try {
      db.prepare("UPDATE users SET subscription_status = 'premium' WHERE id = ?").run(userId);
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
      res.json({ success: true, user });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // Activity Log
  app.get("/api/admin/activity", (req, res) => {
    const logs = db.prepare(`
      SELECT al.*, u.username 
      FROM activity_log al 
      JOIN users u ON al.user_id = u.id 
      ORDER BY al.timestamp DESC 
      LIMIT 50
    `).all();
    res.json(logs);
  });

  app.post("/api/activity", (req, res) => {
    const { userId, action } = req.body;
    try {
      db.prepare("INSERT INTO activity_log (user_id, action) VALUES (?, ?)").run(userId, action);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // Quizzes
  app.get("/api/quizzes", (req, res) => {
    const quizzes = db.prepare("SELECT * FROM quizzes ORDER BY created_at DESC").all();
    res.json(quizzes);
  });

  // Leaderboard
  app.get("/api/leaderboard", (req, res) => {
    const leaderboard = db.prepare(`
      SELECT u.name, u.userId, SUM(qa.score) as total_score 
      FROM quiz_attempts qa 
      JOIN users u ON qa.user_id = u.id 
      GROUP BY u.id 
      ORDER BY total_score DESC 
      LIMIT 10
    `).all();
    res.json(leaderboard);
  });

  // Socket.io for Chat
  io.on("connection", (socket) => {
    console.log("A user connected");
    
    socket.on("join", (userId) => {
      socket.join(`user_${userId}`);
    });

    socket.on("send_message", (data) => {
      const { sender_id, receiver_id, content } = data;
      db.prepare("INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)").run(sender_id, receiver_id, content);
      io.to(`user_${receiver_id}`).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
