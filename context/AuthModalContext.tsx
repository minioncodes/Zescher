"use client";

import { createContext, useContext, useState } from "react";

type AuthContextType = {
  isOpen: boolean;
  redirectTo: string | null;
  openAuthModal: (redirectTo?: string) => void;
  closeAuthModal: () => void;
};

const AuthModalContext = createContext<AuthContextType | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  const openAuthModal = (redirect?: string) => {
    if (redirect) setRedirectTo(redirect);
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
    setRedirectTo(null);
  };

  return (
    <AuthModalContext.Provider
      value={{ isOpen, redirectTo, openAuthModal, closeAuthModal }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return ctx;
}
