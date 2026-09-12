import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  FileText,
  Video,
  HelpCircle,
  Clock,
  Play,
  Download,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Layers,
  Award,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations";
import { Subject, Chapter } from "../types";

export const SubjectHub: React.FC<{
  onOpenPdf: (id: string) => void;
}> = ({ onOpenPdf }) => {
  const {
    subjects,
    selectedSubjectId,
    setSelectedSubjectId,
    updateSubjectChapter,
    pdfFiles,
    notes,
    videos,
    importantQuestions,
    language,
    setActiveView,
  } = useApp();

  const t = getTranslation(language);

  // Active subject
  const currentSub = subjects.find((s) => s.id === selectedSubjectId);

  // Tab within subject view: 'chapters' | 'pdfs' | 'notes' | 'videos' | 'questions'
  const [subTab, setSubTab] = useState<"chapters" | "pdfs" | "notes" | "videos" | "questions">("chapters");

  // If no subject selected, render all 13 subjects
  if (!currentSub) {
    return (
      <div id="subjects-grid-page" className="space-y-6 pb-12">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            {t.nav.subjects} (13 Subjects)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete Sri Lankan National Curriculum for Grade 09 with textbooks, notes, past papers & videos
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {subjects.map((sub) => {
            const completion = Math.round((sub.completedChapters / sub.totalChapters) * 100);
            const subPdfCount = pdfFiles.filter((p) => p.subjectId === sub.id).length;
            const subNotesCount = notes.filter((n) => n.subjectId === sub.id).length;

            return (
              <div
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-sm shadow-md"
                      style={{ backgroundColor: sub.color }}
                    >
                      {sub.code.split("-")[0]}
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-750 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      {sub.completedChapters} / {sub.totalChapters} Units
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {sub.name[language] || sub.name.en}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {sub.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>{subPdfCount} PDFs • {subNotesCount} Notes</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{completion}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${completion}%`, backgroundColor: sub.color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Filter subject-specific content
  const subPdfs = pdfFiles.filter((p) => p.subjectId === currentSub.id);
  const subNotes = notes.filter((n) => n.subjectId === currentSub.id);
  const subVideos = videos.filter((v) => v.subjectId === currentSub.id);
  const subQuestions = importantQuestions.filter((q) => q.subjectId === currentSub.id);

  return (
    <div id="subject-detail-page" className="space-y-6 pb-12">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSelectedSubjectId(null)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>All Subjects</span>
        </button>
      </div>

      {/* Subject Hero Card */}
      <div
        className="p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
        style={{
          background: `linear-gradient(135deg, ${currentSub.color} 0%, #1e1b4b 100%)`,
        }}
      >
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-xs font-extrabold uppercase tracking-wide">
              {currentSub.code}
            </span>
            <span className="text-xs text-white/80">Grade 09 National Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currentSub.name[language] || currentSub.name.en}
          </h1>
          <p className="text-xs sm:text-sm text-white/90 mt-2 leading-relaxed">
            {currentSub.description}
          </p>
        </div>

        <div className="relative z-10 bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col gap-2 min-w-[200px]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/80">Syllabus Completed</span>
            <span className="font-extrabold text-white">
              {Math.round((currentSub.completedChapters / currentSub.totalChapters) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full"
              style={{
                width: `${(currentSub.completedChapters / currentSub.totalChapters) * 100}%`,
              }}
            />
          </div>
          <span className="text-[10px] text-white/70">
            {currentSub.completedChapters} of {currentSub.totalChapters} Chapters Completed
          </span>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setSubTab("chapters")}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            subTab === "chapters"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Chapters & Lessons ({currentSub.chapters.length})
        </button>
        <button
          onClick={() => setSubTab("pdfs")}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            subTab === "pdfs"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Textbooks & PDFs ({subPdfs.length})
        </button>
        <button
          onClick={() => setSubTab("notes")}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            subTab === "notes"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Revision Notes ({subNotes.length})
        </button>
        <button
          onClick={() => setSubTab("videos")}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            subTab === "videos"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Video Lessons ({subVideos.length})
        </button>
        <button
          onClick={() => setSubTab("questions")}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            subTab === "questions"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Exam Questions ({subQuestions.length})
        </button>
      </div>

      {/* 1. CHAPTERS TAB */}
      {subTab === "chapters" && (
        <div className="space-y-3">
          {currentSub.chapters.map((ch, idx) => (
            <div
              key={ch.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => updateSubjectChapter(currentSub.id, ch.id, !ch.completed)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer"
                >
                  {ch.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300" />
                  )}
                </button>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Unit {idx + 1}
                  </span>
                  <h3
                    className={`text-sm font-bold ${
                      ch.completed ? "line-through text-slate-400" : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {ch.title[language] || ch.title.en}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {ch.topics.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-750 text-[10px] text-slate-600 dark:text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => setActiveView("quiz")}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-750 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-colors cursor-pointer"
                >
                  Practice Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. PDFS TAB */}
      {subTab === "pdfs" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subPdfs.map((pdf) => (
            <div
              key={pdf.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold text-xs mb-3">
                  PDF
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  {pdf.title}
                </h3>
                <span className="text-[11px] text-slate-400 block">{pdf.pageCount} Pages • {pdf.folder}</span>
              </div>

              <button
                onClick={() => onOpenPdf(pdf.id)}
                className="mt-4 w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open in PDF Reader</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 3. NOTES TAB */}
      {subTab === "notes" && (
        <div className="space-y-3">
          {subNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveView("notes")}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm cursor-pointer hover:border-indigo-400 transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-amber-600 uppercase">
                  {note.type === "short" ? "Short Note" : "Full Note"}
                </span>
                <span className="text-[10px] text-slate-400">{note.updatedAt.split("T")[0]}</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">{note.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1">{note.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* 4. VIDEOS TAB */}
      {subTab === "videos" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subVideos.map((vid) => (
            <div
              key={vid.id}
              className="rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-slate-900">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg">
                    <Play className="w-4 h-4 fill-slate-900 translate-x-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-bold">
                  {vid.duration}
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                  {vid.title}
                </h3>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Channel: {vid.channel}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. QUESTIONS TAB */}
      {subTab === "questions" && (
        <div className="space-y-3">
          {subQuestions.map((q) => (
            <div
              key={q.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">
                  {q.year || "National Curriculum Question"}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-750 text-slate-600 dark:text-slate-300">
                  Key Question
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                {q.question}
              </p>
              <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-300">
                <span className="font-bold block mb-1">Standard Model Answer:</span>
                <p className="leading-relaxed">{q.answer}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
