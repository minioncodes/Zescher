"use client"
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { SessionProvider } from "next-auth/react";
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
            {children}
          </SessionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
