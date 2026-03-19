-- Insert countries
INSERT OR IGNORE INTO countries (code, name_ko, continent) VALUES 
  ('GH', '가나', 'Africa'),
  ('US', '미국', 'North America'),
  ('VN', '베트남', 'Asia'),
  ('JP', '일본', 'Asia'),
  ('CN', '중국', 'Asia'),
  ('KR', '한국', 'Asia'),
  ('GB', '영국', 'Europe'),
  ('FR', '프랑스', 'Europe'),
  ('DE', '독일', 'Europe'),
  ('BR', '브라질', 'South America');

-- Insert categories
INSERT OR IGNORE INTO categories (id, code, label_ko) VALUES 
  ('cat-001', 'public', '공론·민원'),
  ('cat-002', 'job', '구인·구직'),
  ('cat-003', 'realestate', '부동산'),
  ('cat-004', 'promotion', '홍보'),
  ('cat-005', 'business', '비즈니스');

-- Insert sample posts
INSERT OR IGNORE INTO posts (id, category_id, title, content, country_code, nationality, price, status) VALUES
  ('post-001', 'cat-001', '가나 대사관 영사 서비스 개선 요청', '영사 업무 처리 시간이 너무 오래 걸립니다.', 'GH', 'KR', '', 'active'),
  ('post-002', 'cat-002', '한국어 강사 구합니다', '가나 현지에서 한국어를 가르칠 강사를 찾습니다.', 'GH', 'GH', '월 2000달러', 'active'),
  ('post-003', 'cat-003', '아크라 중심가 아파트 임대', '2베드룸, 주차장 포함', 'GH', 'KR', '월 800달러', 'active');
