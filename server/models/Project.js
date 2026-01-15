const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProjectSchema = new Schema({
  title: {
    type: String,
    required: [true, '프로젝트 제목은 필수입니다.'],
    trim: true,
    maxlength: [300, '제목은 300자 이내여야 합니다.']
  },

  // 프로젝트 기간
  startDate: {
    type: Date
  },

  endDate: {
    type: Date
  },

  // 기간 문자열 (예: "2024-2026")
  period: {
    type: String,
    trim: true
  },

  // 후원 기관
  sponsor: {
    type: String,
    trim: true
  },

  // 프로젝트 설명
  description: {
    type: String,
    trim: true
  },

  // 관련 링크
  link: {
    type: String,
    trim: true
  },

  // 프로젝트 상태
  status: {
    type: String,
    enum: {
      values: ['Ongoing', 'Completed', 'Work In Progress'],
      message: '상태는 Ongoing, Completed, Work In Progress 중 하나여야 합니다.'
    },
    default: 'Ongoing'
  },

  // 참여 멤버 (Member ObjectId 참조)
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'Member'
  }],

  // 정렬 순서
  order: {
    type: Number,
    default: 0
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// 인덱스
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ startDate: -1 });
ProjectSchema.index({ isActive: 1 });

module.exports = mongoose.model('Project', ProjectSchema);
