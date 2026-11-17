import { Suspense } from "react";
import Link from "next/link";
import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { inquiries } from "../../../drizzle/schema";
import { assertAdmin } from "@/lib/admin";
import {
  INQUIRY_STATUSES,
  STATUS_LABELS,
  isInquiryStatus,
} from "@/lib/inquiry";
import InquiryTable from "@/components/admin/InquiryTable";

const PAGE_SIZE = 20;

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

// cacheComponents 사용 시 searchParams/DB 조회는 요청 시점 작업이므로 Suspense 안에서 처리한다.
export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-6xl px-4 py-10">
          <h1 className="text-2xl font-bold">문의 관리</h1>
          <p className="mt-6 text-zinc-500">불러오는 중...</p>
        </main>
      }
    >
      <AdminContent searchParams={searchParams} />
    </Suspense>
  );
}

async function AdminContent({
  searchParams,
}: {
  searchParams: PageProps<"/admin">["searchParams"];
}) {
  await assertAdmin();
  const sp = await searchParams;
  const q = (first(sp.q) ?? "").trim();
  const statusParam = first(sp.status);
  const status = isInquiryStatus(statusParam) ? statusParam : undefined;
  const requested = Math.max(1, parseInt(first(sp.page) ?? "1", 10) || 1);

  const conds: SQL[] = [];
  if (q) {
    // LIKE 와일드카드 이스케이프
    const like = `%${q.replace(/[\\%_]/g, "\\$&")}%`;
    conds.push(
      or(
        ilike(inquiries.name, like),
        ilike(inquiries.email, like),
        ilike(inquiries.message, like),
      )!,
    );
  }
  if (status) conds.push(eq(inquiries.status, status));
  const where = conds.length ? and(...conds) : undefined;

  const [{ total }] = await db
    .select({ total: count() })
    .from(inquiries)
    .where(where);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requested, totalPages);

  const rows = await db
    .select()
    .from(inquiries)
    .where(where)
    .orderBy(desc(inquiries.createdAt), desc(inquiries.id))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  const href = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return s ? `/admin?${s}` : "/admin";
  };

  const linkClass =
    "rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800";

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">문의 관리</h1>
        <span className="text-sm text-zinc-500">총 {total}건</span>
      </div>

      <form method="get" className="mt-6 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="이름, 이메일, 내용 검색"
          className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="">전체 상태</option>
          {INQUIRY_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          검색
        </button>
        {(q || status) && (
          <Link href="/admin" className={linkClass}>
            초기화
          </Link>
        )}
      </form>

      <InquiryTable
        rows={rows.map((r) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone,
          message: r.message,
          status: isInquiryStatus(r.status) ? r.status : "new",
          createdAt: r.createdAt.toISOString(),
        }))}
      />

      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-3">
          {page > 1 ? (
            <Link href={href(page - 1)} className={linkClass}>
              이전
            </Link>
          ) : (
            <span className={`${linkClass} opacity-40`}>이전</span>
          )}
          <span className="text-sm">
            {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={href(page + 1)} className={linkClass}>
              다음
            </Link>
          ) : (
            <span className={`${linkClass} opacity-40`}>다음</span>
          )}
        </nav>
      )}
    </main>
  );
}
