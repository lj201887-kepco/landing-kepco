"use client";

import { useEffect, useRef, useState } from "react";
import { updateInquiry } from "@/app/admin/actions";
import {
  INQUIRY_STATUSES,
  STATUS_LABELS,
  validateInquiry,
  type InquiryErrors,
  type InquiryStatus,
  type InquiryValues,
} from "@/lib/inquiry";
import type { AdminInquiry } from "./InquiryTable";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-300";

export default function EditInquiryModal({
  inquiry,
  onClose,
}: {
  inquiry: AdminInquiry;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [values, setValues] = useState<InquiryValues>({
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    message: inquiry.message,
  });
  const [status, setStatus] = useState<InquiryStatus>(inquiry.status);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setValues((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setFormError("");
    const found = validateInquiry(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setPending(true);
    try {
      const r = await updateInquiry(inquiry.id, { ...values, status });
      if (r.ok) {
        onClose();
        return;
      }
      if (r.errors) setErrors(r.errors);
      setFormError(r.message ?? "");
    } catch {
      setFormError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setPending(false);
    }
  }

  return (
    <dialog
      ref={ref}
      // 저장 중에는 ESC/바깥 클릭으로 닫히지 않게 한다.
      onCancel={(e) => (pending ? e.preventDefault() : onClose())}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current && !pending) ref.current?.close();
      }}
      className="m-auto w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-0 text-zinc-900 backdrop:bg-black/50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 p-6">
        <h2 className="text-lg font-semibold">문의 수정</h2>

        <Field label="이름" name="name" error={errors.name}>
          <input id="name" name="name" value={values.name} onChange={onChange} className={inputClass} />
        </Field>
        <Field label="이메일" name="email" error={errors.email}>
          <input id="email" name="email" type="email" value={values.email} onChange={onChange} className={inputClass} />
        </Field>
        <Field label="전화번호" name="phone" error={errors.phone}>
          <input id="phone" name="phone" type="tel" value={values.phone} onChange={onChange} className={inputClass} />
        </Field>
        <Field label="문의내용" name="message" error={errors.message}>
          <textarea id="message" name="message" rows={5} value={values.message} onChange={onChange} className={`${inputClass} resize-y`} />
        </Field>
        <Field label="처리 상태" name="status">
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as InquiryStatus)}
            className={inputClass}
          >
            {INQUIRY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </Field>

        {formError && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {formError}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => ref.current?.close()}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {pending ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
