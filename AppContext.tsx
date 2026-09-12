import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Language,
  ThemeMode,
  ThemeAccent,
  UserProfile,
  Subject,
  PDFFile,
  Note,
  QuizAttempt,
  Flashcard,
  TimetableEntry,
  DailyGoal,
  ExamEntry,
  HomeworkItem,
  EducationalVideo,
  ImportantQuestion,
  AchievementBadge,
  Annotation,
} from "../types";
import {
  grade9Subjects,
  initialPdfFiles,
  initialNotes,
  initialFlashcards,
  initialTimetable,
  initialGoals,
  initialExams,
  initialHomework,
  initialVideos,
  initialImportantQuestions,
  initialAchievements,
} from "../data/grade9Data";

interface AppContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  accent: ThemeAccent;
  setAccent: (a: ThemeAccent) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;
  selectedPdfId: string | null;
  setSelectedPdfId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Subjects
  subjects: Subject[];
  updateSubjectChapter: (subjectId: string, chapterId: string, completed: boolean) => void;

  // PDFs
  pdfFiles: PDFFile[];
  addPdfFile: (pdf: Omit<PDFFile, "id" | "uploadedAt" | "annotations" | "bookmarks"> & { id?: string; base64Data?: string }) => void;
  deletePdfFile: (id: string) => void;
  updatePdfFile: (id: string, updates: Partial<PDFFile>) => void;
  togglePdfFavourite: (id: string) => void;
  togglePdfBookmark: (id: string) => void;
  updatePdfProgress: (id: string, page: number) => void;
  addPdfAnnotation: (pdfId: string, annotation: Omit<Annotation, "id" | "createdAt">) => void;
  deletePdfAnnotation: (pdfId: string, annotationId: string) => void;

  // Notes
  notes: Note[];
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => string;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  toggleNoteFavourite: (id: string) => void;
  toggleNoteBookmark: (id: string) => void;

  // Quizzes
  quizHistory: QuizAttempt[];
  recordQuizAttempt: (attempt: Omit<QuizAttempt, "id" | "date">) => void;

  // Flashcards
  flashcards: Flashcard[];
  addFlashcard: (fc: Omit<Flashcard, "id" | "reviewCount">) => void;
  updateFlashcardStatus: (id: string, status: Flashcard["status"]) => void;
  toggleFlashcardFavourite: (id: string) => void;

  // Timetable & Goals
  timetable: TimetableEntry[];
  addTimetableEntry: (entry: Omit<TimetableEntry, "id">) => void;
  deleteTimetableEntry: (id: string) => void;
  toggleTimetableEntry: (id: string) => void;
  goals: DailyGoal[];
  addGoal: (goal: Omit<DailyGoal, "id" | "date">) => void;
  toggleGoal: (id: string) => void;
  deleteGoal: (id: string) => void;

  // Exams & Homework
  exams: ExamEntry[];
  homework: HomeworkItem[];
  toggleHomework: (id: string) => void;
  addHomework: (hw: Omit<HomeworkItem, "id">) => void;

  // Study Time & Streaks
  recordStudyMinutes: (minutes: number, subjectId?: string) => void;

  // Cloud Sync
  cloudSyncStatus: "synced" | "syncing" | "offline";
  syncToCloud: () => Promise<boolean>;
  restoreFromCloud: () => Promise<boolean>;

  // Media
  videos: EducationalVideo[];
  importantQuestions: ImportantQuestion[];
  achievements: AchievementBadge[];
  notifications: string[];
  dismissNotification: (index: number) => void;
}

const defaultUser: UserProfile = {
  id: "student-g9-01",
  name: "Kavishan Thayalan",
  email: "kavishan.grade9@school.lk",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  grade: "Grade 09 - Section A",
  school: "Jaffna Hindu College / Royal College Colombo",
  medium: "Tamil",
  streakDays: 7,
  totalStudyMinutes: 450,
  quizzesCompleted: 12,
  averageScore: 88,
  biometricEnabled: true,
  role: "student",
  joinedDate: "2026-01-10",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence helpers
  const getStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [user, setUser] = useState<UserProfile>(() => getStored("g9_user", defaultUser));
  const [language, setLanguageState] = useState<Language>(() => getStored("g9_lang", "en"));
  const [theme, setThemeState] = useState<ThemeMode>(() => getStored("g9_theme", "light"));
  const [accent, setAccentState] = useState<ThemeAccent>(() => getStored("g9_accent", "indigo"));
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedPdfId, setSelectedPdfId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [subjects, setSubjects] = useState<Subject[]>(() => getStored("g9_subjects", grade9Subjects));
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>(() => getStored("g9_pdfs", initialPdfFiles));
  const [notes, setNotes] = useState<Note[]>(() => getStored("g9_notes", initialNotes));
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>(() => getStored("g9_quizHistory", []));
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => getStored("g9_flashcards", initialFlashcards));
  const [timetable, setTimetable] = useState<TimetableEntry[]>(() => getStored("g9_timetable", initialTimetable));
  const [goals, setGoals] = useState<DailyGoal[]>(() => getStored("g9_goals", initialGoals));
  const [exams, setExams] = useState<ExamEntry[]>(() => getStored("g9_exams", initialExams));
  const [homework, setHomework] = useState<HomeworkItem[]>(() => getStored("g9_homework", initialHomework));
  const [videos] = useState<EducationalVideo[]>(initialVideos);
  const [importantQuestions] = useState<ImportantQuestion[]>(initialImportantQuestions);
  const [achievements, setAchievements] = useState<AchievementBadge[]>(() => getStored("g9_achievements", initialAchievements));
  const [cloudSyncStatus, setCloudSyncStatus] = useState<"synced" | "syncing" | "offline">("synced");
  const [notifications, setNotifications] = useState<string[]>([
    "🔔 Focus Reminder: Mathematics Quadratic equations review scheduled for 4:00 PM today.",
    "🏆 Achievement Unlocked: 7-Day Study Streak maintained!",
  ]);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("g9_user", JSON.stringify(user));
      localStorage.setItem("g9_lang", JSON.stringify(language));
      localStorage.setItem("g9_theme", JSON.stringify(theme));
      localStorage.setItem("g9_accent", JSON.stringify(accent));
      localStorage.setItem("g9_subjects", JSON.stringify(subjects));
      localStorage.setItem("g9_pdfs", JSON.stringify(pdfFiles));
      localStorage.setItem("g9_notes", JSON.stringify(notes));
      localStorage.setItem("g9_quizHistory", JSON.stringify(quizHistory));
      localStorage.setItem("g9_flashcards", JSON.stringify(flashcards));
      localStorage.setItem("g9_timetable", JSON.stringify(timetable));
      localStorage.setItem("g9_goals", JSON.stringify(goals));
      localStorage.setItem("g9_exams", JSON.stringify(exams));
      localStorage.setItem("g9_homework", JSON.stringify(homework));
      localStorage.setItem("g9_achievements", JSON.stringify(achievements));
    } catch (e) {
      console.warn("Storage quota or error saving local data:", e);
    }
  }, [user, language, theme, accent, subjects, pdfFiles, notes, quizHistory, flashcards, timetable, goals, exams, homework, achievements]);

  // Apply dark mode class to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const setLanguage = (lang: Language) => setLanguageState(lang);
  const setTheme = (t: ThemeMode) => setThemeState(t);
  const setAccent = (a: ThemeAccent) => setAccentState(a);

  // Subject update
  const updateSubjectChapter = (subjectId: string, chapterId: string, completed: boolean) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        const updatedChapters = sub.chapters.map((ch) => (ch.id === chapterId ? { ...ch, completed } : ch));
        const completedCount = updatedChapters.filter((c) => c.completed).length;
        return {
          ...sub,
          chapters: updatedChapters,
          completedChapters: completedCount,
        };
      })
    );
  };

  // PDF actions
  const addPdfFile = (pdf: Omit<PDFFile, "id" | "uploadedAt" | "annotations" | "bookmarks"> & { id?: string; base64Data?: string }) => {
    const newPdf: PDFFile = {
      ...pdf,
      id: pdf.id || `pdf-user-${Date.now()}`,
      uploadedAt: new Date().toISOString().split("T")[0],
      annotations: [],
      bookmarks: [1],
      isPersonalUpload: true,
      lastReadPage: 1,
      pageCount: pdf.pageCount || 10,
    };
    setPdfFiles((prev) => [newPdf, ...prev]);

    // Send to backend storage if base64Data is present
    if (newPdf.base64Data) {
      fetch("/api/pdf/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          file: newPdf,
        }),
      }).catch((err) => console.error("Cloud PDF upload error:", err));
    }
  };

  const deletePdfFile = (id: string) => {
    setPdfFiles((prev) => prev.filter((p) => p.id !== id));
    if (selectedPdfId === id) setSelectedPdfId(null);
    fetch(`/api/pdf/file/${user.id}/${id}`, { method: "DELETE" }).catch(() => {});
  };

  const updatePdfFile = (id: string, updates: Partial<PDFFile>) => {
    setPdfFiles((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const togglePdfFavourite = (id: string) => {
    setPdfFiles((prev) => prev.map((p) => (p.id === id ? { ...p, isFavourite: !p.isFavourite } : p)));
  };

  const togglePdfBookmark = (id: string) => {
    setPdfFiles((prev) => prev.map((p) => (p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p)));
  };

  const updatePdfProgress = (id: string, page: number) => {
    setPdfFiles((prev) => prev.map((p) => (p.id === id ? { ...p, lastReadPage: page } : p)));
  };

  const addPdfAnnotation = (pdfId: string, annotation: Omit<Annotation, "id" | "createdAt">) => {
    const newAnno: Annotation = {
      ...annotation,
      id: `anno-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setPdfFiles((prev) =>
      prev.map((p) => (p.id === pdfId ? { ...p, annotations: [...(p.annotations || []), newAnno] } : p))
    );
  };

  const deletePdfAnnotation = (pdfId: string, annotationId: string) => {
    setPdfFiles((prev) =>
      prev.map((p) =>
        p.id === pdfId ? { ...p, annotations: (p.annotations || []).filter((a) => a.id !== annotationId) } : p
      )
    );
  };

  // Notes actions
  const addNote = (noteData: Omit<Note, "id" | "createdAt" | "updatedAt">): string => {
    const id = `note-${Date.now()}`;
    const newNote: Note = {
      ...noteData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    return id;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleNoteFavourite = (id: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, isFavourite: !n.isFavourite } : n)));
  };

  const toggleNoteBookmark = (id: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, isBookmarked: !n.isBookmarked } : n)));
  };

  // Quizzes
  const recordQuizAttempt = (attemptData: Omit<QuizAttempt, "id" | "date">) => {
    const newAttempt: QuizAttempt = {
      ...attemptData,
      id: `attempt-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setQuizHistory((prev) => [newAttempt, ...prev]);

    // Update user stats
    setUser((u) => {
      const newCount = u.quizzesCompleted + 1;
      const newAvg = Math.round((u.averageScore * u.quizzesCompleted + attemptData.percentage) / newCount);
      return {
        ...u,
        quizzesCompleted: newCount,
        averageScore: newAvg,
      };
    });

    // Check achievement for 100% quiz
    if (attemptData.percentage === 100) {
      setAchievements((prev) =>
        prev.map((a) => (a.id === "ach-3" ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a))
      );
    }
  };

  // Flashcards
  const addFlashcard = (fcData: Omit<Flashcard, "id" | "reviewCount">) => {
    const newFc: Flashcard = {
      ...fcData,
      id: `fc-${Date.now()}`,
      reviewCount: 0,
    };
    setFlashcards((prev) => [newFc, ...prev]);
  };

  const updateFlashcardStatus = (id: string, status: Flashcard["status"]) => {
    setFlashcards((prev) =>
      prev.map((fc) =>
        fc.id === id
          ? {
              ...fc,
              status,
              reviewCount: fc.reviewCount + 1,
              lastReviewed: new Date().toISOString(),
            }
          : fc
      )
    );
  };

  const toggleFlashcardFavourite = (id: string) => {
    setFlashcards((prev) => prev.map((fc) => (fc.id === id ? { ...fc, isFavourite: !fc.isFavourite } : fc)));
  };

  // Timetable
  const addTimetableEntry = (entry: Omit<TimetableEntry, "id">) => {
    const newEntry: TimetableEntry = { ...entry, id: `tt-${Date.now()}` };
    setTimetable((prev) => [...prev, newEntry]);
  };

  const deleteTimetableEntry = (id: string) => {
    setTimetable((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTimetableEntry = (id: string) => {
    setTimetable((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  // Goals
  const addGoal = (goal: Omit<DailyGoal, "id" | "date">) => {
    const newGoal: DailyGoal = {
      ...goal,
      id: `g-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
    };
    setGoals((prev) => [newGoal, ...prev]);
  };

  const toggleGoal = (id: string) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)));
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Homework
  const toggleHomework = (id: string) => {
    setHomework((prev) => prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h)));
  };

  const addHomework = (hw: Omit<HomeworkItem, "id">) => {
    setHomework((prev) => [{ ...hw, id: `hw-${Date.now()}` }, ...prev]);
  };

  // Study Minutes
  const recordStudyMinutes = (minutes: number) => {
    setUser((u) => ({
      ...u,
      totalStudyMinutes: u.totalStudyMinutes + minutes,
    }));
  };

  // Cloud Sync API integration
  const syncToCloud = async (): Promise<boolean> => {
    setCloudSyncStatus("syncing");
    try {
      const payload = {
        user,
        subjects,
        pdfFiles: pdfFiles.map(({ base64Data, ...rest }) => rest), // Keep sync payload lightweight
        notes,
        quizHistory,
        flashcards,
        timetable,
        goals,
        exams,
        homework,
      };

      const res = await fetch("/api/cloud-backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, payload }),
      });

      if (res.ok) {
        setCloudSyncStatus("synced");
        return true;
      }
      setCloudSyncStatus("offline");
      return false;
    } catch {
      setCloudSyncStatus("offline");
      return false;
    }
  };

  const restoreFromCloud = async (): Promise<boolean> => {
    setCloudSyncStatus("syncing");
    try {
      const res = await fetch(`/api/cloud-backup/${user.id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          if (json.data.user) setUser(json.data.user);
          if (json.data.notes) setNotes(json.data.notes);
          if (json.data.flashcards) setFlashcards(json.data.flashcards);
          if (json.data.timetable) setTimetable(json.data.timetable);
          if (json.data.goals) setGoals(json.data.goals);
          if (json.data.quizHistory) setQuizHistory(json.data.quizHistory);
          setCloudSyncStatus("synced");
          return true;
        }
      }
      setCloudSyncStatus("synced");
      return false;
    } catch {
      setCloudSyncStatus("offline");
      return false;
    }
  };

  const dismissNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        language,
        setLanguage,
        theme,
        setTheme,
        accent,
        setAccent,
        activeView,
        setActiveView,
        selectedSubjectId,
        setSelectedSubjectId,
        selectedPdfId,
        setSelectedPdfId,
        searchQuery,
        setSearchQuery,
        subjects,
        updateSubjectChapter,
        pdfFiles,
        addPdfFile,
        deletePdfFile,
        updatePdfFile,
        togglePdfFavourite,
        togglePdfBookmark,
        updatePdfProgress,
        addPdfAnnotation,
        deletePdfAnnotation,
        notes,
        addNote,
        updateNote,
        deleteNote,
        toggleNoteFavourite,
        toggleNoteBookmark,
        quizHistory,
        recordQuizAttempt,
        flashcards,
        addFlashcard,
        updateFlashcardStatus,
        toggleFlashcardFavourite,
        timetable,
        addTimetableEntry,
        deleteTimetableEntry,
        toggleTimetableEntry,
        goals,
        addGoal,
        toggleGoal,
        deleteGoal,
        exams,
        homework,
        toggleHomework,
        addHomework,
        recordStudyMinutes,
        cloudSyncStatus,
        syncToCloud,
        restoreFromCloud,
        videos,
        importantQuestions,
        achievements,
        notifications,
        dismissNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
