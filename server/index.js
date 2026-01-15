require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');

const app = express();

// ============================================
// MongoDB 연결
// ============================================
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/dbi-lab';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB 연결 실패:', err.message);
    console.log('MongoDB 없이 계속 실행합니다...');
  });

// ============================================
// 미들웨어
// ============================================

// CORS 설정
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// 세션 설정
app.use(session({
  secret: process.env.SESSION_SECRET || 'dbi-lab-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 2 * 60 * 60 * 1000 // 2시간
  }
}));

// 정적 파일
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 요청 로깅 (개발용)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// Key Manager 초기화
// ============================================
const keyManager = require('./lib/keyManager');
const emailService = require('./lib/emailService');

// 이메일 서비스 초기화
emailService.initialize();

// Key Manager 초기화 (분기별 자동 갱신 스케줄 등록)
keyManager.initialize();

// ============================================
// API 라우트
// ============================================

// 관리자 인증
app.use('/api/admin', require('./routes/admin/auth'));

// API Routes
app.use('/api/courses', require('./routes/courses'));
app.use('/api/publications', require('./routes/publications'));
app.use('/api/members', require('./routes/members'));
app.use('/api/news', require('./routes/news'));
app.use('/api/projects', require('./routes/projects'));

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ============================================
// 에러 핸들링
// ============================================
app.use((err, req, res, next) => {
  console.error('서버 오류:', err);

  // Multer 에러 처리
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'FileTooLarge',
      message: '파일 크기는 5MB 이하여야 합니다.'
    });
  }

  res.status(500).json({
    success: false,
    error: 'ServerError',
    message: process.env.NODE_ENV === 'production'
      ? '서버 오류가 발생했습니다.'
      : err.message
  });
});

// 404 핸들링
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'NotFound',
    message: '요청한 리소스를 찾을 수 없습니다.'
  });
});

// ============================================
// 서버 시작
// ============================================
const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log('========================================');
  console.log(`DBI Lab Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('========================================');
});
