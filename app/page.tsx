import Link from "next/link";
import KakaoAdFit from "@/components/KakaoAdFit";
import { CoupangBanner } from "@/components/CoupangBanner";

const CALCULATORS = [
  {
    href: "/net-salary",
    title: "실수령액 계산기",
    desc: "연봉·월급에서 4대보험·소득세 공제 후 실수령액",
    color: "bg-blue-600",
  },
  {
    href: "/severance",
    title: "퇴직금 계산기",
    desc: "입사일·퇴사일·평균임금으로 법정 퇴직금 계산",
    color: "bg-emerald-600",
  },
  {
    href: "/insurance",
    title: "4대보험 계산기",
    desc: "국민연금·건강보험·고용보험·산재보험 근로자·사업주 부담금",
    color: "bg-orange-600",
  },
  {
    href: "/annual-leave",
    title: "연차 계산기",
    desc: "입사일 기준 법정 연차 일수 자동 계산",
    color: "bg-violet-600",
  },
  {
    href: "/weekly-holiday",
    title: "주휴수당 계산기",
    desc: "주 근무시간·시급으로 주휴수당 및 월 환산액",
    color: "bg-rose-600",
  },
  {
    href: "/overtime",
    title: "연장·야간·휴일 수당",
    desc: "시급·근무시간별 연장·야간·휴일 할증 수당 계산",
    color: "bg-cyan-600",
  },
];

export default function Home() {
  return (
    <>
      {/* 히어로 */}
      <section className="rounded-2xl bg-emerald-600 p-6 text-white mb-6">
        <p className="text-sm text-emerald-200 mb-1">무료 노동·급여</p>
        <h2 className="text-xl font-bold mb-2">
          퇴직금, 실수령액, 연차
          <br />
          한 곳에서 바로 계산
        </h2>
        <p className="text-sm text-emerald-200 leading-relaxed">
          2025년 최신 요율 반영. 4대보험, 주휴수당, 연장근로수당까지.
        </p>
      </section>

      {/* 계산기 그리드 */}
      <div className="grid sm:grid-cols-2 gap-4">
        {CALCULATORS.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="group block rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-5 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-600 transition-all"
          >
            <div
              className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold text-white mb-3 ${calc.color}`}
            >
              계산기
            </div>
            <h3 className="font-bold text-base mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {calc.title}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {calc.desc}
            </p>
          </Link>
        ))}
      </div>

      <KakaoAdFit unit="DAN-GrFB4TR5eJgi0FM1" width={320} height={100} />

      {/* 안내 */}
      <section className="mt-8 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-5">
        <h3 className="font-bold text-sm mb-3">이런 분께 추천해요</h3>
        <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
          <li>퇴직금이 제대로 계산됐는지 확인하고 싶은 분</li>
          <li>연봉 협상 전 실수령액을 미리 알고 싶은 분</li>
          <li>알바·파트타임 주휴수당이 궁금한 분</li>
          <li>야근·휴일 수당이 제대로 나오는지 확인하고 싶은 분</li>
        </ul>
      </section>

      <CoupangBanner />
    </>
  );
}
