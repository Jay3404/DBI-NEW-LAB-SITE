const crypto = require('crypto');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const emailService = require('./emailService');

// Key 저장 파일 경로
const KEY_FILE = path.join(__dirname, '../../.admin-key');

// 현재 Key를 메모리에 캐시
let currentKey = null;
let keyVersion = 0;

/**
 * 10자 이상 랜덤 Key 생성 (영문+숫자)
 */
function generateSecureKey() {
  // 12자리 base64url 문자열 생성
  return crypto.randomBytes(9).toString('base64url');
}

/**
 * 파일에서 Key 로드
 */
function loadKeyFromFile() {
  try {
    if (fs.existsSync(KEY_FILE)) {
      const data = JSON.parse(fs.readFileSync(KEY_FILE, 'utf-8'));
      currentKey = data.key;
      keyVersion = data.version || 0;
      return true;
    }
  } catch (err) {
    console.error('Key 파일 로드 실패:', err.message);
  }
  return false;
}

/**
 * 파일에 Key 저장
 */
function saveKeyToFile(key) {
  keyVersion++;
  const data = {
    key,
    version: keyVersion,
    createdAt: new Date().toISOString(),
    expiresAt: getNextRotationDate().toISOString()
  };
  fs.writeFileSync(KEY_FILE, JSON.stringify(data, null, 2));
  currentKey = key;
}

/**
 * 다음 갱신일 계산 (1월, 4월, 7월, 10월 1일)
 */
function getNextRotationDate() {
  const now = new Date();
  const year = now.getFullYear();

  const quarters = [
    new Date(year, 0, 1),     // 1월 1일
    new Date(year, 3, 1),     // 4월 1일
    new Date(year, 6, 1),     // 7월 1일
    new Date(year, 9, 1),     // 10월 1일
    new Date(year + 1, 0, 1)  // 다음해 1월 1일
  ];

  return quarters.find(d => d > now) || quarters[4];
}

/**
 * 현재 분기 문자열 반환
 */
function getCurrentQuarter() {
  const month = new Date().getMonth();
  if (month < 3) return 'Q1';
  if (month < 6) return 'Q2';
  if (month < 9) return 'Q3';
  return 'Q4';
}

/**
 * Key 갱신 + 이메일 발송
 */
async function rotateAdminKey() {
  console.log(`[${new Date().toISOString()}] Admin key rotation started...`);

  const newKey = generateSecureKey();
  saveKeyToFile(newKey);

  // 이메일 발송
  try {
    await emailService.sendKeyRotationEmail(newKey, getNextRotationDate());
    console.log(`[${new Date().toISOString()}] Admin key rotated and email sent`);
  } catch (err) {
    console.error('Key 갱신 이메일 발송 실패:', err.message);
  }

  return newKey;
}

/**
 * Key 검증
 */
function verifyKey(inputKey) {
  return inputKey && inputKey === currentKey;
}

/**
 * 현재 Key 정보 반환 (관리자용)
 */
function getKeyInfo() {
  return {
    version: keyVersion,
    expiresAt: getNextRotationDate().toISOString(),
    quarter: getCurrentQuarter()
  };
}

/**
 * 초기화
 */
function initialize() {
  // 파일에서 Key 로드, 없으면 새로 생성
  if (!loadKeyFromFile()) {
    console.log('기존 Key 없음, 새 Key 생성...');
    const newKey = generateSecureKey();
    saveKeyToFile(newKey);
    console.log('새 Admin Key 생성됨 (콘솔에서 확인하세요):', newKey);
  } else {
    console.log('기존 Admin Key 로드됨');
  }

  // 분기별 갱신 스케줄 (1월, 4월, 7월, 10월 1일 오전 9시)
  cron.schedule('0 9 1 1,4,7,10 *', async () => {
    await rotateAdminKey();
  });

  console.log('Key 자동 갱신 스케줄 등록됨 (1/4/7/10월 1일 09:00)');
}

/**
 * 수동 Key 갱신 (테스트/긴급용)
 */
async function forceRotate() {
  return await rotateAdminKey();
}

module.exports = {
  initialize,
  verifyKey,
  getKeyInfo,
  getKeyVersion: () => keyVersion,
  forceRotate,
  generateSecureKey
};
