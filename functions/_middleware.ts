import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { v4 as uuidv4 } from 'uuid';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/api/*', cors());

// Health check
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// Get countries
app.get('/api/countries', async (c) => {
  const { DB } = c.env;
  const { results } = await DB.prepare(
    'SELECT * FROM countries ORDER BY name_ko ASC'
  ).all();
  return c.json(results);
});

// Get categories
app.get('/api/categories', async (c) => {
  const { DB } = c.env;
  const { results } = await DB.prepare(
    'SELECT * FROM categories'
  ).all();
  return c.json(results);
});

// Get posts
app.get('/api/posts', async (c) => {
  const { DB } = c.env;
  const category_code = c.req.query('category_code');
  const country_code = c.req.query('country_code');

  let query = `
    SELECT p.*, c.code as category_code, co.name_ko as country_name
    FROM posts p 
    JOIN categories c ON p.category_id = c.id 
    JOIN countries co ON p.country_code = co.code
    WHERE 1=1
  `;
  
  const params: string[] = [];
  
  if (category_code) {
    query += ' AND c.code = ?';
    params.push(category_code);
  }
  
  if (country_code) {
    query += ' AND p.country_code = ?';
    params.push(country_code);
  }
  
  query += ' ORDER BY p.created_at DESC';

  const { results } = await DB.prepare(query).bind(...params).all();
  return c.json(results);
});

// Create post
app.post('/api/posts', async (c) => {
  const { DB } = c.env;
  const body = await c.req.json();
  const { title, content, category_id, country_code, nationality, price } = body;
  
  const id = uuidv4();
  
  await DB.prepare(`
    INSERT INTO posts (id, title, content, category_id, country_code, nationality, price)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(id, title, content, category_id, country_code, nationality, price || '').run();

  return c.json({ success: true, id });
});

// OTP send
app.post('/api/otp/send', async (c) => {
  return c.json({ 
    success: true, 
    message: 'OTP sent successfully (Simulated)' 
  });
});

// Diplomatic reports
app.post('/api/diplomatic-reports', async (c) => {
  const { DB } = c.env;
  const body = await c.req.json();
  
  const id = uuidv4();
  const priority_score = 10;

  await DB.prepare(`
    INSERT INTO diplomatic_reports (id, title, content, country_code, reporter_phone_hash, priority_score)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(id, body.title, body.content, body.country_code, 'simulated_hash', priority_score).run();

  return c.json({ success: true, id, priority_score });
});

// Debate rooms
app.get('/api/debate/rooms', async (c) => {
  const { DB } = c.env;
  const { results } = await DB.prepare(`
    SELECT * FROM debate_rooms 
    ORDER BY created_at DESC 
    LIMIT 50
  `).all();
  
  return c.json(results);
});

app.post('/api/debate/create', async (c) => {
  const { DB } = c.env;
  const body = await c.req.json();
  const { title, topic, max_participants } = body;
  
  const id = uuidv4();
  
  await DB.prepare(`
    INSERT INTO debate_rooms (id, title, topic, max_participants, creator_phone_hash)
    VALUES (?, ?, ?, ?, ?)
  `).bind(id, title, topic, max_participants, 'simulated_hash').run();

  return c.json({ success: true, id });
});

// Chat not implemented
app.get('/api/chat', (c) => {
  return c.json({ 
    error: 'WebSocket chat requires Durable Objects',
    message: 'Real-time chat feature coming soon'
  }, 501);
});

export const onRequest: PagesFunction<Bindings> = async (context) => {
  // Only handle /api/* requests
  const url = new URL(context.request.url);
  if (url.pathname.startsWith('/api/')) {
    return app.fetch(context.request, context.env, context);
  }
  
  // Pass through all other requests to Pages
  return context.next();
};
