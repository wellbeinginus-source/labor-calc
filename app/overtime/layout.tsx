import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "연장근로수당 계산기 | 야간·휴일 수당 자동 계산",
  description: "시급·연장·야간·휴일 근무시간을 입력하면 법정 가산수당을 자동 계산합니다. 근로기준법 50% 가산 기준.",
  keywords: ["연장근로수당 계산기", "야간수당 계산", "휴일수당 계산", "연장수당", "법정수당 계산"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
