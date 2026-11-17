export type InquiryValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type InquiryErrors = Partial<Record<keyof InquiryValues, string>>;

export const initialValues: InquiryValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

// DB 컬럼 길이와 맞춘 상한 (drizzle/schema.ts)
const MAX = { name: 100, email: 255, phone: 30, message: 5000 };

export function validateInquiry(v: InquiryValues): InquiryErrors {
  const e: InquiryErrors = {};

  if (!v.name.trim()) e.name = "이름을 입력해 주세요.";
  else if (v.name.trim().length > MAX.name)
    e.name = `이름은 ${MAX.name}자 이하로 입력해 주세요.`;

  if (!v.email.trim()) e.email = "이메일을 입력해 주세요.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
    e.email = "올바른 이메일 형식이 아닙니다.";
  else if (v.email.trim().length > MAX.email)
    e.email = `이메일은 ${MAX.email}자 이하로 입력해 주세요.`;

  if (!v.phone.trim()) e.phone = "전화번호를 입력해 주세요.";
  else if (!/^[0-9\-\s+()]{9,15}$/.test(v.phone.trim()))
    e.phone = "올바른 전화번호 형식이 아닙니다.";

  if (!v.message.trim()) e.message = "문의 내용을 입력해 주세요.";
  else if (v.message.trim().length > MAX.message)
    e.message = `문의 내용은 ${MAX.message}자 이하로 입력해 주세요.`;

  return e;
}
