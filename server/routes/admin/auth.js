const express = require('express');
const router = express.Router();
const keyManager = require('../../lib/keyManager');
const { requireAdmin } = require('../../middleware/adminAuth');

/**
 * POST /api/admin/login
 * 패스워드 기반 로그인
 */
router.post('/login', async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      error: 'InvalidPassword',
      message: '패스워드를 입력해주세요.'
    });
  }

  const isValid = await keyManager.verifyPassword(password);

  if (!isValid) {
    return res.status(401).json({
      success: false,
      error: 'WrongPassword',
      message: '잘못된 패스워드입니다.'
    });
  }

  // 세션에 관리자 정보 저장
  req.session.isAdmin = true;
  req.session.loginAt = new Date().toISOString();

  res.json({
    success: true,
    message: '로그인 성공'
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

  res.json({
    success: true,
    isLoggedIn: true,
    loginAt: req.session.loginAt
  });
});

module.exports = router;
