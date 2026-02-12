# DBI Lab Website

> Data and Business Intelligence Lab - Hanyang University

연구실 공식 웹사이트입니다. React + Express + MongoDB 기반의 풀스택 웹 애플리케이션입니다.

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | React + Vite + Ant Design | React 19, Vite 7, Antd 5 |
| **Backend** | Node.js + Express | Node 22, Express 5 |
| **Database** | MongoDB + Mongoose | Mongoose 8 |
| **Auth** | Session-based Key Authentication | Quarterly Auto-rotation |
| **Email** | Nodemailer (SMTP) | - |

---

## Project Structure

```
DBI-NEW-LAB-SITE/
├── client/                      # Frontend (React + Vite)
│   ├── src/
│   │   ├── admin/               # Admin Panel
│   │   │   ├── layouts/         # AdminLayout.jsx
│   │   │   └── pages/           # Dashboard, Settings, CRUD pages
│   │   │       ├── courses/     # CourseList, CourseForm
│   │   │       ├── members/     # MemberList, MemberForm
│   │   │       ├── news/        # NewsList, NewsForm
│   │   │       ├── projects/    # ProjectList, ProjectForm
│   │   │       ├── publications/# PublicationList, PublicationForm
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Login.jsx
│   │   │       └── Settings.jsx
│   │   ├── assets/              # Images, Icons, Course Images
│   │   ├── components/          # Header, Footer, Common Components
│   │   ├── config/              # API Configuration
│   │   ├── pages/               # Public Pages
│   │   │   ├── Home.jsx
│   │   │   ├── Research.jsx
│   │   │   ├── Publications.jsx (Selected/WorkInProgress)
│   │   │   ├── Members.jsx
│   │   │   ├── Professor.jsx
│   │   │   ├── Researchers.jsx
│   │   │   ├── Students.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Courses.jsx
│   │   │   └── News.jsx
│   │   ├── styles/              # CSS Files
│   │   └── routes.jsx           # Router Configuration
│   └── package.json
│
├── server/                      # Backend (Express)
│   ├── lib/                     # Utilities
│   │   ├── emailService.js      # Email Sending (Key Rotation, Alerts)
│   │   ├── keyManager.js        # Admin Key Management
│   │   └── upload.js            # File Upload (Multer, Dynamic Path)
│   ├── middleware/
│   │   └── adminAuth.js         # Admin Authentication Middleware
│   ├── models/                  # MongoDB Schemas
│   │   ├── Course.js
│   │   ├── Member.js
│   │   ├── News.js
│   │   ├── Project.js
│   │   └── Publication.js
│   ├── routes/                  # API Routes
│   │   ├── admin/
│   │   │   ├── auth.js          # Login, Logout, Session, Key Rotation
│   │   │   └── settings.js      # Settings API
│   │   ├── courses.js
│   │   ├── members.js
│   │   ├── news.js
│   │   ├── projects.js
│   │   └── publications.js
│   ├── seeds/                   # Seed Data
│   │   └── seedData.js
│   └── index.js                 # Server Entry Point
│
├── uploads/                     # Uploaded Files (Auto-created)
│   ├── courses/                 # Course Images
│   └── members/                 # Member Profile Images
│
├── .env                         # Environment Variables (DO NOT COMMIT)
├── .env.example                 # Environment Template
├── .admin-key                   # Admin Key Storage (Auto-generated)
├── .site-settings.json          # Site Settings (Email Config)
└── package.json                 # Root Package
```

---

## GPU Server Connection

### 1. SSH 접속

```bash
# 기본 접속
ssh username@gpu-server-ip

# SSH Key 사용 시
ssh -i ~/.ssh/id_rsa username@gpu-server-ip

# 특정 포트 사용 시
ssh -p 22022 username@gpu-server-ip
```

### 2. 로컬 개발을 위한 Port Forwarding

원격 서버의 MongoDB와 개발 서버에 로컬에서 접근하려면:

```bash
# MongoDB + Backend + Frontend 동시 포워딩
ssh -L 27017:localhost:27017 \
    -L 5001:localhost:5001 \
    -L 5173:localhost:5173 \
    username@gpu-server-ip

# 백그라운드 실행 + 연결 유지
ssh -fNL 27017:localhost:27017 \
    -L 5001:localhost:5001 \
    -L 5173:localhost:5173 \
    username@gpu-server-ip
```

접속 후:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/api
- Admin: http://localhost:5173/admin

### 3. 서버에서 직접 실행

```bash
# 프로젝트 디렉토리 이동
cd /path/to/DBI-NEW-LAB-SITE

# 개발 모드 (터미널 유지 필요)
npm run dev

# 백그라운드 실행 (PM2 사용 - 권장)
pm2 start npm --name "dbi-backend" -- run start
pm2 start npm --name "dbi-frontend" -- run frontend --prefix client

# PM2 상태 확인
pm2 status
pm2 logs dbi-backend
```

### 4. 서버 자동 시작 설정

```bash
# PM2 시작 스크립트 저장
pm2 save

# 서버 재부팅 시 자동 시작
pm2 startup
```

---

## Initial Setup

### Step 1: Prerequisites 확인

```bash
# Node.js 버전 확인 (22.x 권장)
node -v

# npm 버전 확인
npm -v

# MongoDB 상태 확인
mongod --version
sudo systemctl status mongod
```

### Step 2: 프로젝트 Clone 및 의존성 설치

```bash
# Clone
git clone [repository-url] DBI-NEW-LAB-SITE
cd DBI-NEW-LAB-SITE

# Root 의존성 설치
npm install

# Client 의존성 설치
cd client && npm install && cd ..
```

### Step 3: 환경변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# 편집
nano .env  # 또는 vim .env
```

`.env` 파일 내용:

```env
# ============================================
# MongoDB 연결
# ============================================
MONGO_URI=mongodb://localhost:27017/dbi-lab

# ============================================
# 세션 설정
# ============================================
SESSION_SECRET=your-very-secure-random-string-here

# ============================================
# 이메일 설정 (SMTP)
# Gmail 사용 시: 앱 비밀번호 필요
# https://myaccount.google.com/apppasswords
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password

# ============================================
# 알림 수신자 이메일
# Key 갱신 시 이 주소로 새 Key 발송
# ============================================
PROFESSOR_EMAIL=professor@hanyang.ac.kr
ADMIN_EMAIL=labmanager@hanyang.ac.kr

# ============================================
# 서버 설정
# ============================================
PORT=5001
NODE_ENV=development
```

### Step 4: MongoDB 시작

```bash
# Linux (systemd)
sudo systemctl start mongod
sudo systemctl enable mongod  # 부팅 시 자동 시작

# macOS (Homebrew)
brew services start mongodb-community

# 연결 테스트
mongosh
> show dbs
```

### Step 5: 초기 데이터 시드 (선택)

```bash
npm run seed
```

이 명령은 다음 데이터를 삽입합니다:
- Publications (논문)
- Members (멤버)
- Projects (프로젝트)
- News (뉴스)

**주의**: 기존 데이터가 모두 삭제됩니다.

### Step 6: 개발 서버 실행

```bash
# Frontend + Backend 동시 실행
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5001
- **Admin Panel**: http://localhost:5173/admin

### Step 7: Admin 최초 로그인

서버 첫 실행 시 Admin Key가 자동 생성됩니다.

```bash
# 콘솔에서 확인
새 Admin Key 생성됨 (콘솔에서 확인하세요): xK9mP2nL4qRs

# 또는 파일에서 확인
cat .admin-key
```

이 Key로 `/admin` 페이지에서 로그인합니다.

---

## Implemented Features

### Public Pages (사용자 페이지)

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | 메인 페이지 - Hero 섹션, 연구 분야 개요, 최근 소식 |
| **Research** | `/research` | 연구 분야 상세 소개 |
| **Selected Publications** | `/selected-publications` | 선별된 주요 논문 목록 |
| **Work in Progress** | `/work-in-progress-publications` | 진행 중인 연구 논문 |
| **Members** | `/members` | 전체 멤버 목록 |
| **Professor** | `/professor` | 교수님 상세 프로필, 경력, 수상 내역 |
| **Researchers** | `/researchers` | 연구원 목록 (Research Professor, Visiting) |
| **Students** | `/students` | 학생 목록 (PhD, MS, BS) |
| **Projects** | `/projects` | 프로젝트 목록 (진행중/완료/예정) |
| **Courses** | `/courses` | 강의 목록 - 테이블 레이아웃 (대학/학기/학부·대학원별 분류) |
| **News** | `/news` | 뉴스 및 공지사항 |

### Admin Panel (관리자 페이지)

| Page | Route | Description |
|------|-------|-------------|
| **Login** | `/admin/login` | Key 기반 로그인 |
| **Dashboard** | `/admin` | 대시보드 - 콘텐츠 통계, 시스템 상태 |
| **Courses** | `/admin/courses` | 강의 CRUD + 이미지 업로드 |
| **Publications** | `/admin/publications` | 논문 CRUD (Type, Category, Selected 등 필터) |
| **Members** | `/admin/members` | 멤버 CRUD + 프로필 이미지 업로드 |
| **Projects** | `/admin/projects` | 프로젝트 CRUD |
| **News** | `/admin/news` | 뉴스 CRUD |
| **Settings** | `/admin/settings` | 설정 관리 |

### Settings Page 기능

| Feature | Description |
|---------|-------------|
| **Key 정보 표시** | 현재 Key 버전, 분기(Q1~Q4), 만료일 표시 |
| **Key 수동 갱신** | 긴급 시 즉시 갱신 (확인 후 새 Key 이메일 발송, 세션 종료) |
| **이메일 설정** | 교수님/관리자 알림 이메일 주소 변경 |
| **테스트 이메일** | 설정 확인용 테스트 이메일 발송 |
| **로그아웃** | 세션 종료 |

### Key Auto-Rotation 시스템

Admin Key는 분기별로 자동 갱신됩니다:
- **갱신일**: 1월 1일, 4월 1일, 7월 1일, 10월 1일 (오전 9시)
- **새 Key**: 12자리 랜덤 문자열 (영문+숫자)
- **알림**: 설정된 이메일로 새 Key 자동 발송
- **세션**: 갱신 시 기존 세션 자동 무효화
- **저장**: `.admin-key` 파일에 버전 정보와 함께 저장

### File Upload 시스템

| Resource | Upload Path | Prefix |
|----------|-------------|--------|
| Courses | `/uploads/courses/` | `course_` |
| Members | `/uploads/members/` | `member_` |

- 지원 형식: JPG, PNG, WebP, GIF
- 최대 크기: 5MB
- 파일명: `{prefix}_{timestamp}_{random}.{ext}`

---

## API Reference

### Public APIs

```
GET /api/courses                # 강의 목록 (필터: university, term, grad)
GET /api/courses/grouped        # 대학별 그룹화된 강의
GET /api/courses/:id            # 단일 강의

GET /api/publications           # 논문 목록 (필터: year, category, type, selected)
GET /api/publications/:id       # 단일 논문

GET /api/members                # 멤버 목록 (필터: role, active)
GET /api/members/grouped        # 역할별 그룹화된 멤버
GET /api/members/:id            # 단일 멤버

GET /api/projects               # 프로젝트 목록 (필터: status)
GET /api/projects/:id           # 단일 프로젝트

GET /api/news                   # 뉴스 목록 (필터: limit, urgent)
GET /api/news/:id               # 단일 뉴스

GET /api/health                 # 서버 상태 (MongoDB 연결 상태 포함)
```

### Admin APIs (인증 필요)

```
# 인증
POST /api/admin/login           # Key 로그인
POST /api/admin/logout          # 로그아웃
GET  /api/admin/session         # 세션 상태 확인
POST /api/admin/rotate-key      # Key 수동 갱신

# 설정
GET  /api/admin/settings        # 설정 조회
PUT  /api/admin/settings/email  # 이메일 설정 수정
POST /api/admin/settings/test-email  # 테스트 이메일 발송

# CRUD (모든 리소스 동일 패턴)
POST   /api/{resource}          # 생성
PUT    /api/{resource}/:id      # 수정
DELETE /api/{resource}/:id      # 삭제

# 이미지 업로드
POST /api/courses/upload-image  # 강의 이미지
POST /api/members/upload        # 멤버 이미지
```

---

## Database Models

### Course
```javascript
{
  name: String,              // 강의명
  term: 'Spring' | 'Fall',   // 학기
  grad: 'Undergraduate' | 'Graduate',  // 학부/대학원
  year: String,              // 개설 연도 ("2024", "2024, 2025")
  university: 'Hanyang' | 'SNU',  // 대학
  link: String,              // 강의 링크 (선택)
  image: String,             // 이미지 경로
  order: Number,             // 정렬 순서
  isActive: Boolean          // 활성화 여부
}
```

### Member
```javascript
{
  name: String,              // 영문 이름 (필수)
  nameKo: String,            // 한글 이름
  role: 'Professor' | 'Research Professor' | 'PhD' | 'MS' | 'BS' | 'Visiting' | 'Alumni',
  title: String,             // 직책 (Professor/Visiting용)
  email: String,
  image: String,             // 프로필 이미지
  researchInterests: [String],  // 연구 분야 (Professor/Visiting용)
  researchKeyword: String,   // 연구 키워드 (학생용)
  researchFocus: String,     // 연구 초점 (학생용)
  affiliation: String,       // 소속
  secondaryTitle: String,    // 부직책 (Visiting용)
  secondaryAffiliation: String,  // 부소속 (Visiting용)
  website: String,           // 개인 웹사이트
  googleScholar: String,
  linkedin: String,
  github: String,
  orcid: String,
  joinYear: Number,          // 입학/합류 연도
  graduationYear: Number,    // 졸업 연도 (Alumni)
  currentPosition: String,   // 현재 소속 (Alumni)
  isLabManager: Boolean,     // 랩 매니저 여부
  professionalDetails: String,  // 상세 정보 JSON (Professor용)
  order: Number,
  isActive: Boolean
}
```

---

## Scripts

```bash
npm run dev         # Frontend + Backend 동시 실행 (개발용)
npm run frontend    # Frontend만 실행 (Vite dev server)
npm run backend     # Backend만 실행 (nodemon)
npm run start       # Backend Production 실행
npm run seed        # 초기 데이터 시드

# Client 전용
cd client
npm run dev         # Vite 개발 서버
npm run build       # Production 빌드
npm run preview     # 빌드 결과 미리보기
npm run lint        # ESLint 검사
```

---

## Production Deployment

### 1. Build

```bash
cd client
npm run build
# 결과: client/dist/
```

### 2. PM2 설정

```bash
# PM2 설치
npm install -g pm2

# 시작
pm2 start server/index.js --name "dbi-lab"

# 로그 확인
pm2 logs dbi-lab

# 재시작
pm2 restart dbi-lab

# 시작 스크립트 저장 (서버 재부팅 대비)
pm2 save
pm2 startup
```

### 3. Nginx 설정 예시

```nginx
server {
    listen 80;
    server_name dbi-lab.hanyang.ac.kr;

    # Frontend (Static Files)
    location / {
        root /path/to/DBI-NEW-LAB-SITE/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploaded Files
    location /uploads {
        alias /path/to/DBI-NEW-LAB-SITE/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Troubleshooting

### MongoDB 연결 실패

```bash
# 상태 확인
sudo systemctl status mongod

# 시작
sudo systemctl start mongod

# 로그 확인
sudo tail -f /var/log/mongodb/mongod.log
```

### 이미지 업로드 실패

1. 디렉토리 존재 확인:
   ```bash
   ls -la uploads/
   mkdir -p uploads/courses uploads/members
   ```

2. 권한 확인:
   ```bash
   chmod 755 uploads/
   chmod 755 uploads/courses uploads/members
   ```

3. 파일 크기: 5MB 이하인지 확인

### Admin Key 분실

```bash
# 파일에서 확인
cat .admin-key

# 또는 새로 생성
rm .admin-key
npm run start
# 콘솔에서 새 Key 확인
```

### Port Already in Use

```bash
# 사용 중인 프로세스 확인
lsof -i :5001
lsof -i :5173

# 프로세스 종료
kill -9 <PID>
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| **1.0.0** | 2025-01 | Initial Release |
| | | - Public Pages: Home, Research, Publications, Members, Professor, Researchers, Students, Projects, Courses, News |
| | | - Admin Panel: Dashboard, CRUD for all resources |
| | | - Quarterly Auto-rotating Admin Key |
| | | - Email Notification System |
| | | - Settings Page (Key Info, Email Config, Logout) |
| | | - Dynamic File Upload (Courses, Members) |
| | | - Table Layout for Courses Page |

---

## Contact

**Data and Business Intelligence Lab**

Department of Information Systems, Hanyang University
Research and Development Building Room #708-1
222 Wangsimni-ro, Seongdong-gu, Seoul, South Korea, 04763

---

## License

MIT License - DBI Lab, Hanyang University
