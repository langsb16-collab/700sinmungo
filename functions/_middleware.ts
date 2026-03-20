import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { v4 as uuidv4 } from 'uuid';

type Bindings = {
  DB: D1Database;
  BUCKET?: R2Bucket;
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

// File upload (R2)
app.post('/api/upload', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const key = `uploads/${Date.now()}-${file.name}`;
    
    // R2가 설정되어 있으면 업로드
    if (c.env.BUCKET) {
      await c.env.BUCKET.put(key, file.stream());
      return c.json({ 
        success: true, 
        url: `https://cdn.huan.my/${key}`,
        key 
      });
    }
    
    // R2 없으면 시뮬레이션
    return c.json({ 
      success: true, 
      url: `/uploads/${file.name}`,
      key,
      message: 'R2 not configured, using simulation'
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Chat messages (polling)
app.get('/api/chat/messages', async (c) => {
  // 간단한 메시지 목록 반환
  return c.json({ 
    messages: [
      "시스템: 채팅방에 오신 것을 환영합니다",
      "관리자: 문의사항이 있으시면 말씀해주세요"
    ]
  });
});

// Send chat message
app.post('/api/chat/send', async (c) => {
  const body = await c.req.json();
  // 실제로는 DB나 메모리에 저장
  return c.json({ success: true, message: body.message });
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
  const { title, content, category_id, country_code, nationality, price, file_url } = body;
  
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
