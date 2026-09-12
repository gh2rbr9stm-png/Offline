import React, { useState } from "react";
import {
  Lock,
  Mail,
  User,
  Fingerprint,
  GraduationCap,
  X,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations";

export const AuthModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { user, setUser, language } = useApp();
  const t = getTranslation(language);

  // 'login' | 'register' | 'forgot'
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [school, setSchool] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (authMode === "forgot") {
        setSuccessMsg("Password reset link has been sent to your email.");
      } else {
        setUser((prev) => ({
          ...prev,
          name: name.trim() || prev.name,
          email: email.trim() || prev.email,
          school: school.trim() || prev.school,
        }));
        setSuccessMsg(authMode === "login" ? "Successfully logged in!" : "Account created successfully!");
        setTimeout(() => {
          onClose();
          setSuccessMsg("");
        }, 1200);
      }
    }, 600);
  };

  const handleBiometricLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg("Biometric verification verified. Welcome back!");
      setTimeout(() => {
        onClose();
        setSuccessMsg("");
      }, 1000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-6 h-6 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-100">
              Grade 09 Smart Learning Hub
            </span>
          </div>
          <h2 className="text-lg font-extrabold">
            {authMode === "login"
              ? "Welcome Back, Student!"
              : authMode === "register"
              ? "Create Grade 09 Account"
              : "Reset Your Password"}
          </h2>
          <p className="text-xs text-indigo-100/80 mt-1">
            Access your trilingual textbooks, AI teacher, and personal cloud notes
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {successMsg ? (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {authMode === "register" && (
              <>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Student Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Kavishan Thayalan"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    School / College
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="e.g. Jaffna Hindu College / Royal College"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {authMode !== "forgot" && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Password</label>
                  {authMode === "login" && (
                    <button
                      type="button"
                      onClick={() => setAuthMode("forgot")}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {loading ? (
                <Sparkles className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              <span>
                {authMode === "login"
                  ? "Sign In"
                  : authMode === "register"
                  ? "Create Free Account"
                  : "Send Reset Link"}
              </span>
            </button>
          </form>

          {/* Biometric Button */}
          {authMode === "login" && (
            <div className="pt-2">
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200 dark:border-slate-700 w-full" />
                <span className="bg-white dark:bg-slate-800 px-3 text-[10px] text-slate-400 uppercase font-bold absolute">
                  Or One-Touch
                </span>
              </div>

              <button
                onClick={handleBiometricLogin}
                disabled={loading}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Fingerprint className="w-4 h-4 text-emerald-500" />
                <span>Sign in with Biometrics / Touch ID</span>
              </button>
            </div>
          )}

          {/* Mode Switcher footer */}
          <div className="text-center pt-2 text-xs text-slate-500">
            {authMode === "login" ? (
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => setAuthMode("register")}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setAuthMode("login")}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
