const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/adminAuth');

/**
 * GET /api/admin/settings
 * 현재 설정 조회
 */
router.get('/', requireAdmin, (req, res) => {
  res.json({
    success: true,
    data: {}
  });
});

module.exports = router;
