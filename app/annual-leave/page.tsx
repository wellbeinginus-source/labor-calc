"use client";

import { useState } from "react";
import KakaoAdFit from "@/components/KakaoAdFit";
import { CoupangBanner } from "@/components/CoupangBanner";

interface LeaveResult {
  yearsWorked: number;
  totalLeave: number;
  breakdown: { period: string; days: number; note: string }[];
}

function calculateAnnualLeave(startDate: Date, endDate: Date): LeaveResult {
  const diffMs = endDate.getTime() - startDate.getTime();
  const totalDays = diffMs / (1000 * 60 * 60 * 24);
  const yearsWorked = totalDays / 365;
  const breakdown: { period: string; days: number; note: string }[] = [];
  let totalLeave = 0;

  if (yearsWorked < 1) {
    // 1년 미만: 1개월 개근 시 1일 (최대 11일)
    const months = Math.min(Math.floor(totalDays / 30), 11);
    breakdown.push({
      period: "입사 ~ 1년 미만",
      days: months,
      note: `매월 1일 × ${months}개월`,
    });
    totalLeave = months;
  } else {
    // 1년차: 15일
    breakdown.push({ period: "1년차", days: 15, note: "기본 15일" });
    totalLeave = 15;

    // 2년차부터: 2년마다 1일 추가 (최대 25일)
    const fullYears = Math.floor(yearsWorked);
    if (fullYears >= 2) {
      const bonusDays = Math.min(Math.floor((fullYears - 1) / 2), 10);
      const currentLeave = 15 + bonusDays;
      breakdown.push({
        period: `${fullYears}년차`,
        days: currentLeave,
        note: `15일 + 가산 ${bonusDays}일 (2년마다 1일, 최대 25일)`,
      });
      totalLeave = currentLeave;
    }
  }

  return { yearsWorked, totalLeave, breakdown };
}

export default function AnnualLeavePage() {
  const [startDate, setStartDate] = useState("");
  const [result, setResult] = useState<LeaveResult | null>(null);

  function calculate() {
    if (!startDate) return;
    const start = new Date(startDate);
    const now = new Date();
    if (start > now) {
      alert("입사일이 현재 날짜보다 미래입니다.");
      return;
    }
    setResult(calculateAnnualLeave(start, now));
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-1">연차 계산기</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        입사일 기준으로 현재 발생한 법정 연차 일수를 계산합니다.
      </p>

      <div className="space-y-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-6">
        <div>
          <label className="block text-sm font-medium mb-1">입사일</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>
        <button
          onClick={calculate}
          className="w-full py-3 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition-colors"
        >
          계산하기
        </button>
      </div>

      {result && (
        <div className="mt-6 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 p-6">
          <h3 className="font-bold text-lg text-violet-700 dark:text-violet-300 mb-4">
            연차 현황
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">근속 기간</span>
              <span className="font-semibold">
                {result.yearsWorked < 1
                  ? `${Math.floor(result.yearsWorked * 12)}개월`
                  : `${Math.floor(result.yearsWorked)}년 ${Math.floor((result.yearsWorked % 1) * 12)}개월`}
              </span>
            </div>
            <hr className="border-violet-200 dark:border-violet-800" />
            {result.breakdown.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {item.period}
                  </span>
                  <span className="font-semibold">{item.days}일</span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{item.note}</p>
              </div>
            ))}
            <hr className="border-violet-200 dark:border-violet-800" />
            <div className="flex justify-between text-lg font-bold">
              <span>현재 연차</span>
              <span className="text-violet-600 dark:text-violet-400">
                {result.totalLeave}일
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-4">
            * 근로기준법 제60조 기준. 개근 여부, 회사 규정에 따라 달라질 수 있습니다.
          </p>
        </div>
      )}

      {/* 연차 기준 안내 */}
      <section className="mt-6 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-5">
        <h3 className="font-bold text-sm mb-3">연차 발생 기준</h3>
        <div className="text-sm text-zinc-600 dark:text-zinc-300 space-y-2">
          <p><strong>1년 미만:</strong> 1개월 개근 시 1일 (최대 11일)</p>
          <p><strong>1년 이상:</strong> 15일</p>
          <p><strong>3년 이상:</strong> 2년마다 1일 추가 (최대 25일)</p>
        </div>
      </section>

      <KakaoAdFit unit="DAN-XXXXXXXXXX" width={320} height={100} />
      <CoupangBanner />
    </>
  );
}
