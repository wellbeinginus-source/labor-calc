"use client";

import { useState } from "react";
import KakaoAdFit from "@/components/KakaoAdFit";
import { CoupangBanner } from "@/components/CoupangBanner";

export default function OvertimePage() {
  const [hourlyWage, setHourlyWage] = useState("");
  const [overtimeHours, setOvertimeHours] = useState("");
  const [nightHours, setNightHours] = useState("");
  const [holidayHours, setHolidayHours] = useState("");
  const [result, setResult] = useState<{
    overtimePay: number;
    nightPay: number;
    holidayPay: number;
    holidayOvertimePay: number;
    totalExtra: number;
  } | null>(null);

  function calculate() {
    const wage = Number(hourlyWage);
    if (!wage) return;

    const ot = Number(overtimeHours) || 0;
    const night = Number(nightHours) || 0;
    const holiday = Number(holidayHours) || 0;

    // 연장근로: 통상시급 × 1.5 (할증 0.5만 추가 지급)
    const overtimePay = Math.round(wage * 1.5 * ot);
    // 야간근로(22~06시): 통상시급 × 0.5 추가
    const nightPay = Math.round(wage * 0.5 * night);
    // 휴일근로 8시간 이내: 통상시급 × 1.5
    const holidayBase = Math.min(holiday, 8);
    const holidayOver = Math.max(holiday - 8, 0);
    const holidayPay = Math.round(wage * 1.5 * holidayBase);
    // 휴일근로 8시간 초과: 통상시급 × 2.0
    const holidayOvertimePay = Math.round(wage * 2.0 * holidayOver);

    setResult({
      overtimePay,
      nightPay,
      holidayPay,
      holidayOvertimePay,
      totalExtra: overtimePay + nightPay + holidayPay + holidayOvertimePay,
    });
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-1">연장·야간·휴일 수당 계산기</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        시급과 근무시간별 연장·야간·휴일 할증 수당을 계산합니다.
      </p>

      <div className="space-y-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-6">
        <div>
          <label className="block text-sm font-medium mb-1">통상 시급</label>
          <div className="relative">
            <input
              type="number"
              value={hourlyWage}
              onChange={(e) => setHourlyWage(e.target.value)}
              placeholder="9,860"
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 pr-10 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">원</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">연장근로</label>
            <div className="relative">
              <input
                type="number"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 pr-10 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">h</span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">×1.5배</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">야간근로</label>
            <div className="relative">
              <input
                type="number"
                value={nightHours}
                onChange={(e) => setNightHours(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 pr-10 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">h</span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">+0.5배</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">휴일근로</label>
            <div className="relative">
              <input
                type="number"
                value={holidayHours}
                onChange={(e) => setHolidayHours(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 pr-10 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">h</span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">×1.5~2배</p>
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full py-3 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-700 transition-colors"
        >
          계산하기
        </button>
      </div>

      {result && (
        <div className="mt-6 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 p-6">
          <h3 className="font-bold text-lg text-cyan-700 dark:text-cyan-300 mb-4">
            수당 내역
          </h3>
          <div className="space-y-3 text-sm">
            {result.overtimePay > 0 && (
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">
                  연장근로수당 (×1.5)
                </span>
                <span className="font-semibold">
                  {result.overtimePay.toLocaleString()}원
                </span>
              </div>
            )}
            {result.nightPay > 0 && (
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">
                  야간근로수당 (+0.5)
                </span>
                <span className="font-semibold">
                  {result.nightPay.toLocaleString()}원
                </span>
              </div>
            )}
            {result.holidayPay > 0 && (
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">
                  휴일근로수당 8h이내 (×1.5)
                </span>
                <span className="font-semibold">
                  {result.holidayPay.toLocaleString()}원
                </span>
              </div>
            )}
            {result.holidayOvertimePay > 0 && (
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">
                  휴일근로수당 8h초과 (×2.0)
                </span>
                <span className="font-semibold">
                  {result.holidayOvertimePay.toLocaleString()}원
                </span>
              </div>
            )}
            <hr className="border-cyan-200 dark:border-cyan-800" />
            <div className="flex justify-between text-lg font-bold">
              <span>총 추가 수당</span>
              <span className="text-cyan-600 dark:text-cyan-400">
                {result.totalExtra.toLocaleString()}원
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-4">
            * 근로기준법 제56조 기준. 연장: 통상임금의 150%, 야간(22~06시): +50%, 휴일 8h이내 150%, 8h초과 200%.
          </p>
        </div>
      )}

      <section className="mt-6 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-5">
        <h3 className="font-bold text-sm mb-3">할증 기준</h3>
        <div className="text-sm text-zinc-600 dark:text-zinc-300 space-y-1">
          <p><strong>연장근로:</strong> 법정 근로시간(주 40시간) 초과 → 통상임금의 150%</p>
          <p><strong>야간근로:</strong> 22:00~06:00 근무 → 통상임금의 50% 가산</p>
          <p><strong>휴일근로:</strong> 8시간 이내 150%, 8시간 초과 200%</p>
          <p><strong>중복 할증:</strong> 야간 + 연장이 겹치면 각각 적용 (예: ×2.0)</p>
        </div>
      </section>

      <KakaoAdFit unit="DAN-XXXXXXXXXX" width={320} height={100} />
      <CoupangBanner />
    </>
  );
}
