const express = require('express');
const router = express.Router();
const News = require('../models/News');
const { requireAdmin } = require('../middleware/adminAuth');

/**
 * GET /api/news
 */
router.get('/', async (req, res) => {
  try {
    const { limit, urgent, active } = req.query;

    const filter = {};

    if (urgent === 'true') filter.isUrgent = true;
    if (active !== 'false') filter.isActive = true;

    let query = News.find(filter).sort({ date: -1, order: 1 });

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const news = await query;

    res.json({
      success: true,
      count: news.length,
      data: news
    });
  } catch (err) {
    console.error('News 목록 조회 오류:', err);
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '뉴스 목록을 불러오는 중 오류가 발생했습니다.'
    });
  }
});

/**
 * GET /api/news/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: '뉴스를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: news
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '뉴스를 불러오는 중 오류가 발생했습니다.'
    });
  }
});

/**
 * POST /api/news
 */
router.post('/', requireAdmin, async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();

    res.status(201).json({
      success: true,
      message: '뉴스가 추가되었습니다.',
      data: news
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
      message: '뉴스 추가 중 오류가 발생했습니다.'
    });
  }
});

/**
 * PUT /api/news/:id
 */
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: '뉴스를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '뉴스가 수정되었습니다.',
      data: news
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
      message: '뉴스 수정 중 오류가 발생했습니다.'
    });
  }
});

/**
 * DELETE /api/news/:id
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: '뉴스를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '뉴스가 삭제되었습니다.'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '뉴스 삭제 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
