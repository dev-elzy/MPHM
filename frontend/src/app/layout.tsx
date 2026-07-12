import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MPHM - Madrasah Putri Hidayatul Mubtadi'at",
  description: "Sistem Informasi Akademik Madrasah Putri Hidayatul Mubtadi'at",
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased font-sans`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storageKey = 'mphm-theme';
                  var theme = localStorage.getItem(storageKey) || 'system';
                  var root = document.documentElement;
                  root.classList.remove('light', 'dark');
                  if (theme === 'system') {
                    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    root.classList.add(systemTheme);
                  } else {
                    root.classList.add(theme);
                  }
                } catch (e) {}
              })();
              window.e = window.e || function() {};
              window.__name = window.__name || function(f, n) { Object.defineProperty(f, 'name', { value: n, configurable: true }); return f; };
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
