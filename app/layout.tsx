"use client"
import Header from "@/components/user/Header";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { SessionProvider } from "next-auth/react";
import Footer from "@/components/user/Footer";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <StoreProvider>
          <SessionProvider>
            <Header/>
            {children}
            <Footer/>
          </SessionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
