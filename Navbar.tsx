import React, { useState } from "react";
import {
  Search,
  Moon,
  Sun,
  Flame,
  Globe,
  CloudCheck,
  CloudUpload,
  Bell,
  X,
  User,
  Settings,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations";
import { Language } from "../types";

export const Navbar: React.FC<{
  onOpenSettings: () => void;
  onOpenAuth: () => void;
}> = ({ onOpenSettings, onOpenAuth }) => {
  const {
    user,
    language,
    setLanguage,
    theme,
    setTheme,
    searchQuery,
    setSearchQuery,
    cloudSyncStatus,
    syncToCloud,
    notifications,
    dismissNotification,
    setActiveView,
  } = useApp();

  const t = getTranslation(language);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ta", label: "தமிழ்", flag: "🇱🇰" },
    { code: "si", label: "සිංහල", flag: "🇱🇰" },
  ];

  return (
    <header
      id="top-navbar"
      className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors"
    >
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 gap-3">
        {/* Left: Brand + Quick search */}
        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          <button
            onClick={() => setActiveView("dashboard")}
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">🎓</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xs font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                Grade 09 Hub
              </span>
              <h1 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                Smart Learning Hub
              </h1>
            </div>
          </button>

          {/* Search bar */}
          <div className="relative flex-1 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.common.search}
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-400 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Study Streak Badge */}
          <div
            id="streak-badge"
            title={`${user.streakDays} ${t.common.streak}! Keep it up.`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs font-semibold"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{user.streakDays}d</span>
          </div>

          {/* Cloud Sync Button */}
          <button
            id="cloud-sync-btn"
            onClick={() => syncToCloud()}
            title={cloudSyncStatus === "syncing" ? "Syncing to Cloud..." : "Synced to Cloud"}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <CloudUpload className={`w-3.5 h-3.5 text-emerald-500 ${cloudSyncStatus === "syncing" ? "animate-spin" : ""}`} />
            <span className="hidden lg:inline">{t.common.cloudSync}</span>
          </button>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              id="lang-dropdown-btn"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span className="font-semibold uppercase">{language}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                      language === l.code
                        ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span>{l.label}</span>
                    <span>{l.flag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Mode Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle Light/Dark Theme"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications button */}
          <div className="relative">
            <button
              id="notifications-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Notifications ({notifications.length})
                  </span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3 text-center">No new notifications</p>
                  ) : (
                    notifications.map((n, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-750 text-xs text-slate-700 dark:text-slate-200"
                      >
                        <p className="flex-1 leading-snug">{n}</p>
                        <button
                          onClick={() => dismissNotification(idx)}
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Student Profile Button */}
          <button
            id="student-profile-btn"
            onClick={onOpenSettings}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-800 transition-all cursor-pointer"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-500/50"
            />
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-100 leading-none">
                {user.name.split(" ")[0]}
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium leading-none">
                Gr. 09
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
