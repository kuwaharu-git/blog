import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "A blog with like functionality",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
