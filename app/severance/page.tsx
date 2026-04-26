"use client";

import { useState } from "react";
import KakaoAdFit from "@/components/KakaoAdFit";
import { CoupangBanner } from "@/components/CoupangBanner";
import LaborConsultCTA from "@/components/LaborConsultCTA";

export default function SeverancePage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [avgMonthly, setAvgMonthly] = useState("");
  const [result, setResult] = useState<{
    totalDays: number;
    years: number;
    severance: number;
  } | null>(null);

  function calculate() {
    if (!startDate || !endDate || !avgMonthly) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end.getTime() - start.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (totalDays < 365) {
      alert("1년 미만 근무 시 퇴직금 지급 의무가 없습니다.");
      return;
    }

    const salary = Number(avgMonthly);
    // 퇴직금 = (1일 평균임금) × 30일 × (총 재직일수 / 365)
    const dailyWage = salary / 30;
    const severance = Math.round(dailyWage * 30 * (totalDays / 365));
    const years = totalDays / 365;

    setResult({ totalDays, years, severance });
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-1">퇴직금 계산기</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        입사일·퇴사일·최근 3개월 평균임금으로 법정 퇴직금을 계산합니다.
      </p>

      <div className="space-y-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">입사일</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">퇴사일</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            최근 3개월 월 평균임금 (세전)
          </label>
          <div className="relative">
            <input
              type="number"
              value={avgMonthly}
              onChange={(e) => setAvgMonthly(e.target.value)}
              placeholder="3,000,000"
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 pr-10 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
              원
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            기본급 + 고정수당 + 상여금(월 환산) 포함
          </p>
        </div>

        <button
          onClick={calculate}
          className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
        >
          계산하기
        </button>
      </div>

      {result && (
        <div className="mt-6 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-6">
          <h3 className="font-bold text-lg text-emerald-700 dark:text-emerald-300 mb-4">
            계산 결과
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">총 재직일수</span>
              <span className="font-semibold">
                {result.totalDays.toLocaleString()}일 ({result.years.toFixed(1)}년)
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">월 평균임금</span>
              <span className="font-semibold">
                {Number(avgMonthly).toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">1일 평균임금</span>
              <span className="font-semibold">
                {Math.round(Number(avgMonthly) / 30).toLocaleString()}원
              </span>
            </div>
            <hr className="border-emerald-200 dark:border-emerald-800" />
            <div className="flex justify-between">
              <span className="font-bold text-lg">예상 퇴직금</span>
              <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                {result.severance.toLocaleString()}원
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-4">
            * 퇴직금 = 1일 평균임금 × 30일 × (재직일수 / 365). 실제 퇴직금은
            상여금·수당 포함 여부에 따라 달라질 수 있습니다.
          </p>
        </div>
      )}


      <LaborConsultCTA calc="severance" />

      <section className="mt-12 mb-4">
        <h2 className="text-xl font-bold mb-4">퇴직금 FAQ</h2>
        <div className="space-y-3">
          <details className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800">
            <summary className="font-medium cursor-pointer">퇴직금을 받으려면 얼마나 일해야 하나요?</summary>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">계속 근로기간이 1년 이상이고 주 평균 15시간 이상 근무한 경우 퇴직금이 발생합니다. 1년 미만 근무 시에는 퇴직금이 지급되지 않습니다.</p>
          </details>
          <details className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800">
            <summary className="font-medium cursor-pointer">평균임금은 어떻게 계산하나요?</summary>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">퇴직 전 3개월간 받은 임금 총액을 해당 기간의 총 일수로 나눈 금액입니다. 기본급뿐 아니라 정기적으로 지급받은 수당도 포함됩니다.</p>
          </details>
          <details className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800">
            <summary className="font-medium cursor-pointer">퇴직금 지급 기한은 언제인가요?</summary>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">퇴직일로부터 14일 이내에 지급해야 합니다. 당사자 간 합의가 있으면 연장 가능하지만, 기한을 넘기면 지연이자(연 20%)가 발생합니다.</p>
          </details>
          <details className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800">
            <summary className="font-medium cursor-pointer">알바도 퇴직금을 받을 수 있나요?</summary>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">네, 주 15시간 이상 1년 이상 근무했다면 고용 형태(정규직·계약직·아르바이트)와 무관하게 퇴직금이 발생합니다.</p>
          </details>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "퇴직금 계산기",
        description: "입사일·퇴사일·평균임금으로 퇴직금을 자동 계산합니다.",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
      }) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "퇴직금을 받으려면 얼마나 일해야 하나요?", "acceptedAnswer": {"@type": "Answer", "text": "계속 근로기간이 1년 이상이고 주 평균 15시간 이상 근무한 경우 퇴직금이 발생합니다."}}, {"@type": "Question", "name": "퇴직금 지급 기한은 언제인가요?", "acceptedAnswer": {"@type": "Answer", "text": "퇴직일로부터 14일 이내에 지급해야 합니다. 기한을 넘기면 지연이자(연 20%)가 발생합니다."}}]}) }} />
            <KakaoAdFit unit="DAN-GrFB4TR5eJgi0FM1" width={320} height={100} />
      <CoupangBanner />
    </>
  );
}
