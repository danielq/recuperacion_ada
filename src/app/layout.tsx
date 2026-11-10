import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import UnivalleChrome from "@/components/UnivalleChrome";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Taller de Recuperación — Big O / Ω / Θ | Universidad del Valle",
  description:
    "ADA · Universidad del Valle · Recuperación de complejidad asintótica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${openSans.variable} antialiased`}>
        <UnivalleChrome>{children}</UnivalleChrome>
      </body>
    </html>
  );
}
