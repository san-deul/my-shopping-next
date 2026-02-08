"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./reset.css"
import "./global.css";
import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    const subscription = initAuth();

    // cleanup: 구독 해제
    return () => {
      subscription.then(sub => sub?.unsubscribe());
    };
  }, [initAuth]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}
