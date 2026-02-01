# 日本語 퀴즈

일본어 단어 퀴즈 웹사이트 (뜻 입력 · 4개 중 고르기)

- **배포**: [japan-ruby.vercel.app](https://japan-ruby.vercel.app)
- **GitHub**: https://github.com/liszzmword/japan

## 연락 폼 (Resend)

「일본인 친구를 만나고 싶다면 연락주세요」 클릭 시 이름/생년월일/전화번호/이메일을 입력해 전송하면 **liszzmword@gmail.com**으로 이메일이 전송됩니다.

- **Resend** 사용: [resend.com](https://resend.com)에서 API 키 발급 후, Vercel 프로젝트 **Settings → Environment Variables**에 `RESEND_API_KEY`를 추가하세요.
- 발신 주소는 Resend 기본 `onboarding@resend.dev`를 사용합니다.

## 로컬에서 업데이트 후 GitHub에 반영

```bash
git add -A
git commit -m "업데이트"
git push origin main
```

또는 `./push.sh` 실행 (스크립트가 커밋 메시지를 물어봄).
