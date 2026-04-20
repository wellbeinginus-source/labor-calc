"use client";

import { useState } from "react";
import KakaoAdFit from "@/components/KakaoAdFit";
import { CoupangBanner } from "@/components/CoupangBanner";

// 2025년 기준 요율
const RATES_2025 = {
  pension: { employee: 0.045, employer: 0.045, label: "국민연금", max: 5900000 },
  health: { employee: 0.03545, employer: 0.03545, label: "건강보험" },
  longTermCare: { rate: 0.1295, label: "장기요양보험" }, // 건강보험의 12.95%
  employment: { employee: 0.009, employer: 0.009, label: "고용보험" },
  industrial: { employer: 0.007, label: "산재보험" }, // 업종 평균
};

interface InsuranceResult {
  monthlyGross: number;
  items: {
    label: string;
    employee: number;
    employer: number;
  }[];
  totalEmployee: number;
  totalEmployer: number;
}

export default function InsurancePage() {
  const [monthly, setMonthly] = useState("");
  const [result, setResult] = useState<InsuranceResult | null>(null);

  function calculate() {
    const gross = Number(monthly);
    if (!gross) return;

    const pensionBase = Math.min(gross, RATES_2025.pension.max);
    const pensionE = Math.round(pensionBase * RATES_2025.pension.employee);
    const pensionR = Math.round(pensionBase * RATES_2025.pension.employer);

    const healthE = Math.round(gross * RATES_2025.health.employee);
    const healthR = Math.round(gross * RATES_2025.health.employer);

    const longTermE = Math.round(healthE * RATES_2025.longTermCare.rate);
    const longTermR = Math.round(healthR * RATES_2025.longTermCare.rate);

    const employmentE = Math.round(gross * RATES_2025.employment.employee);
    const employmentR = Math.round(gross * RATES_2025.employment.employer);

    const industrialR = Math.round(gross * RATES_2025.industrial.employer);

    const items = [
      { label: "국민연금 (4.5%)", employee: pensionE, employer: pensionR },
      { label: "건강보험 (3.545%)", employee: healthE, employer: healthR },
      { label: "장기요양 (건강의 12.95%)", employee: longTermE, employer: longTermR },
      { label: "고용보험 (0.9%)", employee: employmentE, employer: employmentR },
      { label: "산재보험 (평균 0.7%)", employee: 0, employer: industrialR },
    ];

    const totalEmployee = items.reduce((s, i) => s + i.employee, 0);
    const totalEmployer = items.reduce((s, i) => s + i.employer, 0);

    setResult({ monthlyGross: gross, items, totalEmployee, totalEmployer });
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-1">4대보험 계산기</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        월 급여 기준 근로자·사업주 4대보험 부담금을 계산합니다.
      </p>

      <div className="space-y-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-6">
        <div>
          <label className="block text-sm font-medium mb-1">월 급여 (세전)</label>
          <div className="relative">
            <input
              type="number"
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              placeholder="3,000,000"
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 pr-10 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">원</span>
          </div>
        </div>
        <button
          onClick={calculate}
          className="w-full py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-colors"
        >
          계산하기
        </button>
      </div>

      {result && (
        <div className="mt-6 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-6">
          <h3 className="font-bold text-lg text-orange-700 dark:text-orange-300 mb-4">
            4대보험 부담금
          </h3>

          {/* 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-zinc-500 border-b border-orange-200 dark:border-orange-800">
                  <th className="text-left py-2 font-medium">항목</th>
                  <th className="text-right py-2 font-medium">근로자</th>
                  <th className="text-right py-2 font-medium">사업주</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((item) => (
                  <tr key={item.label} className="border-b border-orange-100 dark:border-orange-900">
                    <td className="py-2 text-zinc-600 dark:text-zinc-300">{item.label}</td>
                    <td className="py-2 text-right font-medium">
                      {item.employee > 0 ? `${item.employee.toLocaleString()}원` : "-"}
                    </td>
                    <td className="py-2 text-right font-medium">
                      {item.employer.toLocaleString()}원
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold text-base">
                  <td className="py-3">합계</td>
                  <td className="py-3 text-right text-orange-600 dark:text-orange-400">
                    {result.totalEmployee.toLocaleString()}원
                  </td>
                  <td className="py-3 text-right text-orange-600 dark:text-orange-400">
                    {result.totalEmployer.toLocaleString()}원
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="text-xs text-zinc-500 mt-4">
            * 2025년 기준 요율. 국민연금 상한 월 590만원. 산재보험은 업종 평균(0.7%) 적용.
          </p>
        </div>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "4대보험 계산기",
        description: "월급 기준 국민연금·건강보험·고용보험료를 자동 계산합니다.",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
      }) }} />
            <KakaoAdFit unit="DAN-GrFB4TR5eJgi0FM1" width={320} height={100} />
      <CoupangBanner />
    </>
  );
}
