import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  HelpCircle,
  Layers,
  Bot,
  Calendar,
  Timer,
  FlaskConical,
  Wrench,
  Users,
  Star,
  CheckSquare,
  Settings,
  Flame,
  ChevronRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenSettings }) => {
  const { activeView, setActiveView, language, user, pdfFiles, notes } = useApp();
  const t = getTranslation(language);

  const navSections = [
    {
      label: "ACADEMICS",
      items: [
        { id: "dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
        { id: "subjects", label: t.nav.subjects, icon: BookOpen, badge: "13" },
      ],
    },
    {
      label: "STUDY LIBRARY",
      items: [
        { id: "pdf-library", label: t.nav.pdfLibrary, icon: FileText, badge: `${pdfFiles.length}` },
        { id: "notes", label: t.nav.notes, icon: FileText, badge: `${notes.length}` },
        { id: "quiz", label: t.nav.quizzes, icon: HelpCircle },
        { id: "flashcards", label: t.nav.flashcards, icon: Layers },
        { id: "favourites", label: t.nav.favourites, icon: Star },
      ],
    },
    {
      label: "SMART MENTOR & SCHEDULE",
      items: [
        { id: "ai-teacher", label: t.nav.aiTeacher, icon: Bot, isHighlight: true },
        { id: "timetable", label: t.nav.timetable, icon: Calendar },
        { id: "timer", label: t.nav.timer, icon: Timer },
        { id: "homework", label: t.nav.homework, icon: CheckSquare },
      ],
    },
    {
      label: "LABS & TOOLS",
      items: [
        { id: "science-lab", label: t.nav.scienceLab, icon: FlaskConical },
        { id: "tools", label: t.nav.tools, icon: Wrench },
        { id: "community", label: t.nav.community, icon: Users },
      ],
    },
  ];

  const handleNav = (id: string) => {
    setActiveView(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Aside container */}
      <aside
        id="app-sidebar"
        className={`fixed lg:sticky top-0 lg:top-14 left-0 z-50 lg:z-30 h-screen lg:h-[calc(100vh-3.5rem)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <span className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                {section.label}
              </span>
              <div className="space-y-0.5 pt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                          : item.isHighlight
                          ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/60"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 flex-shrink-0 ${
                            isActive
                              ? "text-white"
                              : item.isHighlight
                              ? "text-indigo-600 dark:text-indigo-400"
                              : "text-slate-500 dark:text-slate-400"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Student Card */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-indigo-500/30">
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                  {user.medium} Medium
                </p>
              </div>
            </div>
            <Settings className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
          </button>
        </div>
      </aside>
    </>
  );
};
