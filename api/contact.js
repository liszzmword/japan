const RESEND_API = 'https://api.resend.com/emails';
const TO_EMAIL = 'liszzmword@gmail.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ ok: false, message: 'RESEND_API_KEY가 설정되지 않았어요.' });
  }

  try {
    const { name, birthDate, phone, email } = req.body || {};
    if (!name || !email) {
      return res.status(400).json({ ok: false, message: '이름과 이메일은 필수예요.' });
    }

    const html = `
      <p><strong>일본어 퀴즈 사이트 - 일본인 친구 만남 문의</strong></p>
      <p>이름: ${escapeHtml(name)}</p>
      <p>생년월일: ${escapeHtml(birthDate || '-')}</p>
      <p>전화번호: ${escapeHtml(phone || '-')}</p>
      <p>이메일: ${escapeHtml(email)}</p>
    `;

    const response = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: [TO_EMAIL],
        subject: '[일본어 퀴즈] 일본인 친구 만남 문의 - ' + (name || '이름 없음'),
        html
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        message: data.message || '이메일 전송에 실패했어요.'
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return res.status(500).json({ ok: false, message: '서버 오류가 발생했어요.' });
  }
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
