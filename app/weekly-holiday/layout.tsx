import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "주휴수당 계산기 | 2026년 주휴수당 자동 계산",
  description: "주간 근무시간을 입력하면 주휴수당을 자동 계산합니다. 시급·주 15시간 이상 근무자 기준, 2026년 최저임금 반영.",
  keywords: ["주휴수당 계산기", "주휴수당 계산법", "주휴수당 얼마", "알바 주휴수당", "주 15시간"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
