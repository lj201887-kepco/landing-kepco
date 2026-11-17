"use server";

import { db } from "@/db";
import { inquiries } from "../../drizzle/schema";
import {
  validateInquiry,
  type InquiryErrors,
  type InquiryValues,
} from "@/lib/inquiry";

export type SubmitResult =
  | { ok: true }
  | { ok: false; errors?: InquiryErrors; message?: string };

export async function submitInquiry(input: InquiryValues): Promise<SubmitResult> {
  // 클라이언트 검증은 우회될 수 있으므로 서버에서 다시 검증한다.
  const values: InquiryValues = {
    name: String(input?.name ?? ""),
    email: String(input?.email ?? ""),
    phone: String(input?.phone ?? ""),
    message: String(input?.message ?? ""),
  };

  const errors = validateInquiry(values);
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  try {
    await db.insert(inquiries).values({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      message: values.message.trim(),
    });
    return { ok: true };
  } catch (err) {
    console.error("문의 저장 실패:", err);
    return {
      ok: false,
      message: "문의 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }
}
