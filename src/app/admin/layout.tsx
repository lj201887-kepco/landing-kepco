import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의 관리",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
