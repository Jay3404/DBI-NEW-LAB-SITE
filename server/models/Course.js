const mongoose = require('mongoose');
const { Schema } = mongoose;

const CourseSchema = new Schema({
  name: {
    type: String,
    required: [true, '강의명은 필수입니다.'],
    trim: true,
    maxlength: [200, '강의명은 200자 이내여야 합니다.']
  },

  term: {
    type: String,
    enum: {
      values: ['Spring', 'Fall'],
      message: 'term은 Spring 또는 Fall이어야 합니다.'
    },
    required: [true, 'term은 필수입니다.']
  },

  grad: {
    type: String,
    enum: {
      values: ['Undergraduate', 'Graduate'],
      message: 'grad는 Undergraduate 또는 Graduate이어야 합니다.'
    },
    required: [true, 'grad는 필수입니다.']
  },

  year: {
    type: String,
    required: [true, 'year는 필수입니다.'],
    trim: true,
    // 예: "2024", "2024, 2025", "2024-2026"
  },

  university: {
    type: String,
    enum: {
      values: ['Hanyang', 'SNU'],
      message: 'university는 Hanyang 또는 SNU이어야 합니다.'
    },
    required: [true, 'university는 필수입니다.']
  },

  link: {
    type: String,
    trim: true,
    default: ''
  },

  image: {
    type: String,
    required: [true, '강의 이미지는 필수입니다.']
  },

  // 정렬용 (낮을수록 먼저 표시)
  order: {
    type: Number,
    default: 0
  },

  // 활성화 여부
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // createdAt, updatedAt 자동 생성
});

// 인덱스
CourseSchema.index({ university: 1, term: 1, grad: 1 });
CourseSchema.index({ order: 1 });

// 가상 필드: 연도 배열
CourseSchema.virtual('yearArray').get(function() {
  if (!this.year) return [];
  return this.year.split(/[,\s-]+/).map(y => y.trim()).filter(Boolean);
});

// JSON 변환 시 가상 필드 포함
CourseSchema.set('toJSON', { virtuals: true });
CourseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', CourseSchema);
