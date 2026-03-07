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
    const init = async () => {
      const subscription = await useAuthStore.getState().initAuth();
      return () => {
        subscription?.unsubscribe();
      };
    }
    init();
  }, []);

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
