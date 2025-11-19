import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Holiday Gift Drive 2025 | Foster Greatness",
  description: "Help make the holidays special for Foster Greatness community members. Choose a gift from our interactive Christmas tree and create connection through giving.",
  openGraph: {
    title: "Holiday Gift Drive 2025 | Foster Greatness",
    description: "Help make the holidays special for Foster Greatness community members. Choose a gift and create connection through giving.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-century">{children}</body>
    </html>
  );
}
