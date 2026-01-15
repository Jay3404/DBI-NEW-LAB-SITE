const mongoose = require('mongoose');
const { Schema } = mongoose;

const NewsSchema = new Schema({
  title: {
    type: String,
    required: [true, '제목은 필수입니다.'],
    trim: true,
    maxlength: [300, '제목은 300자 이내여야 합니다.']
  },

  date: {
    type: Date,
    required: [true, '날짜는 필수입니다.'],
    default: Date.now
  },

  link: {
    type: String,
    trim: true
  },

  // 상세 내용 (선택)
  content: {
    type: String,
    trim: true
  },

  // 긴급 공지 여부
  isUrgent: {
    type: Boolean,
    default: false
  },

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
NewsSchema.index({ date: -1 });
NewsSchema.index({ isUrgent: 1 });
NewsSchema.index({ isActive: 1 });

module.exports = mongoose.model('News', NewsSchema);
