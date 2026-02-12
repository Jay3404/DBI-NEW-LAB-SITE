const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { requireAdmin } = require('../../middleware/adminAuth');
const keyManager = require('../../lib/keyManager');

// 설정 파일 경로
const SETTINGS_FILE = path.join(__dirname, '../../../.site-settings.json');

// 기본 설정값
const DEFAULT_SETTINGS = {
  email: {
    professorEmail: '',
    adminEmail: ''
  }
};

/**
 * 설정 파일 로드
 */
function loadSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      return { ...DEFAULT_SETTINGS, ...data };
    }
  } catch (err) {
    console.error('설정 파일 로드 실패:', err.message);
  }
  return DEFAULT_SETTINGS;
}

/**
 * 설정 파일 저장
 */
function saveSettings(settings) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

/**
 * GET /api/admin/settings
 * 현재 설정 조회
 */
router.get('/', requireAdmin, (req, res) => {
  try {
    const settings = loadSettings();
    const keyInfo = keyManager.getKeyInfo();

    // 환경변수에서 이메일 가져오기 (설정 파일이 비어있으면)
    if (!settings.email.professorEmail) {
      settings.email.professorEmail = process.env.PROFESSOR_EMAIL || '';
    }
    if (!settings.email.adminEmail) {
      settings.email.adminEmail = process.env.ADMIN_EMAIL || '';
    }

    res.json({
      success: true,
      data: {
        ...settings,
        keyInfo
      }
    });
  } catch (err) {
    console.error('설정 조회 오류:', err);
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '설정을 불러오는 중 오류가 발생했습니다.'
    });
  }
});

/**
 * PUT /api/admin/settings/email
 * 이메일 설정 수정
 */
router.put('/email', requireAdmin, (req, res) => {
  try {
    const { professorEmail, adminEmail } = req.body;

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (professorEmail && !emailRegex.test(professorEmail)) {
      return res.status(400).json({
        success: false,
        error: 'InvalidEmail',
        message: '교수님 이메일 형식이 올바르지 않습니다.'
      });
    }

    if (adminEmail && !emailRegex.test(adminEmail)) {
      return res.status(400).json({
        success: false,
        error: 'InvalidEmail',
        message: '관리자 이메일 형식이 올바르지 않습니다.'
      });
    }

    const settings = loadSettings();
    settings.email = {
      professorEmail: professorEmail || '',
      adminEmail: adminEmail || ''
    };
    settings.updatedAt = new Date().toISOString();

    saveSettings(settings);

    // 환경변수도 런타임에 업데이트 (서버 재시작 전까지 유효)
    if (professorEmail) process.env.PROFESSOR_EMAIL = professorEmail;
    if (adminEmail) process.env.ADMIN_EMAIL = adminEmail;

    res.json({
      success: true,
      message: '이메일 설정이 저장되었습니다.',
      data: settings.email
    });
  } catch (err) {
    console.error('이메일 설정 저장 오류:', err);
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '설정 저장 중 오류가 발생했습니다.'
    });
  }
});

/**
 * POST /api/admin/settings/test-email
 * 테스트 이메일 발송
 */
router.post('/test-email', requireAdmin, async (req, res) => {
  try {
    const emailService = require('../../lib/emailService');

    await emailService.sendSystemAlert('TEST', '이메일 설정 테스트입니다. 이 메일을 받으셨다면 설정이 정상입니다.');

    res.json({
      success: true,
      message: '테스트 이메일이 발송되었습니다.'
    });
  } catch (err) {
    console.error('테스트 이메일 발송 실패:', err);
    res.status(500).json({
      success: false,
      error: 'EmailFailed',
      message: '이메일 발송에 실패했습니다. SMTP 설정을 확인해주세요.'
    });
  }
});

module.exports = router;
