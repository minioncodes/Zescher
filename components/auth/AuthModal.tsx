import { useAuthModal } from "@/context/AuthModalContext";
import { signIn } from "next-auth/react";

export default function AuthModal() {
  const { isOpen, closeAuthModal, onSuccess } = useAuthModal();

  if (!isOpen) return null;

  const handleSuccess = async () => {
    await signIn(); // OTP / Credentials handled internally
    closeAuthModal();
    onSuccess?.(); // 🔥 redirect callback
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 w-full max-w-md">
        {/* Your auth form here */}
        <button onClick={handleSuccess} className="w-full bg-black text-white p-2">
          Continue
        </button>
      </div>
    </div>
  );
}
