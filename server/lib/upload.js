const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 업로드 디렉토리 생성 함수
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 기본 업로드 디렉토리들 생성
const uploadsBase = process.env.UPLOAD_ROOT || '/var/www/uploads';
const coursesDir = path.join(uploadsBase, 'courses');
const membersDir = path.join(uploadsBase, 'members');

ensureDir(coursesDir);
ensureDir(membersDir);

// 파일 저장 설정 (동적 경로)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // URL 경로에 따라 저장 폴더 결정
    let uploadDir = coursesDir; // 기본값

    if (req.baseUrl.includes('/members') || req.originalUrl.includes('/members')) {
      uploadDir = membersDir;
    } else if (req.baseUrl.includes('/courses') || req.originalUrl.includes('/courses')) {
      uploadDir = coursesDir;
    }

    ensureDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 파일명: prefix_타임스탬프_랜덤.확장자
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const mimeToExt = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif'
    };
    const ext = mimeToExt[file.mimetype] || path.extname(file.originalname).toLowerCase() || '.bin';

    // URL에 따라 prefix 결정
    let prefix = 'file';
    if (req.baseUrl.includes('/members') || req.originalUrl.includes('/members')) {
      prefix = 'member';
    } else if (req.baseUrl.includes('/courses') || req.originalUrl.includes('/courses')) {
      prefix = 'course';
    }

    cb(null, `${prefix}_${timestamp}_${random}${ext}`);
  }
});

// 파일 필터 (이미지만 허용)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('지원하지 않는 파일 형식입니다. (JPG, PNG, WebP, GIF만 허용)'), false);
  }
};

// Multer 인스턴스
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

module.exports = upload;
