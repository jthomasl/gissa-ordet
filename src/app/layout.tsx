import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gissa Ordet",
  description: "Ett svenskt ordgissningsspel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body className="bg-[#121213] text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
