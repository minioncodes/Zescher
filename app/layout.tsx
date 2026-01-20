"use client";

import Header from "@/components/user/Header";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { SessionProvider } from "next-auth/react";
import Footer from "@/components/user/Footer";
import FooterNav from "@/components/user/FooterNav";
import { AuthModalProvider } from "@/context/AuthModalContext";
import AuthModal from "@/components/auth/AuthModal";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AuthModalProvider>
            <StoreProvider>
              <Header />
              {children}
              <Footer />
              <FooterNav />
              <AuthModal />
            </StoreProvider>
          </AuthModalProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
