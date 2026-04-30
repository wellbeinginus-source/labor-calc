import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const NAV_ITEMS = [
  { href: "/net-salary", label: "실수령액" },
  { href: "/severance", label: "퇴직금" },
  { href: "/insurance", label: "4대보험" },
  { href: "/annual-leave", label: "연차" },
  { href: "/weekly-holiday", label: "주휴수당" },
  { href: "/overtime", label: "연장·야간·휴일" },
];

export const metadata: Metadata = {
  metadataBase: new URL("https://labor-calc.vercel.app"),
  title: {
    default: "노동·급여 계산기 | 퇴직금·실수령액·연차·4대보험·주휴수당",
    template: "%s | 노동·급여 계산기",
  },
  description:
    "퇴직금, 급여 실수령액, 연차, 4대보험, 주휴수당, 연장근로수당을 무료로 계산하세요. 2025년 기준 최신 요율 반영.",
  keywords: [
    "퇴직금 계산기",
    "실수령액 계산기",
    "연차 계산기",
    "4대보험 계산기",
    "주휴수당 계산기",
    "연장근로수당",
    "급여 계산기",
    "월급 실수령액",
    "연봉 실수령액",
  ],
  openGraph: {
    title: "노동·급여 계산기 | 퇴직금·실수령액·연차·4대보험·주휴수당",
    description:
      "퇴직금, 실수령액, 연차, 4대보험, 주휴수당, 수당 계산을 한 곳에서.",
    type: "website",
    locale: "ko_KR",
    url: "https://labor-calc.vercel.app",
    siteName: "노동·급여 계산기",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta
          name="naver-site-verification"
          content="184c0c637db55b53d317c42dfe197e849129a7ce"
        />
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-6L251D0CYV"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-6L251D0CYV');
            `,
          }}
        />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3913442122539155"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100">
        {/* 헤더 */}
        <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 sticky top-0 z-50">
          <div className="max-w-3xl mx-auto px-4">
            <div className="h-14 flex items-center justify-between">
              <Link
                href="/"
                className="text-lg font-bold text-emerald-600 dark:text-emerald-400"
              >
                노동·급여 계산기
              </Link>
            </div>
            <nav className="flex gap-1 overflow-x-auto pb-2 -mx-1 scrollbar-hide">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {/* 메인 */}
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
          {children}
        </main>

        {/* 푸터 */}
        <footer className="border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
          <div className="max-w-3xl mx-auto px-4 py-6 text-center text-xs text-zinc-400 space-y-2">
            <p>2025년 기준 요율 적용 · 실제 금액과 차이가 있을 수 있으니 참고용으로만 활용하세요.</p>
            <div className="flex justify-center gap-4">
              <a href="https://auction-calc.vercel.app" className="hover:text-zinc-600">경매 계산기</a>
              <a href="https://tax-calc-five.vercel.app" className="hover:text-zinc-600">세금 계산기</a>
              <a href="https://realtrade-alert.vercel.app" className="hover:text-zinc-600">실거래가 알림</a>
            </div>
            <p>운영: 온기획(ON) | 이메일: js4yj@naver.com</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
