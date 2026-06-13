// force rebuild
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// ⭐ Cache‑bust CSS so Vercel + browser load the NEW styles
import "./globals.css?v=10";

import Link from "next/link";
import { UserProvider, useUser } from "@/context/UserContext";  // ⭐ ADDED

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mmanwu Plaza",
  description: "The official Mmanwu social square",
};

// ⭐ HEADER COMPONENT (added inside layout)
function Header() {
  const { user } = useUser();

  return (
    <header className="w-full flex justify-between items-center px-4 py-4 mb-6 bg-white shadow-sm">
      <Link href="/" className="text-xl font-bold text-black">
        Mmanwu Plaza
      </Link>

      {user && (
        <Link
          href={`/creator/${user.id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          My Profile
        </Link>
      )}
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      {/* plaza-css-bust-10 */}
      <body className="min-h-screen flex flex-col items-center bg-white">
        <UserProvider>
          <div className="w-full max-w-xl px-4">

            {/* ⭐ NEW HEADER */}
            <Header />

            {children}
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
