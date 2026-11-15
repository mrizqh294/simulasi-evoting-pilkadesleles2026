import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });

export const metadata: Metadata = { title: "Surat Suara – E-Voting", description: "Aplikasi e-voting pemilihan kepala desa" };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${roboto.className} min-h-full select-none bg-paper text-ink antialiased [-webkit-tap-highlight-color:transparent]`}>{children}</body>
    </html>
  );
}
