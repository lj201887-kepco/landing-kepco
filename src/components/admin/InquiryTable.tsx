"use client";

import { Fragment, useState, useTransition } from "react";
import {
  deleteInquiry,
  updateInquiryStatus,
} from "@/app/admin/actions";
import {
  INQUIRY_STATUSES,
  STATUS_LABELS,
  type InquiryStatus,
} from "@/lib/inquiry";
import EditInquiryModal from "./EditInquiryModal";

export type AdminInquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
};

const badge: Record<InquiryStatus, string> = {
  new: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  in_progress:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function InquiryTable({ rows }: { rows: AdminInquiry[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [editing, setEditing] = useState<AdminInquiry | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function run(fn: () => Promise<{ ok: boolean; message?: string }>) {
    setError("");
    startTransition(async () => {
      try {
        const r = await fn();
        if (!r.ok) setError(r.message ?? "처리에 실패했습니다.");
      } catch {
        setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }
    });
  }

  function onDelete(r: AdminInquiry) {
    if (
      !window.confirm(
        `${r.name}님의 문의를 삭제할까요?\n삭제하면 복구할 수 없습니다.`,
      )
    )
      return;
    run(() => deleteInquiry(r.id));
  }

  if (rows.length === 0) {
    return (
      <p className="mt-10 text-center text-zinc-500">조회된 문의가 없습니다.</p>
    );
  }

  const btn =
    "rounded-md border border-zinc-300 px-2.5 py-1 text-xs hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800";

  return (
    <>
      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-zinc-50 text-xs text-zinc-500 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-3">접수일</th>
              <th className="px-4 py-3">이름</th>
              <th className="px-4 py-3">연락처</th>
              <th className="px-4 py-3">문의 내용</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3 text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const open = expanded === r.id;
              return (
                <Fragment key={r.id}>
                  <tr className="border-t border-zinc-200 align-top dark:border-zinc-800">
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-500">
                      {fmt(r.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-medium">{r.name}</td>
                    <td className="px-4 py-3">
                      <div>{r.email}</div>
                      <div className="text-zinc-500">{r.phone}</div>
                    </td>
                    <td className="max-w-xs px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setExpanded(open ? null : r.id)}
                        aria-expanded={open}
                        className="block w-full truncate text-left hover:underline"
                      >
                        {r.message}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={r.status}
                        disabled={pending}
                        aria-label="처리 상태"
                        onChange={(e) =>
                          run(() =>
                            updateInquiryStatus(
                              r.id,
                              e.target.value as InquiryStatus,
                            ),
                          )
                        }
                        className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium ${badge[r.status]}`}
                      >
                        {INQUIRY_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setEditing(r)}
                        disabled={pending}
                        className={btn}
                      >
                        수정
                      </button>{" "}
                      <button
                        type="button"
                        onClick={() => onDelete(r)}
                        disabled={pending}
                        className={`${btn} text-red-600 dark:text-red-400`}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                  {open && (
                    <tr className="bg-zinc-50 dark:bg-zinc-900/50">
                      <td colSpan={6} className="whitespace-pre-wrap px-4 py-4">
                        {r.message}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditInquiryModal
          key={editing.id}
          inquiry={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
