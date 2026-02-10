import "../styles/globals.css";
import { I18nProvider } from "@/context/I18nContext";

export const metadata = {
  title: "E-Strategist - War Council",
  description: "Management interface inspired by classic fantasy RTS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=EB+Garamond:ital,wght@0,400;0,700;1,400;1,700&family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=JetBrains+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <I18nProvider>
          {/* Atmosphere Layers */}
          <div className="vignette-overlay" />
          <div className="dark-matter-texture" />
          
          <main className="relative z-0 min-h-screen">
            {children}
          </main>
        </I18nProvider>
      </body>
    </html>
  );
}
