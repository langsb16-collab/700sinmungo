-- Countries table
CREATE TABLE IF NOT EXISTS countries (
  code TEXT PRIMARY KEY,
  name_ko TEXT NOT NULL,
  continent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  label_ko TEXT NOT NULL
);

-- Diplomatic reports table
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

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  category_id TEXT,
  title TEXT NOT NULL,
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

-- Debate rooms table
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

-- Debate participants table
CREATE TABLE IF NOT EXISTS debate_participants (
  id TEXT PRIMARY KEY,
  room_id TEXT,
  phone_hash TEXT,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(room_id, phone_hash),
  FOREIGN KEY(room_id) REFERENCES debate_rooms(id) ON DELETE CASCADE
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  room TEXT,
  sender TEXT,
  text TEXT,
  type TEXT DEFAULT 'text',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_country_code ON posts(country_code);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_diplomatic_reports_country ON diplomatic_reports(country_code);
CREATE INDEX IF NOT EXISTS idx_debate_participants_room ON debate_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_room ON messages(room);
