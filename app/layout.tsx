import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foster Greatness Gingerbread House Contest 2025",
  description: "Join us in bringing 100 current and former foster youth together this holiday season for our virtual Gingerbread House Contest on December 19th.",
  openGraph: {
    title: "Foster Greatness Gingerbread House Contest 2025",
    description: "Join us in bringing 100 current and former foster youth together this holiday season for our virtual Gingerbread House Contest on December 19th.",
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
