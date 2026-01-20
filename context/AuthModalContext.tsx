"use client";

import { createContext, useContext, useState } from "react";

type AuthContextType = {
  isOpen: boolean;
  openAuthModal: (onSuccess?: () => void) => void;
  closeAuthModal: () => void;
  onSuccess?: () => void;
};

const AuthModalContext = createContext<AuthContextType | null>(null);

export const AuthModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [onSuccess, setOnSuccess] = useState<(() => void) | undefined>();

  const openAuthModal = (callback?: () => void) => {
    setOnSuccess(() => callback);
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
    setOnSuccess(undefined);
  };

  return (
    <AuthModalContext.Provider
      value={{ isOpen, openAuthModal, closeAuthModal, onSuccess }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used inside provider");
  return ctx;
};
