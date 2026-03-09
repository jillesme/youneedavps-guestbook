import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "youneedavps.com guestbook",
  description: "A minimal guestbook built with Next.js, Better Auth, and SQLite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
