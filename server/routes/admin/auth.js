const express = require('express');
const router = express.Router();
const keyManager = require('../../lib/keyManager');
const { requireAdmin } = require('../../middleware/adminAuth');

/**
 * POST /api/admin/login
 * Key 기반 로그인
 */
router.post('/login', (req, res) => {
  const { key } = req.body;

  // Key 검증
  if (!key || key.length < 10) {
    return res.status(400).json({
      success: false,
      error: 'InvalidKey',
      message: 'Key는 10자 이상이어야 합니다.'
    });
  }

  if (!keyManager.verifyKey(key)) {
    return res.status(401).json({
      success: false,
      error: 'WrongKey',
      message: '잘못된 Key입니다.'
    });
  }

  // 세션에 관리자 정보 저장
  req.session.isAdmin = true;
  req.session.keyVersion = keyManager.getKeyVersion();
  req.session.loginAt = new Date().toISOString();

  res.json({
    success: true,
    message: '로그인 성공',
    keyInfo: keyManager.getKeyInfo()
  });
});

/**
 * POST /api/admin/logout
 * 로그아웃
 */
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'LogoutFailed',
        message: '로그아웃 처리 중 오류가 발생했습니다.'
      });
    }

    res.json({
      success: true,
      message: '로그아웃 되었습니다.'
    });
  });
});

/**
 * GET /api/admin/session
 * 현재 세션 상태 확인
 */
router.get('/session', (req, res) => {
  if (!req.session || !req.session.isAdmin) {
    return res.json({
      success: true,
      isLoggedIn: false
    });
  }

  // Key 버전 확인
  if (req.session.keyVersion !== keyManager.getKeyVersion()) {
    req.session.destroy();
    return res.json({
      success: true,
      isLoggedIn: false,
      reason: 'key_rotated'
    });
  }

  res.json({
    success: true,
    isLoggedIn: true,
    loginAt: req.session.loginAt,
    keyInfo: keyManager.getKeyInfo()
  });
});

/**
 * POST /api/admin/rotate-key
 * 수동 Key 갱신 (긴급용, 관리자 전용)
 */
router.post('/rotate-key', requireAdmin, async (req, res) => {
  try {
    const newKey = await keyManager.forceRotate();

    // 현재 세션도 무효화
    req.session.destroy();

    res.json({
      success: true,
      message: 'Key가 갱신되었습니다. 이메일을 확인해주세요.',
      // 보안상 새 Key는 응답에 포함하지 않음
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'RotateFailed',
      message: 'Key 갱신 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
