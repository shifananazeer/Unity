import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthModalProps {
  type: "login" | "signup";
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ type, onClose }) => {
  const [isLogin, setIsLogin] = useState(type === "login");

  useEffect(() => {
    setIsLogin(type === "login");
  }, [type]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white w-[500px] max-h-[90vh] rounded-xl p-6 relative shadow-lg">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 text-xl"
        >
          ✕
        </button>

        {/* Logo */}
<div className="flex justify-center mb-3">
  <img
    src="/Unity Logo.jpeg"
    alt="Unity Logo"
    className="h-12 w-auto"
  />
</div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-1">
          Welcome to Unity
        </h2>

        {/* Toggle */}
        <div className="flex bg-gray-200 rounded-lg p-1 mb-5">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 rounded-md ${
              isLogin ? "bg-teal-700 text-white" : "text-gray-600"
            }`}
          >
            Log In
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 rounded-md ${
              !isLogin ? "bg-teal-700 text-white" : "text-gray-600"
            }`}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? <LoginForm onClose={onClose} /> : <SignupForm onClose={onClose} />}
      </div>
    </div>
  );
};

export default AuthModal;