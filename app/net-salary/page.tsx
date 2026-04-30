"use client";

import { useState } from "react";
import KakaoAdFit from "@/components/KakaoAdFit";
import { CoupangBanner } from "@/components/CoupangBanner";
import LaborConsultCTA from "@/components/LaborConsultCTA";

// 2025년 기준 요율
const RATES = {
  nationalPension: 0.045,       // 국민연금 4.5%
  healthInsurance: 0.03545,     // 건강보험 3.545%
  longTermCare: 0.1295,         // 장기요양 (건강보험의 12.95%)
  employmentInsurance: 0.009,   // 고용보험 0.9%
};

// 2025년 근로소득 간이세액표 정식 계산
// 국세청 간이세액표와 동일한 로직: 근로소득공제 → 인적공제 → 누진세 → 세액공제

function earnedIncomeDeduction(annual: number): number {
  if (annual <= 5_000_000) return Math.round(annual * 0.7);
  if (annual <= 15_000_000) return 3_500_000 + Math.round((annual - 5_000_000) * 0.4);
  if (annual <= 45_000_000) return 7_500_000 + Math.round((annual - 15_000_000) * 0.15);
  if (annual <= 100_000_000) return 12_000_000 + Math.round((annual - 45_000_000) * 0.05);
  return 14_750_000;
}

function progressiveTax(taxable: number): number {
  if (taxable <= 0) return 0;
  if (taxable <= 14_000_000) return Math.round(taxable * 0.06);
  if (taxable <= 50_000_000) return 840_000 + Math.round((taxable - 14_000_000) * 0.15);
  if (taxable <= 88_000_000) return 6_240_000 + Math.round((taxable - 50_000_000) * 0.24);
  if (taxable <= 150_000_000) return 15_360_000 + Math.round((taxable - 88_000_000) * 0.35);
  if (taxable <= 300_000_000) return 37_060_000 + Math.round((taxable - 150_000_000) * 0.38);
  return 94_060_000 + Math.round((taxable - 300_000_000) * 0.4);
}

function earnedTaxCredit(grossTax: number, annual: number): number {
  const credit = grossTax <= 1_300_000
    ? Math.round(grossTax * 0.55)
    : 715_000 + Math.round((grossTax - 1_300_000) * 0.3);
  const limit = annual <= 33_000_000 ? 740_000 : annual <= 70_000_000 ? 660_000 : 500_000;
  return Math.min(credit, limit);
}

function estimateIncomeTax(monthlyGross: number, dependents: number): number {
  const annual = monthlyGross * 12;
  const taxable = Math.max(0,
    annual - earnedIncomeDeduction(annual) - 1_500_000 * dependents
  );
  const grossTax = progressiveTax(taxable);
  const annualTax = Math.max(0, grossTax - earnedTaxCredit(grossTax, annual) - 130_000);
  return Math.floor(annualTax / 12 / 100) * 100; // 100원 미만 절사
}

export default function NetSalaryPage() {
  const [mode, setMode] = useState<"annual" | "monthly">("annual");
  const [amount, setAmount] = useState("");
  const [dependents, setDependents] = useState(1);
  const [result, setResult] = useState<{
    monthlyGross: number;
    pension: number;
    health: number;
    longTermCare: number;
    employment: number;
    incomeTax: number;
    localTax: number;
    totalDeduction: number;
    netSalary: number;
  } | null>(null);

  function calculate() {
    const raw = Number(amount);
    if (!raw) return;

    const monthlyGross = mode === "annual" ? Math.round(raw / 12) : raw;

    // 4대보험
    const pension = Math.round(monthlyGross * RATES.nationalPension);
    const health = Math.round(monthlyGross * RATES.healthInsurance);
    const longTermCare = Math.round(health * RATES.longTermCare);
    const employment = Math.round(monthlyGross * RATES.employmentInsurance);

    // 소득세: 2025년 간이세액표 정식 계산 (근로소득공제·세액공제 반영)
    const incomeTax = estimateIncomeTax(monthlyGross, dependents);
    const localTax = Math.round(incomeTax * 0.1); // 지방소득세 10%

    const totalDeduction = pension + health + longTermCare + employment + incomeTax + localTax;
    const netSalary = monthlyGross - totalDeduction;

    setResult({
      monthlyGross,
      pension,
      health,
      longTermCare,
      employment,
      incomeTax,
      localTax,
      totalDeduction,
      netSalary,
    });
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-1">급여 실수령액 계산기</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        연봉 또는 월급에서 4대보험·소득세를 공제한 실수령액을 계산합니다.
      </p>

      <div className="space-y-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-6">
        {/* 모드 선택 */}
        <div className="flex gap-2">
          {(["annual", "monthly"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                mode === m
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
              }`}
            >
              {m === "annual" ? "연봉" : "월급"}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {mode === "annual" ? "연봉 (세전)" : "월급 (세전)"}
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={mode === "annual" ? "36,000,000" : "3,000,000"}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 pr-10 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
              원
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            부양가족 수 (본인 포함)
          </label>
          <select
            value={dependents}
            onChange={(e) => setDependents(Number(e.target.value))}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n}명
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={calculate}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
        >
          계산하기
        </button>
      </div>

      {result && (
        <div className="mt-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6">
          <h3 className="font-bold text-lg text-blue-700 dark:text-blue-300 mb-4">
            월 실수령액
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">월 급여 (세전)</span>
              <span className="font-semibold">{result.monthlyGross.toLocaleString()}원</span>
            </div>
            <hr className="border-zinc-200 dark:border-zinc-700" />
            <div className="flex justify-between text-zinc-500">
              <span>국민연금 (4.5%)</span>
              <span>-{result.pension.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>건강보험 (3.545%)</span>
              <span>-{result.health.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>장기요양 (건강보험의 12.95%)</span>
              <span>-{result.longTermCare.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>고용보험 (0.9%)</span>
              <span>-{result.employment.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>소득세 (간이세액)</span>
              <span>-{result.incomeTax.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>지방소득세 (10%)</span>
              <span>-{result.localTax.toLocaleString()}원</span>
            </div>
            <hr className="border-zinc-200 dark:border-zinc-700" />
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">공제 합계</span>
              <span className="font-semibold text-red-500">
                -{result.totalDeduction.toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold mt-2">
              <span>월 실수령액</span>
              <span className="text-blue-600 dark:text-blue-400">
                {result.netSalary.toLocaleString()}원
              </span>
            </div>
            {mode === "annual" && (
              <div className="flex justify-between text-sm text-zinc-500 mt-1">
                <span>연 실수령액</span>
                <span>{(result.netSalary * 12).toLocaleString()}원</span>
              </div>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-4">
            * 2025년 근로소득 간이세액표 기준 (근로소득공제·세액공제 반영). 비과세 수당·상여 포함 시 실제와 소폭 차이 날 수 있습니다.
          </p>
        </div>
      )}


      <section className="mt-12 mb-4">
        <h2 className="text-xl font-bold mb-4">실수령액 FAQ</h2>
        <div className="space-y-3">
          <details className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800">
            <summary className="font-medium cursor-pointer">4대보험이란 무엇인가요?</summary>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">국민연금(4.5%), 건강보험(3.545%), 장기요양보험(건강보험료의 12.95%), 고용보험(0.9%)을 말합니다. 직장인은 회사와 절반씩 부담합니다.</p>
          </details>
          <details className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800">
            <summary className="font-medium cursor-pointer">소득세는 어떻게 계산되나요?</summary>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">근로소득공제 후 인적공제를 차감한 과세표준에 누진세율을 적용하고, 근로소득세액공제·표준세액공제를 빼서 산출합니다. 국세청 간이세액표 기준입니다.</p>
          </details>
          <details className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800">
            <summary className="font-medium cursor-pointer">연봉과 실수령액 차이가 큰 이유는?</summary>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">4대보험(약 9%)과 소득세·지방소득세가 공제되기 때문입니다. 연봉 5,000만원 기준 월 실수령액은 약 350만원 수준입니다.</p>
          </details>
          <details className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800">
            <summary className="font-medium cursor-pointer">부양가족 수에 따라 세금이 달라지나요?</summary>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">네, 부양가족 1인당 연 150만원의 인적공제가 적용됩니다. 부양가족이 많을수록 소득세가 줄어 실수령액이 높아집니다.</p>
          </details>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "급여 실수령액 계산기",
        description: "연봉·월급에서 4대보험·소득세 공제 후 실수령액을 계산합니다.",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
      }) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "4대보험이란 무엇인가요?", "acceptedAnswer": {"@type": "Answer", "text": "국민연금(4.5%), 건강보험(3.545%), 장기요양보험, 고용보험(0.9%)입니다. 직장인은 회사와 절반씩 부담합니다."}}, {"@type": "Question", "name": "부양가족 수에 따라 세금이 달라지나요?", "acceptedAnswer": {"@type": "Answer", "text": "네, 부양가족 1인당 연 150만원의 인적공제가 적용되어 소득세가 줄어듭니다."}}]}) }} />
            <KakaoAdFit unit="DAN-GrFB4TR5eJgi0FM1" width={320} height={100} />
      <LaborConsultCTA calc="net-salary" />
      <CoupangBanner />
    </>
  );
}
