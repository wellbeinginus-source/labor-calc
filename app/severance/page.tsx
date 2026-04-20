"use client";

import { useState } from "react";
import type { Metadata } from "next";

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
    </>
  );
}
