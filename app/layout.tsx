import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smicha Program",
  description: "Online Smicha learning program",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZP9YZF877E" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-ZP9YZF877E');
        `}} />
      </head>
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
        <footer style={{ background: '#162B22', borderTop: '1px solid rgba(196,145,42,0.2)', padding: '1.25rem 2rem', textAlign: 'center' }}>
          <p style={{ color: '#6A8880', fontSize: '0.8rem', fontFamily: 'system-ui, sans-serif' }}>
            © {new Date().getFullYear()} Smicha Program. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
