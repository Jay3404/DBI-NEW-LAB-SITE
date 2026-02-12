const mongoose = require('mongoose');
const { Schema } = mongoose;

const PublicationSchema = new Schema({
  title: {
    type: String,
    required: [true, '논문 제목은 필수입니다.'],
    trim: true,
    maxlength: [500, '제목은 500자 이내여야 합니다.']
  },

  authors: [{
    type: String,
    trim: true
  }],

  year: {
    type: Number,
    required: [true, '출판 연도는 필수입니다.'],
    min: [1990, '연도는 1990년 이후여야 합니다.'],
    max: [new Date().getFullYear() + 1, '연도가 올바르지 않습니다.']
  },

  type: {
    type: String,
    enum: {
      values: ['Journal', 'Conference', 'Patent', 'Book', 'Thesis'],
      message: 'type은 Journal, Conference, Patent, Book, Thesis 중 하나여야 합니다.'
    },
    default: 'Journal'
  },

  journal: {
    type: String,
    trim: true
  },

  volume: {
    type: String,
    trim: true
  },

  category: {
    type: String,
    enum: {
      values: ['SCI', 'SSCI', 'SCI/SSCI', 'KCI', 'Scopus', 'KR Patent', 'US Patent', 'Other'],
      message: '유효하지 않은 카테고리입니다.'
    },
    default: 'Other'
  },

  link: {
    type: String,
    trim: true
  },

  abstract: {
    type: String,
    trim: true
  },

  // 선택 논문 여부 (메인 페이지에 표시)
  isSelected: {
    type: Boolean,
    default: false
  },

  // 진행 중 논문 여부
  isWorkInProgress: {
    type: Boolean,
    default: false
  },

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
PublicationSchema.index({ year: -1 });
PublicationSchema.index({ category: 1 });
PublicationSchema.index({ isSelected: 1 });
PublicationSchema.index({ isWorkInProgress: 1 });

module.exports = mongoose.model('Publication', PublicationSchema);
