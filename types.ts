// Core shared types for the Grade 09 Smart Learning Hub

export type Language = "en" | "ta" | "si";
export type ThemeMode = "light" | "dark";
export type ThemeAccent = "indigo" | "blue" | "purple" | "emerald" | "rose" | "amber";

export interface LocalizedText {
  en: string;
  ta: string;
  si: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  grade: string;
  school: string;
  medium: string;
  streakDays: number;
  totalStudyMinutes: number;
  quizzesCompleted: number;
  averageScore: number;
  biometricEnabled: boolean;
  role: string;
  joinedDate: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: LocalizedText;
  description: string;
  completed: boolean;
  topics: string[];
}

export interface Subject {
  id: string;
  code: string;
  name: LocalizedText;
  icon: string;
  color: string;
  totalChapters: number;
  completedChapters: number;
  description: string;
  chapters: Chapter[];
}

export interface Annotation {
  id: string;
  page: number;
  type: string;
  color: string;
  text: string;
  createdAt: string;
}

export interface PDFFile {
  id: string;
  title: string;
  subjectId: string;
  chapterId: string;
  folder: string;
  size: number;
  pageCount: number;
  lastReadPage: number;
  isFavourite: boolean;
  isBookmarked: boolean;
  isPersonalUpload: boolean;
  uploadedAt: string;
  tags: string[];
  bookmarks: number[];
  annotations: Annotation[];
  base64Data?: string;
}

export interface Note {
  id: string;
  title: string;
  subjectId: string;
  chapterId: string;
  topic: string;
  type: "short" | "full";
  isFavourite: boolean;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  content: string;
}

export interface QuizQuestion {
  id: string;
  type: "mcq" | "true_false" | "fill_blank";
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface QuizAttempt {
  id: string;
  date: string;
  quizTitle: string;
  subjectId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds: number;
  questions: QuizQuestion[];
}

export interface Flashcard {
  id: string;
  subjectId: string;
  chapterId: string;
  front: string;
  back: string;
  status: "new" | "hard" | "medium" | "easy" | "mastered";
  reviewCount: number;
  isFavourite: boolean;
  lastReviewed?: string;
}

export interface TimetableEntry {
  id: string;
  dayOfWeek: number;
  subjectId: string;
  startTime: string;
  endTime: string;
  topic: string;
  completed: boolean;
}

export interface DailyGoal {
  id: string;
  title: string;
  targetMinutes?: number;
  completed: boolean;
  category: "study" | "quiz" | "pdf" | "revision" | "notes";
  date: string;
}

export interface ExamEntry {
  id: string;
  subjectId: string;
  title: string;
  date: string;
  time: string;
  syllabusCoveredPercent: number;
  pastPapersAvailable: number;
  notes: string;
}

export interface HomeworkItem {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

export interface EducationalVideo {
  id: string;
  subjectId: string;
  title: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  channel: string;
  isFavourite: boolean;
  watched: boolean;
}

export interface ImportantQuestion {
  id: string;
  subjectId: string;
  question: string;
  answer: string;
  explanation: string;
  isFavourite: boolean;
  year: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}
