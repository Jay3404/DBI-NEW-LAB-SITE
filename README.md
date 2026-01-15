# DBI Lab Website

DBI (Database Intelligence) Lab 공식 웹사이트

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 + Vite + Ant Design |
| **Backend** | Node.js + Express 5 |
| **Database** | MongoDB + Mongoose |
| **Auth** | Session-based Key Authentication |

## Project Structure

```
DBI-NEW-LAB-SITE/
├── client/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/              # Public 페이지
│   │   ├── admin/              # 관리자 페이지
│   │   ├── components/         # 공통 컴포넌트
│   │   ├── styles/             # CSS 스타일
│   │   └── config/             # API 설정
│   └── package.json
│
├── server/                     # Backend (Express)
│   ├── models/                 # MongoDB 스키마
│   ├── routes/                 # API 라우트
│   ├── middleware/             # 인증 미들웨어
│   ├── lib/                    # 유틸리티 (Key 관리, 이메일, 업로드)
│   └── index.js                # 서버 엔트리
│
├── uploads/                    # 업로드된 파일
├── .env.example                # 환경변수 템플릿
└── package.json                # 루트 패키지
```

## Quick Start

### 1. 패키지 설치

```bash
# 루트 의존성 설치
npm install

# 클라이언트 의존성 설치
cd client && npm install && cd ..
```

### 2. 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일 편집:
```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/dbi-lab

# Admin Key (서버 시작 시 자동 생성됨)
ADMIN_KEY=your-initial-key

# Session
SESSION_SECRET=your-secret-key

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Recipients (Key 갱신 알림 수신)
PROFESSOR_EMAIL=professor@hanyang.ac.kr
ADMIN_EMAIL=admin@hanyang.ac.kr
```

### 3. MongoDB 실행

```bash
# macOS (Homebrew)
brew services start mongodb-community

# 또는 직접 실행
mongod --dbpath /path/to/data
```

### 4. 개발 서버 실행

```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Admin**: http://localhost:5173/admin

## Admin System

### Key 기반 인증

- 아이디/패스워드 없이 10자 이상 문자열 Key로 로그인
- Key는 분기별 자동 갱신 (1월, 4월, 7월, 10월 1일)
- 갱신 시 교수님 + 담당자 이메일로 자동 발송

### 최초 로그인

서버 첫 실행 시 콘솔에 초기 Key가 출력됩니다:
```
새 Admin Key 생성됨 (콘솔에서 확인하세요): xK9mP2nL4qRs
```

또는 `.admin-key` 파일에서 확인 가능합니다.

### 관리자 기능

| 메뉴 | 기능 |
|------|------|
| Dashboard | 통계 요약, 시스템 상태 |
| Courses | 강의 CRUD, 이미지 업로드 |
| Publications | 논문 관리 (예정) |
| Members | 멤버 관리 (예정) |
| Projects | 프로젝트 관리 (예정) |

## API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | 강의 목록 (필터 지원) |
| GET | `/api/courses/grouped` | 대학별 그룹화된 강의 |
| GET | `/api/courses/:id` | 단일 강의 조회 |
| GET | `/api/health` | 서버 상태 확인 |

### Admin (인증 필요)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Key 로그인 |
| POST | `/api/admin/logout` | 로그아웃 |
| GET | `/api/admin/session` | 세션 확인 |
| POST | `/api/courses` | 강의 추가 |
| PUT | `/api/courses/:id` | 강의 수정 |
| DELETE | `/api/courses/:id` | 강의 삭제 |
| POST | `/api/courses/upload-image` | 이미지 업로드 |

## Scripts

```bash
npm run dev       # Frontend + Backend 동시 실행
npm run frontend  # Frontend만 실행
npm run backend   # Backend만 실행
npm run start     # Production 서버 실행
```

## Deployment

### GPU 서버 배포

```bash
# 1. 저장소 클론
git clone <repository-url>
cd DBI-NEW-LAB-SITE

# 2. 의존성 설치
npm install
cd client && npm install && npm run build && cd ..

# 3. 환경변수 설정
cp .env.example .env
# .env 편집

# 4. PM2로 서버 실행
pm2 start server/index.js --name dbi-lab

# 5. Nginx 리버스 프록시 설정
# /etc/nginx/sites-available/dbi-lab
```

## Backup

자동 백업 스크립트가 cron으로 실행됩니다:

```bash
# MongoDB 백업 (매일 02:00)
0 2 * * * /path/to/backup.sh
```

백업 위치: `/backup/mongodb/`

## License

Private - DBI Lab Internal Use Only
