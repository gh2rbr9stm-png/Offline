import React, { useState } from "react";
import {
  Settings,
  User,
  Shield,
  Cloud,
  Download,
  Upload,
  Moon,
  Sun,
  Globe,
  Fingerprint,
  RotateCcw,
  CheckCircle,
  Database,
  HardDrive,
  LogOut,
  Save,
} from "lucide-react";
import { useApp } from "./AppContext";
import { getTranslation } from "../translations";

export const SettingsView: React.FC = () => {
  const {
    user,
    setUser,
    theme,
    setTheme,
    language,
    setLanguage,
    cloudSyncStatus,
    syncToCloud,
    pdfFiles,
    notes,
  } = useApp();

  const t = getTranslation(language);

  // Edit profile form
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [school, setSchool] = useState(user.school);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Avatar choices
  const avatarChoices = [
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name,
      email,
      school,
    }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const backupData = {
      user,
      notes,
      pdfFiles,
      exportDate: new Date().toISOString(),
      app: "Grade 09 Smart Learning Hub",
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Grade09_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div id="settings-page" className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-indigo-600" />
          {t.nav.settings} & Cloud Database Synchronization
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage student profile, multi-language preferences, biometric authentication & cloud backups
        </p>
      </div>

      {/* 1. PROFILE & AVATAR SETTINGS */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
          <User className="w-4 h-4 text-indigo-500" />
          Student Profile Details
        </h2>

        {/* Avatar Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
            Select Student Avatar:
          </label>
          <div className="flex items-center gap-3">
            {avatarChoices.map((av, idx) => (
              <img
                key={idx}
                src={av}
                alt="Avatar option"
                onClick={() => setUser((prev) => ({ ...prev, avatar: av }))}
                className={`w-12 h-12 rounded-2xl object-cover cursor-pointer transition-all hover:scale-105 ${
                  user.avatar === av
                    ? "ring-4 ring-indigo-600 ring-offset-2 dark:ring-offset-slate-900"
                    : "opacity-60 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                School Name
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Grade Level
              </label>
              <input
                type="text"
                disabled
                value="Grade 09 National Curriculum"
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-750/50 border border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saveSuccess ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Profile changes saved!
              </span>
            ) : (
              <span />
            )}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. SECURITY & BIOMETRIC AUTH */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
          <Fingerprint className="w-4 h-4 text-emerald-500" />
          Security & Biometric Authentication
        </h2>

        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Biometric Quick Login (Fingerprint / Face ID)
            </span>
            <span className="text-[11px] text-slate-400">
              Where supported by browser/device WebAuthn API
            </span>
          </div>

          <button
            onClick={() => setBiometricEnabled(!biometricEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              biometricEnabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                biometricEnabled ? "right-0.5" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* 3. CLOUD BACKUP & DATABASE PERSISTENCE */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
          <Cloud className="w-4 h-4 text-blue-500" />
          Private Cloud Storage & Automatic Sync
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">
              Private Cloud Storage Quota
            </span>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>{pdfFiles.length} User PDFs ({(pdfFiles.reduce((acc, p) => acc + p.size, 0) / (1024 * 1024)).toFixed(1)} MB)</span>
              <span>1.0 GB Available</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full w-[4%]" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 space-y-2 flex flex-col justify-between">
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block">
                Database Synchronization
              </span>
              <span className="text-[11px] text-slate-400">
                Status: {cloudSyncStatus === "synced" ? "All notes & files up to date in cloud" : cloudSyncStatus}
              </span>
            </div>
            <button
              onClick={() => syncToCloud()}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs self-start cursor-pointer"
            >
              Sync Now with Cloud Database
            </button>
          </div>
        </div>

        {/* Data Export & Reset */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleExportBackup}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-750 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Complete Backup (JSON)</span>
          </button>

          <button
            onClick={() => {
              if (confirm("Reset application data back to default Grade 09 curriculum state?")) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Curriculum Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
