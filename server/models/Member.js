const mongoose = require('mongoose');
const { Schema } = mongoose;

const MemberSchema = new Schema({
  name: {
    type: String,
    required: [true, '이름은 필수입니다.'],
    trim: true
  },

  nameKo: {
    type: String,
    trim: true
  },

  role: {
    type: String,
    enum: {
      values: ['Professor', 'Research Professor', 'PhD', 'MS', 'BS', 'Visiting', 'Alumni'],
      message: '유효하지 않은 역할입니다.'
    },
    required: [true, '역할은 필수입니다.']
  },

  // 직책 (e.g., "Assistant Professor (Tenure Track)", "Visiting Scholar")
  title: {
    type: String,
    trim: true
  },

  email: {
    type: String,
    trim: true,
    lowercase: true
  },

  image: {
    type: String,
    trim: true
  },

  // 연구 분야
  researchInterests: [{
    type: String,
    trim: true
  }],

  // 연구 키워드 (학생용, e.g., "Solutions for Digital Divide")
  researchKeyword: {
    type: String,
    trim: true
  },

  // 연구 초점 (학생용, e.g., "Intelligent Systems, AI Applications")
  researchFocus: {
    type: String,
    trim: true
  },

  // 소속 기관
  affiliation: {
    type: String,
    trim: true
  },

  // 보조 소속 (Researchers용, e.g., 다른 기관의 직책)
  secondaryTitle: {
    type: String,
    trim: true
  },

  secondaryAffiliation: {
    type: String,
    trim: true
  },

  // 개인 웹사이트
  website: {
    type: String,
    trim: true
  },

  // Google Scholar
  googleScholar: {
    type: String,
    trim: true
  },

  // LinkedIn
  linkedin: {
    type: String,
    trim: true
  },

  // GitHub
  github: {
    type: String,
    trim: true
  },

  // ORCID
  orcid: {
    type: String,
    trim: true
  },

  // 입학/합류 연도
  joinYear: {
    type: Number
  },

  // 졸업 연도 (Alumni인 경우)
  graduationYear: {
    type: Number
  },

  // 현재 소속 (Alumni인 경우)
  currentPosition: {
    type: String,
    trim: true
  },

  // Lab Manager 여부
  isLabManager: {
    type: Boolean,
    default: false
  },

  // Professor 상세 정보 (Professional Experience, Awards 등)
  professionalDetails: {
    type: String,
    trim: true
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
MemberSchema.index({ role: 1, order: 1 });
MemberSchema.index({ isActive: 1 });

module.exports = mongoose.model('Member', MemberSchema);
