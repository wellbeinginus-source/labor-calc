import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "급여 실수령액 계산기 | 연봉·월급 실수령액 자동 계산",
  description: "연봉 또는 월급 입력 시 4대보험·소득세 공제 후 실수령액을 계산합니다. 2026년 간이세액표 기준.",
  keywords: ["실수령액 계산기", "연봉 실수령액", "월급 실수령액", "4대보험 계산", "소득세 계산"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
