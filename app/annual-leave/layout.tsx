import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "연차 계산기 | 2026년 연차 발생일수 자동 계산",
  description: "입사일을 입력하면 근로기준법 기준 연차 발생일수를 자동으로 계산합니다. 1년 미만·1년 이상 모두 지원.",
  keywords: ["연차 계산기", "연차 발생일수", "연차 계산법", "연차휴가 계산", "입사일 연차"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
