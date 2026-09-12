import React, { useState, useEffect } from "react";
import {
  Flame,
  Clock,
  CheckCircle2,
  Circle,
  Calendar,
  Award,
  BookOpen,
  FileText,
  HelpCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Plus,
  Play,
  Bot,
  Layers,
  Upload,
  AlertCircle,
  ChevronRight,
  Star,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations";

export const Dashboard: React.FC<{
  onOpenPdf: (id: string) => void;
  onOpenSubject: (id: string) => void;
}> = ({ onOpenPdf, onOpenSubject }) => {
  const {
    user,
    language,
    subjects,
    pdfFiles,
    notes,
    goals,
    toggleGoal,
    timetable,
    exams,
    homework,
    quizHistory,
    achievements,
    setActiveView,
  } = useApp();

  const t = getTranslation(language);

  // Live Date and Time
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Today's schedule calculation
  const currentDayOfWeek = currentDateTime.getDay();
  const todaySchedule = timetable.filter((item) => item.dayOfWeek === currentDayOfWeek);

  // Overall syllabus progress
  const totalChapters = subjects.reduce((sum, s) => sum + s.totalChapters, 0);
  const completedChapters = subjects.reduce((sum, s) => sum + s.completedChapters, 0);
  const progressPercent = Math.round((completedChapters / totalChapters) * 100);

  // Weak subjects (e.g. subjects with lowest completion rate or below 50%)
  const weakSubjects = [...subjects]
    .sort((a, b) => a.completedChapters / a.totalChapters - b.completedChapters / b.totalChapters)
    .slice(0, 3);

  // Recent PDFs & Notes
  const recentPdfs = pdfFiles.slice(0, 3);
  const recentNotes = notes.slice(0, 3);

  // Formatted date string
  const dateFormatted = currentDateTime.toLocaleDateString(
    language === "ta" ? "ta-LK" : language === "si" ? "si-LK" : "en-US",
    { weekday: "long", year: "numeric", month: "short", day: "numeric" }
  );
  const timeFormatted = currentDateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div id="dashboard-view" className="space-y-6 pb-12">
      {/* 1. Welcome Banner & Greeting */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 p-6 text-white shadow-xl shadow-indigo-500/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-white/20 text-[11px] font-bold tracking-wide uppercase">
                {user.grade}
              </span>
              <span className="text-xs text-indigo-100 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {timeFormatted} • {dateFormatted}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.common.welcome}, {user.name}! 🌟
            </h1>
            <p className="text-sm text-indigo-100 mt-1 max-w-xl">
              {t.tagline}
            </p>
          </div>

          {/* Quick Action Pills in Header */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="dash-quick-ai"
              onClick={() => setActiveView("ai-teacher")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Bot className="w-4 h-4 text-indigo-600" />
              <span>{t.dashboard.askAI}</span>
            </button>
            <button
              id="dash-quick-timer"
              onClick={() => setActiveView("timer")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/40 text-white text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>{t.dashboard.startPomodoro}</span>
            </button>
            <button
              id="dash-quick-quiz"
              onClick={() => setActiveView("quiz")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/40 text-white text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{t.dashboard.quickQuiz}</span>
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-8 -bottom-8 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* 2. Top Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Streak Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
            <Flame className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {t.dashboard.studyStreak}
            </span>
            <span className="text-xl font-extrabold text-slate-800 dark:text-white">
              {user.streakDays} Days
            </span>
          </div>
        </div>

        {/* Total Study Minutes */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {t.dashboard.studyTime}
            </span>
            <span className="text-xl font-extrabold text-slate-800 dark:text-white">
              {Math.floor(user.totalStudyMinutes / 60)}h {user.totalStudyMinutes % 60}m
            </span>
          </div>
        </div>

        {/* Syllabus Progress */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {t.dashboard.overallProgress}
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 mt-1.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quiz Performance */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Avg Quiz Score
            </span>
            <span className="text-xl font-extrabold text-slate-800 dark:text-white">
              {user.averageScore}%
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Split Section: Today's Schedule & Daily Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Goals (1 col) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {t.dashboard.dailyGoals}
            </h2>
            <span className="text-xs font-bold text-slate-400">
              {goals.filter((g) => g.completed).length} / {goals.length}
            </span>
          </div>

          <div className="space-y-2 flex-1">
            {goals.map((goal) => (
              <div
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  goal.completed
                    ? "bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/40 opacity-70"
                    : "bg-white dark:bg-slate-750 border-slate-200 dark:border-slate-700 hover:border-indigo-400"
                }`}
              >
                {goal.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
                <span
                  className={`text-xs font-medium leading-tight ${
                    goal.completed ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-100"
                  }`}
                >
                  {goal.title}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveView("timetable")}
            className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-between hover:underline cursor-pointer"
          >
            <span>Manage Study Goals & Habits</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Today's Schedule (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                {t.dashboard.todaySchedule}
              </h2>
              <button
                onClick={() => setActiveView("timetable")}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Full Timetable
              </button>
            </div>

            {todaySchedule.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700">
                <Calendar className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">
                  No scheduled study blocks for today. Plan a focus session!
                </p>
                <button
                  onClick={() => setActiveView("timetable")}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
                >
                  Add Study Session
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {todaySchedule.map((item) => {
                  const sub = subjects.find((s) => s.id === item.subjectId);
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-750 flex items-start justify-between"
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: sub?.color || "#6366F1" }}
                        >
                          {sub?.name.en.charAt(0) || "S"}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {sub?.name[language] || item.subjectId}
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium">{item.topic}</p>
                          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                            {item.startTime} - {item.endTime}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          item.completed
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                        }`}
                      >
                        {item.completed ? "Done" : "Upcoming"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Focus prompt */}
          <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-750 dark:to-indigo-950/40 border border-blue-100 dark:border-indigo-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Want to build memory? Try a <strong>25-minute Pomodoro</strong> with ambient sounds.
              </span>
            </div>
            <button
              onClick={() => setActiveView("timer")}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
            >
              Start
            </button>
          </div>
        </div>
      </div>

      {/* 4. Subject Navigation Grid (13 Grade 09 Subjects) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Grade 09 Subjects & Curriculum (13 Subjects)
            </h2>
            <p className="text-xs text-slate-400">
              Access PDF textbooks, short notes, past papers, quizzes, and flashcards by subject
            </p>
          </div>
          <button
            onClick={() => setActiveView("subjects")}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            {t.common.viewAll}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {subjects.map((sub) => {
            const completion = Math.round((sub.completedChapters / sub.totalChapters) * 100);
            return (
              <button
                key={sub.id}
                onClick={() => onOpenSubject(sub.id)}
                className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/70 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-750 hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm"
                    style={{ backgroundColor: sub.color }}
                  >
                    {sub.code.split("-")[0]}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    {sub.completedChapters}/{sub.totalChapters}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-1">
                    {sub.name[language] || sub.name.en}
                  </h3>
                  <div className="w-full h-1 rounded-full bg-slate-200 dark:bg-slate-700 mt-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${completion}%`, backgroundColor: sub.color }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Split Row: Recent PDFs & Recent Short Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent PDFs */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                {t.dashboard.recentPdfs}
              </h2>
              <button
                onClick={() => setActiveView("pdf-library")}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Open PDF Library
              </button>
            </div>

            <div className="space-y-2.5">
              {recentPdfs.map((pdf) => {
                const sub = subjects.find((s) => s.id === pdf.subjectId);
                return (
                  <div
                    key={pdf.id}
                    onClick={() => onOpenPdf(pdf.id)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-750 flex items-center justify-between cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        PDF
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                          {pdf.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {sub?.name[language] || pdf.subjectId} • Last read: Page {pdf.lastReadPage} of {pdf.pageCount}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setActiveView("pdf-library")}
            className="mt-4 w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Your Personal PDF</span>
          </button>
        </div>

        {/* Recent Notes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" />
                {t.dashboard.recentNotes}
              </h2>
              <button
                onClick={() => setActiveView("notes")}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                All Notes
              </button>
            </div>

            <div className="space-y-2.5">
              {recentNotes.map((note) => {
                const sub = subjects.find((s) => s.id === note.subjectId);
                return (
                  <div
                    key={note.id}
                    onClick={() => setActiveView("notes")}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-750 flex items-center justify-between cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                        style={{ backgroundColor: sub?.color || "#6366F1" }}
                      >
                        {sub?.name.en.charAt(0) || "N"}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                          {note.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {sub?.name[language] || note.subjectId} • {note.type === "short" ? "Short Note" : "Full Note"}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setActiveView("notes")}
            className="mt-4 w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Study Note</span>
          </button>
        </div>
      </div>

      {/* 6. Upcoming Exams & Homework reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exams (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              {t.dashboard.upcomingExams} & Countdown
            </h2>
            <button
              onClick={() => setActiveView("homework")}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Exams Archive
            </button>
          </div>

          <div className="space-y-3">
            {exams.map((exam) => {
              const sub = subjects.find((s) => s.id === exam.subjectId);
              const daysLeft = Math.ceil((new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
              return (
                <div
                  key={exam.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      {sub?.name[language] || exam.subjectId}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{exam.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {exam.date} at {exam.time} • Syllabus prepared: {exam.syllabusCoveredPercent}%
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-extrabold text-xs">
                      {daysLeft > 0 ? `${daysLeft} Days Left` : "Today"}
                    </span>
                    <button
                      onClick={() => setActiveView("quiz")}
                      className="px-2.5 py-1 text-xs rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 cursor-pointer"
                    >
                      Practice
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Homework Items (1 col) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-500" />
              Homework Tracker
            </h2>
            <button
              onClick={() => setActiveView("homework")}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              View
            </button>
          </div>

          <div className="space-y-2">
            {homework.map((hw) => {
              const sub = subjects.find((s) => s.id === hw.subjectId);
              return (
                <div
                  key={hw.id}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50/40 dark:bg-slate-750 text-xs flex items-start gap-2.5"
                >
                  <span
                    className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                    style={{ backgroundColor: sub?.color || "#6366F1" }}
                  />
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{hw.title}</p>
                    <p className="text-[10px] text-slate-400">Due: {hw.dueDate}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
