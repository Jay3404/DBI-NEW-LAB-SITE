const bcrypt = require('bcrypt');

// 해시된 패스워드 캐시
let passwordHash = null;

/**
 * 초기화 - 환경변수에서 패스워드 로드 후 해시
 */
async function initialize() {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('ADMIN_PASSWORD 환경변수가 설정되지 않았습니다.');
    console.error('.env 파일에 ADMIN_PASSWORD를 설정해주세요.');
    process.exit(1);
  }

  passwordHash = await bcrypt.hash(adminPassword, 10);
  console.log('Admin 패스워드 초기화 완료');
}

/**
 * 패스워드 검증
 */
async function verifyPassword(inputPassword) {
  if (!passwordHash || !inputPassword) return false;
  return bcrypt.compare(inputPassword, passwordHash);
}

module.exports = {
  initialize,
  verifyPassword
};
