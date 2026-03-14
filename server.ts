import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("jobs.db");
const JWT_SECRET = process.env.JWT_SECRET || "sarkari-secret-key";

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user', -- 'user' or 'admin'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    post_date TEXT,
    last_date TEXT,
    short_info TEXT,
    content TEXT,
    external_link TEXT,
    location TEXT,
    job_type TEXT, -- 'Full-time', 'Part-time', 'Contract'
    industry TEXT,
    experience_level TEXT, -- 'Entry', 'Mid', 'Senior'
    qualification TEXT,
    is_filled INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration: Add missing columns if they don't exist (SQLite doesn't support ADD COLUMN IF NOT EXISTS)
const tableInfo = db.prepare("PRAGMA table_info(jobs)").all() as any[];
const columns = tableInfo.map(c => c.name);

if (!columns.includes('is_filled')) {
  db.exec("ALTER TABLE jobs ADD COLUMN is_filled INTEGER DEFAULT 0");
}
if (!columns.includes('views')) {
  db.exec("ALTER TABLE jobs ADD COLUMN views INTEGER DEFAULT 0");
}
if (!columns.includes('location')) {
  db.exec("ALTER TABLE jobs ADD COLUMN location TEXT");
}
if (!columns.includes('job_type')) {
  db.exec("ALTER TABLE jobs ADD COLUMN job_type TEXT");
}
if (!columns.includes('industry')) {
  db.exec("ALTER TABLE jobs ADD COLUMN industry TEXT");
}
if (!columns.includes('experience_level')) {
  db.exec("ALTER TABLE jobs ADD COLUMN experience_level TEXT");
}
if (!columns.includes('qualification')) {
  db.exec("ALTER TABLE jobs ADD COLUMN qualification TEXT");
}

db.exec(`
  CREATE TABLE IF NOT EXISTS saved_jobs (
    user_id INTEGER,
    job_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, job_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
  );

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    job_id INTEGER,
    status TEXT DEFAULT 'applied',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
  );
`);

// Seed some initial data if empty
const rowCount = db.prepare("SELECT count(*) as count FROM jobs").get() as { count: number };
if (rowCount.count === 0) {
  const insert = db.prepare(`
    INSERT INTO jobs (title, category, post_date, last_date, short_info, content, location, job_type, industry, experience_level, qualification)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insert.run(
    "SSC CGL 2024 Tier II Admit Card",
    "admit_card",
    "2024-03-10",
    "2024-03-20",
    "Staff Selection Commission (SSC) has released the admit card for CGL 2024 Tier II Exam.",
    "# SSC CGL 2024 Tier II Admit Card\n\nStaff Selection Commission (SSC) has released the admit card for Combined Graduate Level (CGL) 2024 Tier II Examination.",
    "All India", "Full-time", "Government", "Entry", "Graduate"
  );

  insert.run(
    "Railway RPF Constable Recruitment 2024",
    "latest_job",
    "2024-03-01",
    "2024-04-15",
    "Railway Recruitment Board (RRB) invites online applications for RPF Constable posts.",
    "# Railway RPF Constable Recruitment 2024\n\nRailway Recruitment Board (RRB) is inviting applications for the post of Constable in Railway Protection Force (RPF).",
    "Multiple Locations", "Full-time", "Railway", "Entry", "10th Pass"
  );
}

// Seed Admin if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE role = 'admin'").get();
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)").run("admin@sarkari.com", hashedPassword, "Admin User", "admin");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  const isAdmin = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
    next();
  };

  // Auth Routes
  app.post("/api/auth/register", (req, res) => {
    const { email, password, name } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const result = db.prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)").run(email, hashedPassword, name);
      res.json({ id: result.lastInsertRowid });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '1d' });
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    res.json({ id: user.id, email: user.email, role: user.role, name: user.name });
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
  });

  app.get("/api/auth/me", authenticate, (req: any, res) => {
    res.json(req.user);
  });

  // Jobs Routes (Public)
  app.get("/api/jobs", (req, res) => {
    const { category, q, location, job_type, industry, experience_level, qualification } = req.query;
    let query = "SELECT * FROM jobs WHERE is_filled = 0";
    const params: any[] = [];

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }
    if (q) {
      query += " AND (title LIKE ? OR content LIKE ?)";
      params.push(`%${q}%`, `%${q}%`);
    }
    if (location) {
      query += " AND location LIKE ?";
      params.push(`%${location}%`);
    }
    if (job_type) {
      query += " AND job_type = ?";
      params.push(job_type);
    }
    if (industry) {
      query += " AND industry = ?";
      params.push(industry);
    }
    if (experience_level) {
      query += " AND experience_level = ?";
      params.push(experience_level);
    }
    if (qualification) {
      query += " AND qualification LIKE ?";
      params.push(`%${qualification}%`);
    }

    query += " ORDER BY created_at DESC";
    const jobs = db.prepare(query).all(...params);
    res.json(jobs);
  });

  app.get("/api/jobs/:id", (req, res) => {
    db.prepare("UPDATE jobs SET views = views + 1 WHERE id = ?").run(req.params.id);
    const job = db.prepare("SELECT * FROM jobs WHERE id = ?").get(req.params.id);
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ error: "Job not found" });
    }
  });

  // User Protected Routes
  app.post("/api/user/save-job/:id", authenticate, (req: any, res) => {
    try {
      db.prepare("INSERT INTO saved_jobs (user_id, job_id) VALUES (?, ?)").run(req.user.id, req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: "Job already saved or error" });
    }
  });

  app.delete("/api/user/save-job/:id", authenticate, (req: any, res) => {
    try {
      db.prepare("DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?").run(req.user.id, req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: "Error unsaving job" });
    }
  });

  app.get("/api/user/saved-jobs", authenticate, (req: any, res) => {
    const jobs = db.prepare(`
      SELECT j.* FROM jobs j 
      JOIN saved_jobs sj ON j.id = sj.job_id 
      WHERE sj.user_id = ?
    `).all(req.user.id);
    res.json(jobs);
  });

  app.post("/api/user/apply/:id", authenticate, (req: any, res) => {
    try {
      db.prepare("INSERT INTO applications (user_id, job_id) VALUES (?, ?)").run(req.user.id, req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: "Already applied or error" });
    }
  });

  app.get("/api/user/applications", authenticate, (req: any, res) => {
    const apps = db.prepare(`
      SELECT a.*, j.title as job_title FROM applications a 
      JOIN jobs j ON a.job_id = j.id 
      WHERE a.user_id = ?
    `).all(req.user.id);
    res.json(apps);
  });

  // Admin Routes
  app.post("/api/admin/jobs", authenticate, isAdmin, (req, res) => {
    const { title, category, post_date, last_date, short_info, content, external_link, location, job_type, industry, experience_level, qualification } = req.body;
    const result = db.prepare(`
      INSERT INTO jobs (title, category, post_date, last_date, short_info, content, external_link, location, job_type, industry, experience_level, qualification)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, category, post_date, last_date, short_info, content, external_link, location, job_type, industry, experience_level, qualification);
    res.json({ id: result.lastInsertRowid });
  });

  app.put("/api/admin/jobs/:id", authenticate, isAdmin, (req, res) => {
    const { title, category, post_date, last_date, short_info, content, external_link, location, job_type, industry, experience_level, qualification, is_filled } = req.body;
    db.prepare(`
      UPDATE jobs SET 
        title = ?, category = ?, post_date = ?, last_date = ?, short_info = ?, 
        content = ?, external_link = ?, location = ?, job_type = ?, 
        industry = ?, experience_level = ?, qualification = ?, is_filled = ?
      WHERE id = ?
    `).run(title, category, post_date, last_date, short_info, content, external_link, location, job_type, industry, experience_level, qualification, is_filled ? 1 : 0, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/admin/jobs/:id", authenticate, isAdmin, (req, res) => {
    db.prepare("DELETE FROM jobs WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/admin/analytics", authenticate, isAdmin, (req, res) => {
    const topJobs = db.prepare("SELECT title, views FROM jobs ORDER BY views DESC LIMIT 5").all();
    const totalJobs = db.prepare("SELECT count(*) as count FROM jobs").get();
    const totalUsers = db.prepare("SELECT count(*) as count FROM users").get();
    const totalApps = db.prepare("SELECT count(*) as count FROM applications").get();
    res.json({ topJobs, totalJobs, totalUsers, totalApps });
  });

  // Catch-all for API routes to prevent SPA fallback returning HTML
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: "API route not found" });
  });

  // Serve static files and index.html for all non-API routes
  if (process.env.NODE_ENV !== "production") {
    // Development mode: Use Vite with middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve pre-built files
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
