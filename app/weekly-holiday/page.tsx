"use client";

import { useState } from "react";
import KakaoAdFit from "@/components/KakaoAdFit";
import { CoupangBanner } from "@/components/CoupangBanner";

export default function WeeklyHolidayPage() {
  const [hourlyWage, setHourlyWage] = useState("");
  const [weeklyHours, setWeeklyHours] = useState("");
  const [result, setResult] = useState<{
    eligible: boolean;
    weeklyHolidayHours: number;
    weeklyHolidayPay: number;
    monthlyPay: number;
    totalMonthlyWithPay: number;
  } | null>(null);

  function calculate() {
    const wage = Number(hourlyWage);
    const hours = Number(weeklyHours);
    if (!wage || !hours) return;

    // 주 15시간 이상 근무해야 주휴수당 발생
    const eligible = hours >= 15;

    // 주휴시간 = 1주 소정근로시간 / 40 × 8 (최대 8시간)
    const weeklyHolidayHours = eligible ? Math.min((hours / 40) * 8, 8) : 0;
    const weeklyHolidayPay = Math.round(wage * weeklyHolidayHours);

    // 월 환산: 주급 × (365/7/12)
    const weeksPerMonth = 365 / 7 / 12;
    const monthlyPay = Math.round(wage * hours * weeksPerMonth);
    const totalMonthlyWithPay = Math.round(
      wage * (hours + weeklyHolidayHours) * weeksPerMonth
    );

    setResult({
      eligible,
      weeklyHolidayHours,
      weeklyHolidayPay,
      monthlyPay,
      totalMonthlyWithPay,
    });
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-1">주휴수당 계산기</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        시급과 주 근무시간으로 주휴수당 및 월 환산액을 계산합니다.
      </p>

      <div className="space-y-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-6">
        <div>
          <label className="block text-sm font-medium mb-1">시급</label>
          <div className="relative">
            <input
              type="number"
              value={hourlyWage}
              onChange={(e) => setHourlyWage(e.target.value)}
              placeholder="9,860 (2025년 최저시급)"
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 pr-10 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">원</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">주 소정근로시간</label>
          <div className="relative">
            <input
              type="number"
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(e.target.value)}
              placeholder="40"
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 pr-14 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">시간</span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            주 15시간 이상이어야 주휴수당이 발생합니다.
          </p>
        </div>

        <button
          onClick={calculate}
          className="w-full py-3 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors"
        >
          계산하기
        </button>
      </div>

      {result && (
        <div className="mt-6 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-6">
          <h3 className="font-bold text-lg text-rose-700 dark:text-rose-300 mb-4">
            계산 결과
          </h3>

          {!result.eligible ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              주 15시간 미만 근무 시 주휴수당이 발생하지 않습니다.
            </p>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">주휴시간</span>
                <span className="font-semibold">{result.weeklyHolidayHours.toFixed(1)}시간</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">주휴수당 (주)</span>
                <span className="font-semibold">{result.weeklyHolidayPay.toLocaleString()}원</span>
              </div>
              <hr className="border-rose-200 dark:border-rose-800" />
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">월 근로소득 (주휴 미포함)</span>
                <span className="font-semibold">{result.monthlyPay.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>월 총액 (주휴 포함)</span>
                <span className="text-rose-600 dark:text-rose-400">
                  {result.totalMonthlyWithPay.toLocaleString()}원
                </span>
              </div>
            </div>
          )}

          <p className="text-xs text-zinc-500 mt-4">
            * 주휴시간 = 주 소정근로시간 ÷ 40 × 8 (최대 8시간). 월 환산 = 주급 × 365/7/12.
          </p>
        </div>
      )}

      <KakaoAdFit unit="DAN-XXXXXXXXXX" width={320} height={100} />
      <CoupangBanner />
    </>
  );
}
