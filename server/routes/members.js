const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const { requireAdmin } = require('../middleware/adminAuth');
const upload = require('../lib/upload');

/**
 * GET /api/members
 */
router.get('/', async (req, res) => {
  try {
    const { role, active } = req.query;

    const filter = {};

    if (role) filter.role = role;
    if (active !== 'false') filter.isActive = true;

    const members = await Member.find(filter)
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (err) {
    console.error('Member 목록 조회 오류:', err);
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '멤버 목록을 불러오는 중 오류가 발생했습니다.'
    });
  }
});

/**
 * GET /api/members/grouped
 * 역할별 그룹핑
 */
router.get('/grouped', async (req, res) => {
  try {
    const members = await Member.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });

    const roleOrder = ['Professor', 'Research Professor', 'PhD', 'MS', 'BS', 'Visiting', 'Alumni'];

    const grouped = {};
    roleOrder.forEach(role => {
      const roleMembers = members.filter(m => m.role === role);
      if (roleMembers.length > 0) {
        grouped[role] = roleMembers;
      }
    });

    res.json({
      success: true,
      data: grouped
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '멤버 목록을 불러오는 중 오류가 발생했습니다.'
    });
  }
});

/**
 * GET /api/members/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: '멤버를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: member
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '멤버를 불러오는 중 오류가 발생했습니다.'
    });
  }
});

/**
 * POST /api/members
 */
router.post('/', requireAdmin, async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();

    res.status(201).json({
      success: true,
      message: '멤버가 추가되었습니다.',
      data: member
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '멤버 추가 중 오류가 발생했습니다.'
    });
  }
});

/**
 * PUT /api/members/:id
 */
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: '멤버를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '멤버가 수정되었습니다.',
      data: member
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '멤버 수정 중 오류가 발생했습니다.'
    });
  }
});

/**
 * DELETE /api/members/:id
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: '멤버를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '멤버가 삭제되었습니다.'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '멤버 삭제 중 오류가 발생했습니다.'
    });
  }
});

/**
 * POST /api/members/upload-image
 */
router.post('/upload-image', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'NoFile',
        message: '이미지 파일이 필요합니다.'
      });
    }

    res.json({
      success: true,
      message: '이미지가 업로드되었습니다.',
      url: `/uploads/courses/${req.file.filename}`
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'UploadError',
      message: '이미지 업로드 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
