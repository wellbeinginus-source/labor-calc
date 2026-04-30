"use client";

import { useState } from "react";
import KakaoAdFit from "@/components/KakaoAdFit";
import LaborConsultCTA from "@/components/LaborConsultCTA";
import { CoupangBanner } from "@/components/CoupangBanner";

const MIN_WAGE_2025 = 10030; // 2025년 최저시급

export default function WeeklyHolidayPage() {
  const [inputMode, setInputMode] = useState<"hourly" | "daily">("hourly");
  const [hourlyWage, setHourlyWage] = useState("");
  const [dailyWage, setDailyWage] = useState("");
  const [workDays, setWorkDays] = useState("5");
  const [dailyHours, setDailyHours] = useState("8");
  const [useMinWage, setUseMinWage] = useState(false);
  const [result, setResult] = useState<{
    eligible: boolean;
    weeklyHours: number;
    actualHourlyWage: number;
    weeklyHolidayHours: number;
    weeklyHolidayPay: number;
    weeklyBasePay: number;
    monthlyBasePay: number;
    monthlyHolidayPay: number;
    totalMonthlyPay: number;
    effectiveHourlyWage: number;
    isAboveMinWage: boolean;
  } | null>(null);

  function calculate() {
    const days = Number(workDays) || 0;
    const hoursPerDay = Number(dailyHours) || 0;
    const weeklyHours = days * hoursPerDay;

    let wage: number;
    if (inputMode === "hourly") {
      wage = useMinWage ? MIN_WAGE_2025 : Number(hourlyWage);
    } else {
      wage = hoursPerDay > 0 ? Math.round(Number(dailyWage) / hoursPerDay) : 0;
    }
    if (!wage || !weeklyHours) return;

    const eligible = weeklyHours >= 15;
    const weeklyHolidayHours = eligible ? Math.min((weeklyHours / 40) * 8, 8) : 0;
    const weeklyHolidayPay = Math.round(wage * weeklyHolidayHours);
    const weeklyBasePay = Math.round(wage * weeklyHours);

    const weeksPerMonth = 365 / 7 / 12;
    const monthlyBasePay = Math.round(weeklyBasePay * weeksPerMonth);
    const monthlyHolidayPay = Math.round(weeklyHolidayPay * weeksPerMonth);
    const totalMonthlyPay = monthlyBasePay + monthlyHolidayPay;

    // 주휴수당 포함 실질 시급
    const totalWeeklyHours = weeklyHours + weeklyHolidayHours;
    const effectiveHourlyWage = totalWeeklyHours > 0 ? Math.round((weeklyBasePay + weeklyHolidayPay) / totalWeeklyHours) : 0;

    setResult({
      eligible,
      weeklyHours,
      actualHourlyWage: wage,
      weeklyHolidayHours,
      weeklyHolidayPay,
      weeklyBasePay,
      monthlyBasePay,
      monthlyHolidayPay,
      totalMonthlyPay,
      effectiveHourlyWage,
      isAboveMinWage: wage >= MIN_WAGE_2025,
    });
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-1">주휴수당 계산기</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        시급(또는 일급), 근무일수, 일 근무시간으로 주휴수당과 월 환산액을 계산합니다.
      </p>

      <div className="space-y-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-6">
        {/* 시급/일급 토글 */}
        <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          <button
            onClick={() => { setInputMode("hourly"); setUseMinWage(false); }}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${inputMode === "hourly" ? "bg-rose-600 text-white" : "bg-white dark:bg-zinc-800 text-zinc-500"}`}
          >
            시급 입력
          </button>
          <button
            onClick={() => { setInputMode("daily"); setUseMinWage(false); }}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${inputMode === "daily" ? "bg-rose-600 text-white" : "bg-white dark:bg-zinc-800 text-zinc-500"}`}
          >
            일급 입력
          </button>
        </div>

        {/* 시급 입력 */}
        {inputMode === "hourly" && (
          <div>
            <label className="block text-sm font-medium mb-1">시급</label>
            <div className="relative">
              <input
                type="number"
                value={useMinWage ? MIN_WAGE_2025 : hourlyWage}
                onChange={(e) => { setHourlyWage(e.target.value); setUseMinWage(false); }}
                placeholder={`${MIN_WAGE_2025.toLocaleString()} (2025년 최저시급)`}
                disabled={useMinWage}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 pr-10 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:bg-zinc-100 dark:disabled:bg-zinc-800"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">원</span>
            </div>
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useMinWage}
                onChange={(e) => setUseMinWage(e.target.checked)}
                className="rounded border-zinc-300 text-rose-600 focus:ring-rose-300"
              />
              <span className="text-xs text-zinc-500">
                2025년 최저시급 ({MIN_WAGE_2025.toLocaleString()}원) 적용
              </span>
            </label>
          </div>
        )}

        {/* 일급 입력 */}
        {inputMode === "daily" && (
          <div>
            <label className="block text-sm font-medium mb-1">일급</label>
            <div className="relative">
              <input
                type="number"
                value={dailyWage}
                onChange={(e) => setDailyWage(e.target.value)}
                placeholder="80,240"
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 pr-10 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">원</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">일급 ÷ 일 근무시간 = 시급으로 환산</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {/* 주 근무일수 */}
          <div>
            <label className="block text-sm font-medium mb-1">주 근무일수</label>
            <select
              value={workDays}
              onChange={(e) => setWorkDays(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n}일</option>
              ))}
            </select>
          </div>

          {/* 일 근무시간 */}
          <div>
            <label className="block text-sm font-medium mb-1">일 근무시간</label>
            <div className="relative">
              <input
                type="number"
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                placeholder="8"
                step="0.5"
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 pr-14 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">시간</span>
            </div>
          </div>
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
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-600 dark:text-zinc-300">
                주 {result.weeklyHours}시간 근무 → 15시간 미만이므로 <strong>주휴수당 미발생</strong>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">주 근로소득</span>
                <span className="font-semibold">{result.weeklyBasePay.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">월 환산 근로소득</span>
                <span className="font-semibold">{result.monthlyBasePay.toLocaleString()}원</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              {/* 기본 정보 */}
              <div className="p-3 rounded-lg bg-white dark:bg-zinc-800 border border-rose-100 dark:border-rose-900 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-zinc-500">적용 시급</span>
                  <span className="font-medium">{result.actualHourlyWage.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">주 근무시간</span>
                  <span className="font-medium">{result.weeklyHours}시간</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">주휴시간</span>
                  <span className="font-medium">{result.weeklyHolidayHours.toFixed(1)}시간</span>
                </div>
              </div>

              <hr className="border-rose-200 dark:border-rose-800" />

              {/* 주급 */}
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">주 근로소득</span>
                <span className="font-semibold">{result.weeklyBasePay.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">주휴수당 (주)</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">
                  +{result.weeklyHolidayPay.toLocaleString()}원
                </span>
              </div>

              <hr className="border-rose-200 dark:border-rose-800" />

              {/* 월급 */}
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">월 근로소득</span>
                <span className="font-semibold">{result.monthlyBasePay.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">월 주휴수당</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">
                  +{result.monthlyHolidayPay.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-rose-200 dark:border-rose-800">
                <span>월 총 급여</span>
                <span className="text-rose-600 dark:text-rose-400">
                  {result.totalMonthlyPay.toLocaleString()}원
                </span>
              </div>

              {/* 실질 시급 */}
              <div className="mt-3 p-3 rounded-lg bg-white dark:bg-zinc-800 border border-rose-100 dark:border-rose-900">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-xs">주휴 포함 실질 시급</span>
                  <span className="font-bold text-base">{result.effectiveHourlyWage.toLocaleString()}원</span>
                </div>
                {!result.isAboveMinWage && (
                  <p className="text-xs text-red-500 mt-1">
                    ⚠ 시급이 2025년 최저임금({MIN_WAGE_2025.toLocaleString()}원)보다 낮습니다.
                  </p>
                )}
              </div>
            </div>
          )}

          <p className="text-xs text-zinc-500 mt-4">
            * 주휴시간 = 주 소정근로시간 ÷ 40 × 8 (최대 8시간). 월 환산 = 주급 × 365/7/12.
            2025년 최저시급 {MIN_WAGE_2025.toLocaleString()}원 기준.
          </p>
        </div>
      )}

      <LaborConsultCTA calc="weekly-holiday" />

      <section className="mt-12 mb-4">
        <h2 className="text-xl font-bold mb-4">주휴수당 FAQ</h2>
        <div className="space-y-3">
          <details className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800">
            <summary className="font-medium cursor-pointer">주휴수당은 언제 발생하나요?</summary>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">1주 소정근로시간이 15시간 이상이고 그 주를 개근한 근로자에게 발생합니다. 결근이 있으면 주휴수당이 지급되지 않을 수 있습니다.</p>
          </details>
          <details className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800">
            <summary className="font-medium cursor-pointer">주휴수당 계산법은?</summary>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">주휴시간 = 주 소정근로시간 ÷ 40 × 8 (최대 8시간). 주휴수당 = 주휴시간 × 시급. 예를 들어 주 40시간 근무, 시급 10,030원이면 주휴수당은 80,240원입니다.</p>
          </details>
          <details className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800">
            <summary className="font-medium cursor-pointer">알바 주휴수당 안 주면 위법인가요?</summary>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">네, 주 15시간 이상 개근한 근로자에게 주휴수당을 미지급하면 근로기준법 위반입니다. 노동청에 신고할 수 있으며 3년 이내의 미지급분을 청구할 수 있습니다.</p>
          </details>
          <details className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800">
            <summary className="font-medium cursor-pointer">주휴수당도 최저임금에 포함되나요?</summary>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">시급으로 근로계약을 할 때 주휴수당을 별도로 지급해야 합니다. 주휴수당을 포함해서 최저임금을 맞추는 것은 불가합니다.</p>
          </details>
          <details className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800">
            <summary className="font-medium cursor-pointer">주 5일 미만 근무해도 주휴수당이 나오나요?</summary>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">네, 근무일수가 아니라 주 소정근로시간이 15시간 이상이면 됩니다. 예를 들어 주 3일 각 6시간(=18시간) 근무해도 주휴수당이 발생합니다. 이 경우 주휴시간은 18÷40×8=3.6시간입니다.</p>
          </details>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "주휴수당 계산기",
        description: "시급·일급과 근무시간으로 주휴수당과 월 환산 급여를 자동 계산합니다.",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "주휴수당은 언제 발생하나요?", "acceptedAnswer": {"@type": "Answer", "text": "1주 소정근로시간이 15시간 이상이고 그 주를 개근한 근로자에게 발생합니다."}}, {"@type": "Question", "name": "주휴수당 계산법은?", "acceptedAnswer": {"@type": "Answer", "text": "주휴시간 = 주 소정근로시간 ÷ 40 × 8. 주휴수당 = 주휴시간 × 시급입니다."}}]}) }} />
      <KakaoAdFit unit="DAN-GrFB4TR5eJgi0FM1" width={320} height={100} />
      <CoupangBanner />
    </>
  );
}
