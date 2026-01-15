const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { requireAdmin } = require('../middleware/adminAuth');

/**
 * GET /api/projects
 */
router.get('/', async (req, res) => {
  try {
    const { status, active } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (active !== 'false') filter.isActive = true;

    const projects = await Project.find(filter)
      .populate('members', 'name role')
      .sort({ order: 1, startDate: -1 });

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (err) {
    console.error('Project 목록 조회 오류:', err);
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '프로젝트 목록을 불러오는 중 오류가 발생했습니다.'
    });
  }
});

/**
 * GET /api/projects/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'name role email');

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: '프로젝트를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '프로젝트를 불러오는 중 오류가 발생했습니다.'
    });
  }
});

/**
 * POST /api/projects
 */
router.post('/', requireAdmin, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();

    res.status(201).json({
      success: true,
      message: '프로젝트가 추가되었습니다.',
      data: project
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
      message: '프로젝트 추가 중 오류가 발생했습니다.'
    });
  }
});

/**
 * PUT /api/projects/:id
 */
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: '프로젝트를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '프로젝트가 수정되었습니다.',
      data: project
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
      message: '프로젝트 수정 중 오류가 발생했습니다.'
    });
  }
});

/**
 * DELETE /api/projects/:id
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: '프로젝트를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '프로젝트가 삭제되었습니다.'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: '프로젝트 삭제 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
