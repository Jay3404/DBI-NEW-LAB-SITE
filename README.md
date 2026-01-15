# DBI Lab Website

DBI (Data and Business Intelligence) Lab 공식 웹사이트

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
- **Backend**: http://localhost:5001
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
| Publications | 논문 관리 (SCI/SSCI/KCI, Selected, Work in Progress) |
| Members | 멤버 관리 (교수/연구원/학생/Alumni) |
| Projects | 프로젝트 관리 (진행중/완료/예정) |
| News | 뉴스/공지사항 관리 |

## API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | 강의 목록 (필터 지원) |
| GET | `/api/courses/grouped` | 대학별 그룹화된 강의 |
| GET | `/api/courses/:id` | 단일 강의 조회 |
| GET | `/api/publications` | 논문 목록 (year/category/type 필터) |
| GET | `/api/publications/:id` | 단일 논문 조회 |
| GET | `/api/members` | 멤버 목록 (role 필터) |
| GET | `/api/members/:id` | 단일 멤버 조회 |
| GET | `/api/projects` | 프로젝트 목록 (status 필터) |
| GET | `/api/projects/:id` | 단일 프로젝트 조회 |
| GET | `/api/news` | 뉴스 목록 (limit/urgent 필터) |
| GET | `/api/news/:id` | 단일 뉴스 조회 |
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
| POST | `/api/courses/upload-image` | 강의 이미지 업로드 |
| POST | `/api/publications` | 논문 추가 |
| PUT | `/api/publications/:id` | 논문 수정 |
| DELETE | `/api/publications/:id` | 논문 삭제 |
| POST | `/api/members` | 멤버 추가 |
| PUT | `/api/members/:id` | 멤버 수정 |
| DELETE | `/api/members/:id` | 멤버 삭제 |
| POST | `/api/members/upload` | 멤버 이미지 업로드 |
| POST | `/api/projects` | 프로젝트 추가 |
| PUT | `/api/projects/:id` | 프로젝트 수정 |
| DELETE | `/api/projects/:id` | 프로젝트 삭제 |
| POST | `/api/news` | 뉴스 추가 |
| PUT | `/api/news/:id` | 뉴스 수정 |
| DELETE | `/api/news/:id` | 뉴스 삭제 |

## Scripts

```bash
npm run dev       # Frontend + Backend 동시 실행
npm run frontend  # Frontend만 실행
npm run backend   # Backend만 실행
npm run start     # Production 서버 실행
npm run seed      # 초기 데이터 시드 (Publications, News, Projects, Members)
```

## Data Initialization

데이터베이스에 초기 데이터를 삽입하려면:

```bash
npm run seed
```

이 명령은 다음 데이터를 MongoDB에 삽입합니다:
- **Publications**: 선택된 논문 + Work-in-Progress 논문
- **News**: 연구실 뉴스 및 공지사항
- **Projects**: 진행중/완료/예정 프로젝트
- **Members**: 교수, 연구원(Visiting), PhD/MS 학생

주의: 기존 데이터는 모두 삭제되고 새로운 데이터로 교체됩니다.

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
