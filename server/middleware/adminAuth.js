const keyManager = require('../lib/keyManager');

/**
 * 관리자 세션 인증 미들웨어
 */
function requireAdmin(req, res, next) {
  // 세션 확인
  if (!req.session || !req.session.isAdmin) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: '관리자 로그인이 필요합니다.'
    });
  }

  // Key 버전 확인 (Key가 갱신되면 재로그인 필요)
  if (req.session.keyVersion !== keyManager.getKeyVersion()) {
    req.session.destroy();
    return res.status(401).json({
      success: false,
      error: 'SessionExpired',
      message: 'Key가 갱신되어 재로그인이 필요합니다.'
    });
  }

  next();
}

/**
 * 선택적 인증 (로그인 여부만 확인)
 */
function optionalAdmin(req, res, next) {
  req.isAdmin = !!(req.session && req.session.isAdmin);
  next();
}

module.exports = {
  requireAdmin,
  optionalAdmin
};
