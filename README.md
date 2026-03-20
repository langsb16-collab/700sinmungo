# 700신문고 - Global Korean Voice Platform

## 프로젝트 개요
해외 거주 한국인을 위한 커뮤니티 플랫폼

## 배포 정보
- **Production**: https://huan.my
- **Preview**: https://f530e9c8.700sinmungo.pages.dev
- **GitHub**: https://github.com/langsb16-collab/700sinmungo

## 기술 스택
- **Frontend**: React + Vite
- **Backend**: Cloudflare Pages Functions (Hono)
- **Database**: Cloudflare D1
- **Deployment**: Cloudflare Pages

## 주요 기능
- ✅ 다국어 지원 (한국어, 영어, 중국어, 일본어 등)
- ✅ 카테고리별 게시판 (공론·민원, 구인·구직, 부동산, 홍보, 비즈니스)
- ✅ 국가별 필터링
- ✅ 외교 신고 시스템
- ✅ 토론방 (향후 구현)

## API 엔드포인트
- `GET /api/health` - 헬스 체크
- `GET /api/countries` - 국가 목록
- `GET /api/categories` - 카테고리 목록
- `GET /api/posts` - 게시물 목록
- `POST /api/posts` - 게시물 작성
- `POST /api/otp/send` - OTP 발송
- `POST /api/diplomatic-reports` - 외교 신고
- `GET /api/debate/rooms` - 토론방 목록
- `POST /api/debate/create` - 토론방 생성

## 로컬 개발
```bash
npm install
npm run build
npm run deploy
```

## 데이터베이스
- **D1 Database**: 700sinmungo-production
- **Tables**: countries, categories, posts, diplomatic_reports, debate_rooms

## 아키텍처
```
[Browser]
    ↓
[Cloudflare Pages] (정적 파일)
    ↓
[Pages Functions] (/api/*)
    ↓
[D1 Database]
```

## 버전 히스토리
- v1.0.4 - Worker 제거, Pages Functions만 사용
- v1.0.3 - 캐시 버스팅 수정
- v1.0.2 - API 에러 핸들링 추가
- v1.0.1 - WebSocket을 HTTP polling으로 변경
- v1.0.0 - Express에서 Hono로 마이그레이션

## 라이센스
MIT
