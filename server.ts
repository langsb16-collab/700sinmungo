import express from "express";
import expressWs from "express-ws";
import { createServer as createViteServer } from "vite";
import { v4 as uuidv4 } from "uuid";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Cloudflare D1 Mock for Local Dev ---
const db = new Database("gkv.db");
const d1 = {
  prepare: (sql: string) => ({
    bind: (...args: any[]) => ({
      all: async () => ({ results: db.prepare(sql).all(...args) }),
      run: async () => {
        const info = db.prepare(sql).run(...args);
        return { success: true, meta: info };
      },
      first: async () => db.prepare(sql).get(...args),
    }),
    all: async () => ({ results: db.prepare(sql).all() }),
    run: async () => {
      const info = db.prepare(sql).run();
      return { success: true, meta: info };
    },
    first: async () => db.prepare(sql).get(),
  }),
  exec: async (sql: string) => {
    db.exec(sql);
    return { success: true };
  }
};

// Initialize Database Schema
d1.exec(`
  CREATE TABLE IF NOT EXISTS countries (
    code TEXT PRIMARY KEY,
    name_ko TEXT,
    continent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS diplomatic_reports (
    id TEXT PRIMARY KEY,
    phone_hash TEXT,
    country_code TEXT,
    mission_name TEXT,
    complaint_type TEXT,
    description TEXT,
    is_anonymous INTEGER DEFAULT 1,
    status TEXT DEFAULT 'received',
    priority_score INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(country_code) REFERENCES countries(code)
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE,
    label_ko TEXT
  );

  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    category_id TEXT,
    title TEXT,
    content TEXT,
    country_code TEXT,
    nationality TEXT,
    phone_hash TEXT,
    price TEXT,
    meta TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(category_id) REFERENCES categories(id),
    FOREIGN KEY(country_code) REFERENCES countries(code)
  );

  CREATE TABLE IF NOT EXISTS debate_rooms (
    id TEXT PRIMARY KEY,
    creator_phone_hash TEXT NOT NULL,
    topic TEXT NOT NULL,
    title TEXT NOT NULL,
    max_participants INTEGER DEFAULT 100,
    current_participants INTEGER DEFAULT 1,
    is_private INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS debate_participants (
    id TEXT PRIMARY KEY,
    room_id TEXT REFERENCES debate_rooms(id) ON DELETE CASCADE,
    phone_hash TEXT,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(room_id, phone_hash)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    room TEXT,
    sender TEXT,
    text TEXT,
    type TEXT DEFAULT 'text',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed data
const countryCount = db.prepare("SELECT COUNT(*) as count FROM countries").get() as { count: number };
if (countryCount.count === 0) {
  const countries = [
    ["GH", "가나", "Africa"], ["US", "미국", "North America"], ["VN", "베트남", "Asia"], ["JP", "일본", "Asia"], ["CN", "중국", "Asia"]
  ];
  countries.forEach(([code, name, continent]) => {
    db.prepare("INSERT INTO countries (code, name_ko, continent) VALUES (?, ?, ?)").run(code, name, continent);
  });
}

const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
if (categoryCount.count === 0) {
  db.prepare("INSERT INTO categories (id, code, label_ko) VALUES (?, ?, ?)").run(uuidv4(), 'public', '공론·민원');
  db.prepare("INSERT INTO categories (id, code, label_ko) VALUES (?, ?, ?)").run(uuidv4(), 'job', '구인·구직');
  db.prepare("INSERT INTO categories (id, code, label_ko) VALUES (?, ?, ?)").run(uuidv4(), 'realestate', '부동산');
  db.prepare("INSERT INTO categories (id, code, label_ko) VALUES (?, ?, ?)").run(uuidv4(), 'promotion', '홍보');
  db.prepare("INSERT INTO categories (id, code, label_ko) VALUES (?, ?, ?)").run(uuidv4(), 'business', '비즈니스');
}

async function startServer() {
  const app = express();
  const wsInstance = expressWs(app);
  const PORT = 3000;

  const upload = multer();

  app.use(express.json());

  // --- API Routes ---
  app.post("/api/otp/send", (req, res) => {
    const { phone } = req.body;
    res.json({ success: true, message: "OTP sent successfully (Simulated)" });
  });

  app.post("/api/diplomatic-reports", async (req, res) => {
    const body = req.body;
    const id = uuidv4();
    const priority_score = 10;

    await d1.prepare(`
      INSERT INTO diplomatic_reports (id, phone_hash, country_code, mission_name, complaint_type, description, is_anonymous, priority_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(id, body.phone_hash, body.country_code, body.mission_name, body.complaint_type, body.description, body.is_anonymous ? 1 : 0, priority_score).run();

    res.json({ status: 'submitted', id, priority_score });
  });

  app.get("/api/countries", async (req, res) => {
    const { results } = await d1.prepare("SELECT * FROM countries ORDER BY name_ko ASC").all();
    res.json(results);
  });

  app.get("/api/categories", async (req, res) => {
    const { results } = await d1.prepare("SELECT * FROM categories").all();
    res.json(results);
  });

  app.get("/api/posts", async (req, res) => {
    const { category_code, country_code } = req.query;
    let query = `
      SELECT p.*, c.code as category_code, co.name_ko as country_name
      FROM posts p 
      JOIN categories c ON p.category_id = c.id 
      JOIN countries co ON p.country_code = co.code
      WHERE 1=1
    `;
    const params: any[] = [];
    if (category_code) { query += " AND c.code = ?"; params.push(category_code); }
    if (country_code) { query += " AND p.country_code = ?"; params.push(country_code); }
    query += " ORDER BY p.created_at DESC";

    const { results } = await d1.prepare(query).bind(...params).all();
    res.json(results);
  });

  app.post("/api/posts", upload.none(), async (req, res) => {
    const { title, content, category_id, country_code, nationality, price } = req.body;
    const id = uuidv4();
    
    await d1.prepare(`
      INSERT INTO posts (id, title, content, category_id, country_code, nationality, price)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(id, title, content, category_id, country_code, nationality, price || "").run();

    res.json({ success: true, id });
  });

  app.post("/api/debate/create", async (req, res) => {
    const { title, topic, max_participants } = req.body;
    const id = uuidv4();
    
    await d1.prepare(`
      INSERT INTO debate_rooms (id, title, topic, max_participants, creator_phone_hash)
      VALUES (?, ?, ?, ?, ?)
    `).bind(id, title, topic, max_participants, "simulated_hash").run();

    res.json({ success: true, id });
  });

  // --- WebSocket Chat ---
  (app as any).ws('/api/chat', (ws: any, req: any) => {
    ws.on('message', (msg: string) => {
      const data = JSON.parse(msg);
      if (data.type === 'join') {
        // Handle join
      } else if (data.type === 'message') {
        // Broadcast to all clients
        const clients = wsInstance.getWss().clients;
        clients.forEach((client: any) => {
          if (client.readyState === 1) { // OPEN
            client.send(JSON.stringify({
              type: 'message',
              payload: {
                ...data.payload,
                id: uuidv4()
              }
            }));
          }
        });
      }
    });
  });

  // --- Vite Integration ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

