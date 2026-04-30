"use client";

import { useState } from "react";
import KakaoAdFit from "@/components/KakaoAdFit";
import { CoupangBanner } from "@/components/CoupangBanner";
import LaborConsultCTA from "@/components/LaborConsultCTA";

// 2025년 기준 요율
const RATES = {
  pension: { employee: 0.045, employer: 0.045, max: 5900000, min: 390000 },
  health: { employee: 0.03545, employer: 0.03545 },
  longTermCare: { rate: 0.1295 }, // 건강보험의 12.95%
  employment: {
    employee: 0.009,
    employer150: 0.009, // 150인 미만
    employer150plus: 0.009,
    employerStability150: 0.0025, // 고용안정·직업능력개발 (150인 미만)
    employerStability150plus: 0.0045,
    employerStability1000plus: 0.0065,
  },
  industrial: { average: 0.007 }, // 업종 평균
};

// 간이세액표 근사 (2025, 부양가족 포함 본인)
function estimateIncomeTax(monthlyGross: number, dependents: number, nonTaxable: number): number {
  const taxable = Math.max(monthlyGross - nonTaxable, 0);
  if (taxable <= 1060000) return 0;

  // 간이세액 근사 계산 (실제 간이세액표 기반 단순화)
  let tax = 0;
  if (taxable <= 1500000) tax = (taxable - 1060000) * 0.06;
  else if (taxable <= 3000000) tax = 26400 + (taxable - 1500000) * 0.15;
  else if (taxable <= 4500000) tax = 251400 + (taxable - 3000000) * 0.15;
  else if (taxable <= 7000000) tax = 476400 + (taxable - 4500000) * 0.24;
  else if (taxable <= 10000000) tax = 1076400 + (taxable - 7000000) * 0.35;
  else tax = 2126400 + (taxable - 10000000) * 0.38;

  // 부양가족 공제 (본인 포함이므로 dependents-1명 추가 공제)
  const deduction = Math.max(dependents - 1, 0) * 12500;
  tax = Math.max(tax - deduction, 0);

  return Math.round(tax);
}

type CompanySize = "under150" | "over150" | "over1000";

interface InsuranceResult {
  monthlyGross: number;
  nonTaxable: number;
  items: {
    label: string;
    rate: string;
    employee: number;
    employer: number;
  }[];
  incomeTax: number;
  localTax: number;
  totalEmployee: number;
  totalEmployer: number;
  netPay: number;
}

export default function InsurancePage() {
  const [mode, setMode] = useState<"monthly" | "annual">("monthly");
  const [salary, setSalary] = useState("");
  const [nonTaxable, setNonTaxable] = useState("200000");
  const [dependents, setDependents] = useState("1");
  const [companySize, setCompanySize] = useState<CompanySize>("under150");
  const [result, setResult] = useState<InsuranceResult | null>(null);

  function calculate() {
    const raw = Number(salary);
    if (!raw) return;

    const monthlyGross = mode === "annual" ? Math.round(raw / 12) : raw;
    const nonTax = Number(nonTaxable) || 0;
    const deps = Number(dependents) || 1;

    // 국민연금
    const pensionBase = Math.min(Math.max(monthlyGross, RATES.pension.min), RATES.pension.max);
    const pensionE = Math.round(pensionBase * RATES.pension.employee);
    const pensionR = Math.round(pensionBase * RATES.pension.employer);

    // 건강보험
    const healthE = Math.round(monthlyGross * RATES.health.employee);
    const healthR = Math.round(monthlyGross * RATES.health.employer);

    // 장기요양보험
    const longTermE = Math.round(healthE * RATES.longTermCare.rate);
    const longTermR = Math.round(healthR * RATES.longTermCare.rate);

    // 고용보험 (근로자)
    const employmentE = Math.round(monthlyGross * RATES.employment.employee);
    // 고용보험 (사업주 = 실업급여 + 고용안정)
    let employerStability = RATES.employment.employerStability150;
    if (companySize === "over1000") employerStability = RATES.employment.employerStability1000plus;
    else if (companySize === "over150") employerStability = RATES.employment.employerStability150plus;
    const employmentR = Math.round(monthlyGross * (RATES.employment.employer150 + employerStability));

    // 산재보험
    const industrialR = Math.round(monthlyGross * RATES.industrial.average);

    // 소득세 / 지방소득세
    const incomeTax = estimateIncomeTax(monthlyGross, deps, nonTax);
    const localTax = Math.round(incomeTax * 0.1);

    const items = [
      { label: "국민연금", rate: "4.5%", employee: pensionE, employer: pensionR },
      { label: "건강보험", rate: "3.545%", employee: healthE, employer: healthR },
      { label: "장기요양보험", rate: "건강의 12.95%", employee: longTermE, employer: longTermR },
      { label: "고용보험", rate: "0.9%", employee: employmentE, employer: employmentR },
      { label: "산재보험", rate: `평균 0.7%`, employee: 0, employer: industrialR },
    ];

    const totalEmployee = items.reduce((s, i) => s + i.employee, 0) + incomeTax + localTax;
    const totalEmployer = items.reduce((s, i) => s + i.employer, 0);
    const netPay = monthlyGross - totalEmployee;

    setResult({
      monthlyGross,
      nonTaxable: nonTax,
      items,
      incomeTax,
      localTax,
      totalEmployee,
      totalEmployer,
      netPay,
    });
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-1">4대보험 계산기</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        급여 기준 4대보험 + 소득세 공제 내역과 실수령액을 계산합니다. (2025년 요율)
      </p>

      <div className="space-y-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-6">
        {/* 연봉/월급 토글 */}
        <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          <button
            onClick={() => setMode("monthly")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === "monthly" ? "bg-orange-600 text-white" : "bg-white dark:bg-zinc-800 text-zinc-500"}`}
          >
            월급 기준
          </button>
          <button
            onClick={() => setMode("annual")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === "annual" ? "bg-orange-600 text-white" : "bg-white dark:bg-zinc-800 text-zinc-500"}`}
          >
            연봉 기준
          </button>
        </div>

        {/* 급여 입력 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {mode === "annual" ? "연봉" : "월 급여"} (세전)
          </label>
          <div className="relative">
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder={mode === "annual" ? "36,000,000" : "3,000,000"}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 pr-10 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">원</span>
          </div>
        </div>

        {/* 비과세액 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            비과세액 (식대 등)
          </label>
          <div className="relative">
            <input
              type="number"
              value={nonTaxable}
              onChange={(e) => setNonTaxable(e.target.value)}
              placeholder="200,000"
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 pr-10 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">원</span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            식대 월 20만원 비과세 (2025년 기준)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* 부양가족 수 */}
          <div>
            <label className="block text-sm font-medium mb-1">
              부양가족 수 (본인 포함)
            </label>
            <select
              value={dependents}
              onChange={(e) => setDependents(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => (
                <option key={n} value={n}>
                  {n}명
                </option>
              ))}
            </select>
          </div>

          {/* 회사 규모 */}
          <div>
            <label className="block text-sm font-medium mb-1">
              회사 규모
            </label>
            <select
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value as CompanySize)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="under150">150인 미만</option>
              <option value="over150">150인 이상</option>
              <option value="over1000">1,000인 이상</option>
            </select>
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-orange-700 dark:text-orange-300">
              공제 내역
            </h3>
            <span className="text-sm text-zinc-500">
              월 급여 {result.monthlyGross.toLocaleString()}원 기준
            </span>
          </div>

          {/* 4대보험 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-zinc-500 border-b border-orange-200 dark:border-orange-800">
                  <th className="text-left py-2 font-medium">항목</th>
                  <th className="text-right py-2 font-medium">요율</th>
                  <th className="text-right py-2 font-medium">근로자</th>
                  <th className="text-right py-2 font-medium">사업주</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((item) => (
                  <tr key={item.label} className="border-b border-orange-100 dark:border-orange-900">
                    <td className="py-2 text-zinc-600 dark:text-zinc-300">{item.label}</td>
                    <td className="py-2 text-right text-zinc-400 text-xs">{item.rate}</td>
                    <td className="py-2 text-right font-medium">
                      {item.employee > 0 ? `${item.employee.toLocaleString()}원` : "-"}
                    </td>
                    <td className="py-2 text-right font-medium">
                      {item.employer.toLocaleString()}원
                    </td>
                  </tr>
                ))}
                {/* 소득세 */}
                <tr className="border-b border-orange-100 dark:border-orange-900">
                  <td className="py-2 text-zinc-600 dark:text-zinc-300">소득세 (간이)</td>
                  <td className="py-2 text-right text-zinc-400 text-xs">간이세액</td>
                  <td className="py-2 text-right font-medium">{result.incomeTax.toLocaleString()}원</td>
                  <td className="py-2 text-right font-medium">-</td>
                </tr>
                <tr className="border-b border-orange-100 dark:border-orange-900">
                  <td className="py-2 text-zinc-600 dark:text-zinc-300">지방소득세</td>
                  <td className="py-2 text-right text-zinc-400 text-xs">소득세의 10%</td>
                  <td className="py-2 text-right font-medium">{result.localTax.toLocaleString()}원</td>
                  <td className="py-2 text-right font-medium">-</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="font-bold text-base border-t-2 border-orange-300 dark:border-orange-700">
                  <td className="py-3" colSpan={2}>공제 합계</td>
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

          {/* 실수령액 강조 */}
          <div className="mt-4 p-4 rounded-lg bg-white dark:bg-zinc-800 border border-orange-200 dark:border-orange-700">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">예상 실수령액</span>
              <span className="font-bold text-xl text-orange-600 dark:text-orange-400">
                {result.netPay.toLocaleString()}원
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 text-right">
              = {result.monthlyGross.toLocaleString()} - {result.totalEmployee.toLocaleString()} (공제)
            </p>
          </div>

          <p className="text-xs text-zinc-500 mt-4">
            * 2025년 기준 요율. 국민연금 상한 월 590만원 / 하한 39만원. 산재보험은 업종 평균(0.7%).
            소득세는 간이세액표 근사치이며 실제와 차이가 있을 수 있습니다.
          </p>
        </div>
      )}

      <LaborConsultCTA calc="insurance" />

      <section className="mt-12 mb-4">
        <h2 className="text-xl font-bold mb-4">4대보험 FAQ</h2>
        <div className="space-y-3">
          <details className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800">
            <summary className="font-medium cursor-pointer">4대보험 요율은 매년 바뀌나요?</summary>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">요율은 매년 정부 고시로 결정됩니다. 2025년 기준 국민연금 4.5%, 건강보험 3.545%, 고용보험 0.9%이며 장기요양은 건강보험료의 12.95%입니다.</p>
          </details>
          <details className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800">
            <summary className="font-medium cursor-pointer">비과세액이란 무엇인가요?</summary>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">급여 중 세금이 부과되지 않는 항목입니다. 대표적으로 식대(월 20만원), 자가운전보조금(월 20만원), 출산·보육수당(월 10만원) 등이 있습니다.</p>
          </details>
          <details className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800">
            <summary className="font-medium cursor-pointer">사업주 부담분은 얼마인가요?</summary>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">근로자 부담과 거의 같은 수준을 회사가 추가로 부담합니다. 고용보험은 회사 규모에 따라 사업주 부담이 달라지며, 산재보험은 전액 사업주 부담입니다.</p>
          </details>
          <details className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800">
            <summary className="font-medium cursor-pointer">국민연금 상·하한액은 얼마인가요?</summary>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">2025년 기준 국민연금 기준소득월액 상한은 590만원, 하한은 39만원입니다. 이 범위 밖의 급여는 상·하한액으로 적용됩니다.</p>
          </details>
          <details className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800">
            <summary className="font-medium cursor-pointer">일용직도 4대보험에 가입해야 하나요?</summary>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">1개월 이상, 월 8일 이상 근무하는 일용직은 고용보험·산재보험 가입이 의무입니다. 국민연금·건강보험은 조건이 다릅니다.</p>
          </details>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "4대보험 계산기",
        description: "월급 기준 국민연금·건강보험·고용보험료와 소득세를 자동 계산합니다.",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "4대보험 요율은 매년 바뀌나요?", "acceptedAnswer": {"@type": "Answer", "text": "매년 정부 고시로 결정됩니다. 2025년 기준 국민연금 4.5%, 건강보험 3.545%, 고용보험 0.9%입니다."}}, {"@type": "Question", "name": "국민연금 상한액은 얼마인가요?", "acceptedAnswer": {"@type": "Answer", "text": "2025년 기준 국민연금 보험료 부과 기준 상한 소득은 월 590만원입니다."}}]}) }} />
      <KakaoAdFit unit="DAN-GrFB4TR5eJgi0FM1" width={320} height={100} />
      <CoupangBanner />
    </>
  );
}
