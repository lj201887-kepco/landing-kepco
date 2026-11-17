import { Resend } from "resend";
import type { InquiryValues } from "@/lib/inquiry";

// 새 문의가 접수되면 관리자에게 알림 메일을 보낸다.
// 설정이 없거나 발송에 실패해도 예외를 던지지 않는다(문의 접수에 영향을 주면 안 됨).
// 도메인 인증 전에는 Resend 가입 이메일로만 발송할 수 있다 (ADMIN_NOTIFY_EMAIL = 가입 이메일).
export async function notifyNewInquiry(v: InquiryValues): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_NOTIFY_EMAIL;
  if (!apiKey || !to) {
    console.warn("알림 메일 건너뜀: RESEND_API_KEY / ADMIN_NOTIFY_EMAIL 미설정");
    return;
  }

  const from = process.env.NOTIFY_FROM ?? "문의 알림 <onboarding@resend.dev>";
  const siteUrl = process.env.SITE_URL?.replace(/\/$/, "");
  // 텍스트 메일이라 사용자 입력이 HTML로 해석되지 않는다. 제목의 개행만 제거.
  const subjectName = v.name.replace(/[\r\n]+/g, " ").slice(0, 50);

  const text = [
    "새 문의가 접수되었습니다.",
    "",
    `이름: ${v.name}`,
    `이메일: ${v.email}`,
    `전화번호: ${v.phone}`,
    "",
    "문의 내용:",
    v.message,
    ...(siteUrl ? ["", `관리자 페이지: ${siteUrl}/admin`] : []),
  ].join("\n");

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to,
      replyTo: v.email,
      subject: `[새 문의] ${subjectName}`,
      text,
    });
    if (error) console.error("알림 메일 발송 실패:", error);
  } catch (err) {
    console.error("알림 메일 발송 실패:", err);
  }
}
