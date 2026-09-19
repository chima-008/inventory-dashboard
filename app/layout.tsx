import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Inventory Dashboard",
    template: "%s | Inventory Dashboard",
  },
  description:
    "A modern inventory management dashboard for managing products, categories, stock, and business operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}