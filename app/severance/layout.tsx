import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "퇴직금 계산기 | 2026년 기준 퇴직금 자동 계산",
  description: "입사일·퇴사일·평균임금을 입력하면 퇴직금을 자동으로 계산합니다. 근로기준법 기준, 2026년 최신 요율 반영.",
  keywords: ["퇴직금 계산기", "퇴직금 계산", "퇴직금 얼마", "평균임금 계산", "퇴직금 산정"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
