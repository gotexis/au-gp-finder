import type { Metadata } from "next";
import "./globals.css";
import JsonLd from "@/components/JsonLd";

const SITE_TITLE = "AU GP Finder";
const SITE_DESC = "Find GP clinics, doctors and Medicare offices across Australia. 2,700+ clinics with maps, hours and contact details.";
const SITE_URL = "https://gp.rollersoft.com.au";

export const metadata: Metadata = {
  title: { default: SITE_TITLE, template: `%s | ${SITE_TITLE}` },
  description: SITE_DESC,
  openGraph: { title: SITE_TITLE, description: SITE_DESC, url: SITE_URL, siteName: SITE_TITLE, locale: "en_AU", type: "website" },
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="emerald">
      <head>
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_TITLE,
          url: SITE_URL,
          description: SITE_DESC,
        }} />
      </head>
      <body className="min-h-screen bg-slate-50 flex flex-col">
        <header className="navbar bg-emerald-700 text-white shadow-lg">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <a className="text-xl font-bold flex items-center gap-2" href="/">
              <span className="text-2xl">🏥</span> {SITE_TITLE}
            </a>
            <nav className="hidden sm:flex gap-4 text-sm">
              <a href="/#states" className="hover:underline">Browse by State</a>
              <a href="/#map" className="hover:underline">Map</a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-slate-800 text-slate-300 py-8">
          <div className="container mx-auto px-4 text-center text-sm">
            <p>© {new Date().getFullYear()} AU GP Finder. Data from <a href="https://www.openstreetmap.org" className="underline">OpenStreetMap</a> contributors (ODbL).</p>
            <p className="mt-1">A <a href="https://rollersoft.com.au" className="underline">Rollersoft</a> project.</p>
            <p className="mt-2 text-xs text-slate-500">Beta: Currently listing 2,700+ clinics. Data coverage expanding.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
