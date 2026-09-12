import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import { AuthModal } from "./components/AuthModal";
import { SettingsView } from "./components/SettingsView";
import { AnalyticsProgress } from "./components/AnalyticsProgress";
import { Dashboard } from "./components/Dashboard";
import { SubjectHub } from "./components/SubjectHub";
import { PdfLibrary } from "./components/PdfLibrary";
import { NotesSystem } from "./components/NotesSystem";
import { QuizSystem } from "./components/QuizSystem";
import { FlashcardsView } from "./components/FlashcardsView";
import { AITeacher } from "./components/AITeacher";
import { TimetableGoals } from "./components/TimetableGoals";
import { ScienceLab } from "./components/ScienceLab";
import { ToolsHub } from "./components/ToolsHub";
import { CommunityHub } from "./components/CommunityHub";
import { ParentTeacherPortal } from "./components/ParentTeacherPortal";

const Shell: React.FC = () => {
  const { activeView, setActiveView, selectedPdfId, setSelectedPdfId, setSelectedSubjectId } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const openSettings = () => setActiveView("settings");

  const openPdf = (id: string) => {
    setSelectedPdfId(id);
    setActiveView("pdf-library");
  };
  const openSubject = (id: string) => {
    setSelectedSubjectId(id);
    setActiveView("subjects");
  };

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard onOpenPdf={openPdf} onOpenSubject={openSubject} />;
      case "subjects":
        return <SubjectHub onOpenPdf={openPdf} />;
      case "pdf-library":
        return <PdfLibrary />;
      case "notes":
        return <NotesSystem />;
      case "quiz":
        return <QuizSystem />;
      case "flashcards":
        return <FlashcardsView />;
      case "favourites":
        return <AnalyticsProgress />;
      case "ai-teacher":
        return <AITeacher />;
      case "timetable":
      case "timer":
      case "homework":
        return <TimetableGoals />;
      case "science-lab":
        return <ScienceLab />;
      case "tools":
        return <ToolsHub />;
      case "community":
        return <CommunityHub />;
      case "parent-portal":
        return <ParentTeacherPortal />;
      case "analytics":
        return <AnalyticsProgress />;
      case "settings":
        return <SettingsView />;
      default:
        return <Dashboard onOpenPdf={openPdf} onOpenSubject={openSubject} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar onOpenSettings={openSettings} onOpenAuth={() => setAuthOpen(true)} />
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenSettings={openSettings}
        />
        <main className="flex-1 min-w-0 p-4 lg:p-6">{renderView()}</main>
      </div>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
};

export const App: React.FC = () => (
  <AppProvider>
    <Shell />
  </AppProvider>
);

export default App;
