const express = require('express');
const router = express.Router();
const Publication = require('../models/Publication');
const { requireAdmin } = require('../middleware/adminAuth');

/**
 * GET /api/publications
 * 논문 목록 조회 (필터 지원)
 */
router.get('/', async (req, res) => {
  try {
    const { year, yearLte, category, type, selected, isSelected, wip, active } = req.query;

    const filter = {};

    if (year) filter.year = parseInt(year);
    if (yearLte) filter.year = { $lte: parseInt(yearLte) };
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (selected === 'true' || isSelected === 'true') filter.isSelected = true;
    if (isSelected === 'false') filter.isSelected = { $ne: true };
    if (wip === 'true') filter.isWorkInProgress = true;
    if (active !== 'false') filter.isActive = true;

    const publications = await Publication.find(filter)
      .sort({ year: -1, order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: publications.length,
      data: publications
    });
  } catch (err) {
    console.error('Publication 목록 조회 오류:', err);
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '논문 목록을 불러오는 중 오류가 발생했습니다.'
    });
  }
});

/**
 * GET /api/publications/years
 * 연도별 그룹핑
 */
router.get('/years', async (req, res) => {
  try {
    const years = await Publication.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    res.json({
      success: true,
      data: years
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '연도 목록을 불러오는 중 오류가 발생했습니다.'
    });
  }
});

/**
 * GET /api/publications/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);

    if (!publication) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: '논문을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: publication
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '논문을 불러오는 중 오류가 발생했습니다.'
    });
  }
});

/**
 * POST /api/publications
 */
router.post('/', requireAdmin, async (req, res) => {
  try {
    const publication = new Publication(req.body);
    await publication.save();

    res.status(201).json({
      success: true,
      message: '논문이 추가되었습니다.',
      data: publication
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
      message: '논문 추가 중 오류가 발생했습니다.'
    });
  }
});

/**
 * PUT /api/publications/:id
 */
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const publication = await Publication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!publication) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: '논문을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '논문이 수정되었습니다.',
      data: publication
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
      message: '논문 수정 중 오류가 발생했습니다.'
    });
  }
});

/**
 * DELETE /api/publications/:id
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const publication = await Publication.findByIdAndDelete(req.params.id);

    if (!publication) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: '논문을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '논문이 삭제되었습니다.'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '논문 삭제 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
