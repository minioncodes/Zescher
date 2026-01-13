"use client"
import Header from "@/components/user/Header";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { SessionProvider } from "next-auth/react";
import Footer from "@/components/user/Footer";
import FooterNav from "@/components/user/FooterNav";
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
            <FooterNav/>
          </SessionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
