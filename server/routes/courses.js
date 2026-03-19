const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { requireAdmin } = require('../middleware/adminAuth');
const upload = require('../lib/upload');

/**
 * GET /api/courses
 * 강의 목록 조회 (필터 지원)
 */
router.get('/', async (req, res) => {
  try {
    const { university, term, grad, active } = req.query;

    // 필터 조건 생성
    const filter = {};

    if (university && university !== 'All') {
      filter.university = university;
    }

    if (term && term !== 'All') {
      filter.term = term;
    }

    if (grad && grad !== 'All') {
      filter.grad = grad;
    }

    // 기본적으로 활성화된 강의만 조회
    if (active !== 'false') {
      filter.isActive = true;
    }

    const courses = await Course.find(filter)
      .sort({ university: 1, order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (err) {
    console.error('Course 목록 조회 오류:', err);
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '강의 목록을 불러오는 중 오류가 발생했습니다.'
    });
  }
});

/**
 * GET /api/courses/grouped
 * 대학별 그룹핑된 강의 목록
 */
router.get('/grouped', async (req, res) => {
  try {
    const { term, grad } = req.query;

    const filter = { isActive: true };

    if (term && term !== 'All') {
      filter.term = term;
    }

    if (grad && grad !== 'All') {
      filter.grad = grad;
    }

    const courses = await Course.find(filter)
      .sort({ order: 1, createdAt: -1 });

    // 대학별 그룹핑
    const grouped = courses.reduce((acc, course) => {
      const key = course.university;
      if (!acc[key]) acc[key] = [];
      acc[key].push(course);
      return acc;
    }, {});

    res.json({
      success: true,
      data: grouped
    });
  } catch (err) {
    console.error('Course 그룹 조회 오류:', err);
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '강의 목록을 불러오는 중 오류가 발생했습니다.'
    });
  }
});

/**
 * GET /api/courses/:id
 * 단일 강의 조회
 */
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: '강의를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (err) {
    console.error('Course 조회 오류:', err);
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '강의를 불러오는 중 오류가 발생했습니다.'
    });
  }
});

/**
 * POST /api/courses
 * 강의 추가 (관리자 전용)
 */
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, term, grad, year, university, link, image, order } = req.body;

    const course = new Course({
      name,
      term,
      grad,
      year,
      university,
      link: link || '',
      image,
      order: order || 0
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: '강의가 추가되었습니다.',
      data: course
    });
  } catch (err) {
    console.error('Course 추가 오류:', err);

    // Validation 에러 처리
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
      message: '강의 추가 중 오류가 발생했습니다.'
    });
  }
});

/**
 * PUT /api/courses/:id
 * 강의 수정 (관리자 전용)
 */
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { name, term, grad, year, university, link, image, order, isActive } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        name,
        term,
        grad,
        year,
        university,
        link,
        image,
        order,
        isActive
      },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: '강의를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '강의가 수정되었습니다.',
      data: course
    });
  } catch (err) {
    console.error('Course 수정 오류:', err);

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
      message: '강의 수정 중 오류가 발생했습니다.'
    });
  }
});

/**
 * DELETE /api/courses/:id
 * 강의 삭제 (관리자 전용)
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: '강의를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '강의가 삭제되었습니다.'
    });
  } catch (err) {
    console.error('Course 삭제 오류:', err);
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '강의 삭제 중 오류가 발생했습니다.'
    });
  }
});

/**
 * POST /api/courses/upload-image
 * 강의 이미지 업로드 (관리자 전용)
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
    console.error('이미지 업로드 오류:', err);
    res.status(500).json({
      success: false,
      error: 'UploadError',
      message: '이미지 업로드 중 오류가 발생했습니다.'
    });
  }
});

/**
 * PUT /api/courses/reorder
 * 강의 순서 변경 (관리자 전용)
 */
router.put('/reorder', requireAdmin, async (req, res) => {
  try {
    const { orders } = req.body; // [{ id: '...', order: 0 }, ...]

    if (!Array.isArray(orders)) {
      return res.status(400).json({
        success: false,
        error: 'InvalidData',
        message: 'orders 배열이 필요합니다.'
      });
    }

    const bulkOps = orders.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { order }
      }
    }));

    await Course.bulkWrite(bulkOps);

    res.json({
      success: true,
      message: '순서가 변경되었습니다.'
    });
  } catch (err) {
    console.error('Course 순서 변경 오류:', err);
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '순서 변경 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
