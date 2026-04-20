import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "4대보험 계산기 | 2026년 국민연금·건강보험·고용보험 계산",
  description: "월급 입력 시 국민연금·건강보험·장기요양·고용보험 보험료를 자동 계산합니다. 2026년 최신 요율 반영.",
  keywords: ["4대보험 계산기", "국민연금 계산", "건강보험 계산", "고용보험 계산", "4대보험료"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
