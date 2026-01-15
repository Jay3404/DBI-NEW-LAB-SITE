const nodemailer = require('nodemailer');

// 트랜스포터 (SMTP 설정)
let transporter = null;

/**
 * 이메일 서비스 초기화
 */
function initialize() {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  console.log('Email service initialized');
}

/**
 * Key 갱신 이메일 발송
 */
async function sendKeyRotationEmail(newKey, expiresAt) {
  const recipients = [
    process.env.PROFESSOR_EMAIL,
    process.env.ADMIN_EMAIL
  ].filter(Boolean);

  if (recipients.length === 0) {
    console.warn('이메일 수신자가 설정되지 않았습니다.');
    return;
  }

  const expiresDate = new Date(expiresAt);
  const formattedExpires = expiresDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const mailOptions = {
    from: `"DBI Lab System" <${process.env.SMTP_USER}>`,
    to: recipients.join(', '),
    subject: '[DBI Lab] 관리자 접속 Key가 갱신되었습니다',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1890ff; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px; }
    .key-box { background: white; padding: 20px; margin: 20px 0; text-align: center;
               font-family: monospace; font-size: 28px; font-weight: bold;
               border-radius: 8px; border: 2px dashed #1890ff; letter-spacing: 2px; }
    .info { color: #666; font-size: 14px; margin-top: 20px; }
    .button { display: inline-block; background: #1890ff; color: white !important;
              padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>DBI Lab</h1>
      <p>관리자 페이지 접속 Key 갱신 안내</p>
    </div>
    <div class="content">
      <p>안녕하세요,</p>
      <p>DBI Lab 웹사이트 관리자 페이지의 새로운 접속 Key가 생성되었습니다.</p>

      <div class="key-box">${newKey}</div>

      <p class="info">
        <strong>유효 기간:</strong> ${formattedExpires}까지<br>
        <strong>접속 주소:</strong> <a href="https://dbi-lab.hanyang.ac.kr/admin">https://dbi-lab.hanyang.ac.kr/admin</a>
      </p>

      <center>
        <a href="https://dbi-lab.hanyang.ac.kr/admin" class="button">관리자 페이지 접속</a>
      </center>

      <div class="footer">
        <p>이 메일은 자동 발송되었습니다.<br>
        문의사항은 연구실로 연락해 주세요.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `
  };

  return await transporter.sendMail(mailOptions);
}

/**
 * 시스템 알림 이메일 발송 (장애, 백업 실패 등)
 */
async function sendSystemAlert(type, content) {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.warn('관리자 이메일이 설정되지 않았습니다.');
    return;
  }

  const subjects = {
    BACKUP_FAILED: '백업 실패 알림',
    SYSTEM_ERROR: '시스템 오류 알림',
    DISK_WARNING: '디스크 용량 경고'
  };

  const mailOptions = {
    from: `"DBI Lab System" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `[DBI Lab] ${subjects[type] || type}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .alert { background: #fff2f0; border: 1px solid #ffccc7; padding: 20px; border-radius: 8px; }
    .alert h2 { color: #cf1322; margin-top: 0; }
    .content { background: #fafafa; padding: 15px; border-radius: 4px; margin-top: 15px; }
    .footer { color: #999; font-size: 12px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="alert">
      <h2>${subjects[type] || type}</h2>
      <p>시간: ${new Date().toLocaleString('ko-KR')}</p>
      <div class="content">
        <pre>${typeof content === 'string' ? content : JSON.stringify(content, null, 2)}</pre>
      </div>
    </div>
    <p class="footer">DBI Lab 자동 알림 시스템</p>
  </div>
</body>
</html>
    `
  };

  return await transporter.sendMail(mailOptions);
}

module.exports = {
  initialize,
  sendKeyRotationEmail,
  sendSystemAlert
};
