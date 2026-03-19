# 700신문고 (Global Korean Voice Platform)

## Project Overview
700신문고는 전 세계 한국인들이 거주 국가에서 겪는 문제를 신고하고 소통할 수 있는 플랫폼입니다.

- **Name**: 700sinmungo (700신문고)
- **Goal**: 재외국민의 목소리를 모으고 대사관과 소통하는 플랫폼
- **Tech Stack**: Hono + Cloudflare Pages + D1 Database + React + TypeScript + TailwindCSS

## 배포 URL
- **Production (Cloudflare Pages)**: https://700sinmungo.pages.dev
- **Latest Deployment**: https://e5f05ac8.700sinmungo.pages.dev
- **Custom Domain**: https://huan.my
- **GitHub Repository**: https://github.com/langsb16-collab/700sinmungo

## 주요 기능
- ✅ 국가별 민원 신고 시스템
- ✅ 카테고리별 게시판 (공론/민원, 구인/구직, 부동산, 홍보, 비즈니스)
- ✅ 다국어 지원 (한국어, 영어, 중문, 일본어, 러시아어, 힌디어, 포르투갈어, 인도네시아어)
- ✅ 실시간 토론방
- ✅ 외교부 민원 접수 시스템
- ✅ 국가별 필터링 및 검색

## 현재 구현된 API
### Health Check
- `GET /api/health` - 서버 상태 확인

### Countries
- `GET /api/countries` - 지원 국가 목록 조회

### Categories  
- `GET /api/categories` - 카테고리 목록 조회

### Posts
- `GET /api/posts?category_code=public&country_code=GH` - 게시글 목록 조회
- `POST /api/posts` - 게시글 작성

### Diplomatic Reports
- `POST /api/diplomatic-reports` - 외교부 민원 신고

### Debate
- `POST /api/debate/create` - 토론방 생성
- `GET /api/debate/rooms` - 토론방 목록

### OTP
- `POST /api/otp/send` - OTP 전송 (시뮬레이션)

## 데이터 아키텍처
### Cloudflare D1 Database (SQLite)
- **countries**: 국가 정보 (10개국)
- **categories**: 카테고리 (5개)
- **posts**: 게시글
- **diplomatic_reports**: 외교부 민원
- **debate_rooms**: 토론방
- **debate_participants**: 토론 참여자
- **messages**: 메시지

### 시드 데이터
- 10개국 국가 데이터 (가나, 미국, 베트남, 일본, 중국, 한국, 영국, 프랑스, 독일, 브라질)
- 5개 카테고리 (공론/민원, 구인/구직, 부동산, 홍보, 비즈니스)
- 3개 샘플 게시글

## 개발 환경 설정
```bash
# 의존성 설치
npm install

# 로컬 D1 마이그레이션
npm run db:migrate:local

# 로컬 D1 시드 데이터
npm run db:seed

# 빌드
npm run build

# 로컬 개발 서버 (PM2)
pm2 start ecosystem.config.cjs
```

## 배포
```bash
# Production D1 마이그레이션
export CLOUDFLARE_API_TOKEN="your-token"
npx wrangler d1 execute 700sinmungo-production --remote --file=./migrations/0001_initial_schema.sql
npx wrangler d1 execute 700sinmungo-production --remote --file=./seed.sql

# Cloudflare Pages 배포
npm run deploy:prod
```

## 프로젝트 구조
```
700sinmungo/
├── src/
│   ├── index.tsx          # Hono 백엔드 (API routes)
│   ├── App.tsx            # React 프론트엔드
│   ├── main.tsx           # React 진입점
│   └── components/        # React 컴포넌트
├── migrations/
│   └── 0001_initial_schema.sql  # D1 스키마
├── dist/                  # 빌드 결과
│   ├── _worker.js         # Hono Worker
│   ├── _routes.json       # 라우팅 설정
│   └── assets/            # 프론트엔드 에셋
├── wrangler.jsonc         # Cloudflare 설정
├── package.json           # 의존성
├── vite.config.ts         # Vite 설정
├── ecosystem.config.cjs   # PM2 설정
└── seed.sql               # 시드 데이터
```

## 기술 스택
- **Backend**: Hono (Edge Runtime Framework)
- **Frontend**: React 19 + TypeScript
- **Styling**: TailwindCSS 4
- **Database**: Cloudflare D1 (SQLite)
- **Deployment**: Cloudflare Pages
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **I18n**: react-i18next

## 향후 개발 계획
- [x] ~~WebSocket 실시간 채팅~~ → HTTP Polling으로 대체 (Cloudflare Pages 호환)
- [ ] 실시간 채팅 (Durable Objects 사용)
- [ ] 이미지 업로드 (Cloudflare R2)
- [ ] 사용자 인증 시스템
- [ ] 관리자 대시보드
- [ ] 통계 및 분석 기능
- [ ] 푸시 알림
- [ ] 모바일 앱 (React Native)

## 배포 상태
- ✅ Cloudflare Pages - 활성
- ✅ Cloudflare D1 - 활성
- ✅ Custom Domain (huan.my) - 활성
- ✅ GitHub Repository - 동기화됨

## 최근 수정 사항 (v1.0.1)
### ✅ 해결된 콘솔 오류

#### 1. WebSocket 연결 실패 수정
- **문제**: `WebSocket connection to 'wss://huan.my/api/chat' failed`
- **원인**: Cloudflare Pages는 WebSocket을 기본 지원하지 않음
- **해결**: WebSocket → HTTP Polling으로 대체
  - 3초마다 메시지 폴링
  - 낙관적 UI 업데이트 (Optimistic UI)
  - 로컬 메시지 즉시 표시
- **향후**: Durable Objects를 사용한 실시간 채팅 구현 예정

#### 2. Chart 높이 오류 수정
- **문제**: `The width(-1) and height(-1) of chart should be greater than 0`
- **원인**: ResponsiveContainer가 부모 높이를 인식하지 못함
- **해결**: 
  - `ResponsiveContainer height={192}` 명시적 높이 지정
  - 부모 div에 `min-h-[192px]` 추가
  - Tailwind h-48 클래스 유지

#### 3. i18n 경고 (무시 가능)
- **메시지**: `i18next is maintained with support from locize`
- **상태**: 정상 (광고 메시지)
- **영향**: 없음

### 🔧 코드 변경 사항
```typescript
// Before (WebSocket)
const ws = new WebSocket('wss://...');
ws.onmessage = (event) => { ... };

// After (HTTP Polling)
useEffect(() => {
  const pollInterval = setInterval(async () => {
    // Poll messages every 3 seconds
  }, 3000);
  return () => clearInterval(pollInterval);
}, [isOpen]);
```

```tsx
// Before (Chart)
<ResponsiveContainer width="100%" height="100%">

// After (Chart)
<ResponsiveContainer width="100%" height={192}>
```

## 마지막 업데이트
- **Date**: 2026-03-19
- **Status**: ✅ Production Ready
- **Version**: 1.0.1
- **Latest Fix**: WebSocket → HTTP Polling, Chart height 오류 수정

## 라이선스
MIT License
