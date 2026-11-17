"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { inquiries } from "../../../drizzle/schema";
import { assertAdmin } from "@/lib/admin";
import {
  isInquiryStatus,
  validateInquiry,
  type InquiryErrors,
  type InquiryStatus,
  type InquiryValues,
} from "@/lib/inquiry";

export type AdminResult =
  | { ok: true }
  | { ok: false; errors?: InquiryErrors; message?: string };

const FAIL = "처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";

function validId(id: unknown): id is number {
  return typeof id === "number" && Number.isInteger(id) && id > 0;
}

export async function updateInquiry(
  id: number,
  input: InquiryValues & { status: InquiryStatus },
): Promise<AdminResult> {
  await assertAdmin();
  if (!validId(id)) return { ok: false, message: "잘못된 요청입니다." };

  const values: InquiryValues = {
    name: String(input?.name ?? ""),
    email: String(input?.email ?? ""),
    phone: String(input?.phone ?? ""),
    message: String(input?.message ?? ""),
  };
  const errors = validateInquiry(values);
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  if (!isInquiryStatus(input?.status))
    return { ok: false, message: "잘못된 상태 값입니다." };

  try {
    const rows = await db
      .update(inquiries)
      .set({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        message: values.message.trim(),
        status: input.status,
      })
      .where(eq(inquiries.id, id))
      .returning({ id: inquiries.id });
    if (rows.length === 0)
      return { ok: false, message: "이미 삭제된 문의입니다." };
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    console.error("문의 수정 실패:", err);
    return { ok: false, message: FAIL };
  }
}

export async function updateInquiryStatus(
  id: number,
  status: InquiryStatus,
): Promise<AdminResult> {
  await assertAdmin();
  if (!validId(id) || !isInquiryStatus(status))
    return { ok: false, message: "잘못된 요청입니다." };

  try {
    await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    console.error("상태 변경 실패:", err);
    return { ok: false, message: FAIL };
  }
}

export async function deleteInquiry(id: number): Promise<AdminResult> {
  await assertAdmin();
  if (!validId(id)) return { ok: false, message: "잘못된 요청입니다." };

  try {
    await db.delete(inquiries).where(eq(inquiries.id, id));
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    console.error("문의 삭제 실패:", err);
    return { ok: false, message: FAIL };
  }
}
