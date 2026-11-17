"use client";

import { useState } from "react";

type Values = { name: string; email: string; phone: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

const initial: Values = { name: "", email: "", phone: "", message: "" };

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "이름을 입력해 주세요.";
  if (!v.email.trim()) e.email = "이메일을 입력해 주세요.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))
    e.email = "올바른 이메일 형식이 아닙니다.";
  if (!v.phone.trim()) e.phone = "전화번호를 입력해 주세요.";
  else if (!/^[0-9\-\s+()]{9,15}$/.test(v.phone))
    e.phone = "올바른 전화번호 형식이 아닙니다.";
  if (!v.message.trim()) e.message = "문의 내용을 입력해 주세요.";
  return e;
}

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-300 dark:focus:ring-zinc-300/10";

export default function ContactForm() {
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    // TODO: 백엔드 연동 시 여기서 values를 전송합니다.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-zinc-200 p-10 text-center dark:border-zinc-800"
      >
        <h3 className="text-xl font-semibold">문의가 접수되었습니다</h3>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          확인 후 빠르게 연락드리겠습니다.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(initial);
            setSubmitted(false);
          }}
          className="mt-6 text-sm font-medium underline underline-offset-4"
        >
          새 문의 작성
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <Field label="이름" name="name" error={errors.name}>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="홍길동"
          value={values.name}
          onChange={onChange}
          aria-invalid={!!errors.name}
          className={inputClass}
        />
      </Field>

      <Field label="이메일" name="email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="example@email.com"
          value={values.email}
          onChange={onChange}
          aria-invalid={!!errors.email}
          className={inputClass}
        />
      </Field>

      <Field label="전화번호" name="phone" error={errors.phone}>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="010-1234-5678"
          value={values.phone}
          onChange={onChange}
          aria-invalid={!!errors.phone}
          className={inputClass}
        />
      </Field>

      <Field label="문의내용" name="message" error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={6}
          placeholder="문의하실 내용을 자세히 적어 주세요."
          value={values.message}
          onChange={onChange}
          aria-invalid={!!errors.message}
          className={`${inputClass} resize-y`}
        />
      </Field>

      <button
        type="submit"
        className="h-12 rounded-full bg-indigo-600 px-6 text-base font-medium text-white transition-colors hover:bg-indigo-500"
      >
        문의하기
      </button>
    </form>
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
    <div className="flex flex-col gap-1.5">
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
