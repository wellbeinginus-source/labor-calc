interface Props {
  calc: string;
}

export default function LaborConsultCTA({ calc }: Props) {
  const url = process.env.NEXT_PUBLIC_LABOR_CONSULT_URL;
  if (!url) return null;

  const finalUrl = url.startsWith("http")
    ? `${url}${url.includes("?") ? "&" : "?"}source=labor-calc&calc=${calc}`
    : url;

  return (
    <section className="mt-6 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-5">
      <h3 className="font-bold text-sm mb-1 text-emerald-700 dark:text-emerald-300">
        결과가 정확한지 궁금하신가요?
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-3">
        실제 받으신 금액이 계산 결과와 다르거나, 미지급 의심이 든다면 노무사 1:1 상담을 받아보세요.
      </p>
      <a
        href={finalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors"
      >
        노무사 상담 안내 →
      </a>
    </section>
  );
}
