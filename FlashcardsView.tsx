import React, { useState } from "react";
import {
  Layers,
  Sparkles,
  Plus,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  Bot,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations";
import { Flashcard } from "../types";

export const FlashcardsView: React.FC = () => {
  const {
    flashcards,
    addFlashcard,
    updateFlashcardStatus,
    toggleFlashcardFavourite,
    subjects,
    language,
  } = useApp();

  const t = getTranslation(language);

  // States
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>("");

  // New flashcard form
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");
  const [newSubject, setNewSubject] = useState("science");

  // Filtered flashcards
  const filteredCards = flashcards.filter((card) => {
    const matchesSub = selectedSubjectFilter === "All" || card.subjectId === selectedSubjectFilter;
    const matchesStatus = selectedStatusFilter === "All" || card.status === selectedStatusFilter;
    return matchesSub && matchesStatus;
  });

  const activeCard: Flashcard | undefined = filteredCards[currentIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(filteredCards.length - 1);
    }
  };

  const handleStatusUpdate = (status: Flashcard["status"]) => {
    if (!activeCard) return;
    updateFlashcardStatus(activeCard.id, status);
    handleNextCard();
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;

    addFlashcard({
      front: newFront.trim(),
      back: newBack.trim(),
      subjectId: newSubject,
      chapterId: "ch-1",
      status: "new",
      isFavourite: false,
    });

    setNewFront("");
    setNewBack("");
    setShowAddModal(false);
  };

  const handleAIGenerateCards = async () => {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subjects.find((s) => s.id === newSubject)?.name.en || "Science",
          chapter: aiPrompt,
          count: 4,
          language: language === "ta" ? "tamil" : language === "si" ? "sinhala" : "english",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions) {
          data.questions.forEach((q: any) => {
            addFlashcard({
              front: q.question,
              back: q.explanation || (q.options ? q.options[q.correctAnswer] : "Answer verified"),
              subjectId: newSubject,
              chapterId: "ch-ai",
              status: "new",
              isFavourite: false,
            });
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiGenerating(false);
      setAiPrompt("");
      setShowAddModal(false);
    }
  };

  return (
    <div id="flashcards-page" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-blue-600" />
            {t.flashcards.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Active recall & spaced repetition system for Grade 09 definitions & formulas
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Flashcard</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500">Subject:</span>
          <select
            value={selectedSubjectFilter}
            onChange={(e) => {
              setSelectedSubjectFilter(e.target.value);
              setCurrentIndex(0);
            }}
            className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="All">All Subjects ({flashcards.length})</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name[language] || s.name.en}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500">Mastery:</span>
          <select
            value={selectedStatusFilter}
            onChange={(e) => {
              setSelectedStatusFilter(e.target.value);
              setCurrentIndex(0);
            }}
            className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="new">New</option>
            <option value="hard">Hard</option>
            <option value="medium">Medium</option>
            <option value="easy">Easy</option>
            <option value="mastered">Mastered</option>
          </select>
        </div>
      </div>

      {/* Main Flashcard Flip Arena */}
      {filteredCards.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40">
          <Layers className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No Flashcards Found
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Create a custom card or generate cards automatically with the AI Study Teacher.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Create Flashcard
          </button>
        </div>
      ) : (
        <div className="max-w-xl mx-auto space-y-6">
          {/* Card counter */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-2">
            <span>
              Card {currentIndex + 1} of {filteredCards.length}
            </span>
            <span className="capitalize text-indigo-600 dark:text-indigo-400">
              Status: {activeCard?.status}
            </span>
          </div>

          {/* Interactive Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[320px] sm:min-h-[360px] cursor-pointer perspective-1000 select-none"
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full h-full min-h-[320px] sm:min-h-[360px] relative rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 p-8 flex flex-col justify-between"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front or Back Content */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-750 font-bold text-[10px] uppercase text-indigo-600">
                  {isFlipped ? "Answer / Solution" : "Question / Concept"}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (activeCard) toggleFlashcardFavourite(activeCard.id);
                  }}
                  className="p-1 text-slate-400 hover:text-amber-500"
                >
                  <Star className={`w-4 h-4 ${activeCard?.isFavourite ? "text-amber-500 fill-amber-500" : ""}`} />
                </button>
              </div>

              {/* Text Body */}
              <div className="py-6 text-center">
                <p className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                  {isFlipped ? activeCard?.back : activeCard?.front}
                </p>
              </div>

              {/* Card Footer Hint */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
                <RotateCw className="w-3.5 h-3.5" />
                <span>{t.flashcards.flipPrompt}</span>
              </div>
            </motion.div>
          </div>

          {/* Spaced Repetition Grading Buttons */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              How well did you recall this card?
            </span>

            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleStatusUpdate("hard")}
                className="py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold text-xs transition-colors cursor-pointer"
              >
                {t.flashcards.hard}
              </button>
              <button
                onClick={() => handleStatusUpdate("medium")}
                className="py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-300 font-bold text-xs transition-colors cursor-pointer"
              >
                {t.flashcards.medium}
              </button>
              <button
                onClick={() => handleStatusUpdate("easy")}
                className="py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-xs transition-colors cursor-pointer"
              >
                {t.flashcards.easy}
              </button>
              <button
                onClick={() => handleStatusUpdate("mastered")}
                className="py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-xs transition-colors cursor-pointer"
              >
                {t.flashcards.mastered}
              </button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevCard}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.common.prev}</span>
            </button>

            <button
              onClick={handleNextCard}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <span>{t.common.next}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* CREATE & AI FLASHCARD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Add Grade 09 Flashcards
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* AI Generator section */}
            <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Auto-Generate with AI Study Teacher
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Acid-Base Indicators & pH colors"
                  className="flex-1 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                />
                <button
                  onClick={handleAIGenerateCards}
                  disabled={aiGenerating}
                  className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {aiGenerating ? "Generating..." : "Generate Cards"}
                </button>
              </div>
            </div>

            <div className="text-center text-xs text-slate-400 font-bold">— OR ENTER MANUALLY —</div>

            {/* Manual Form */}
            <form onSubmit={handleCreateCard} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name[language] || s.name.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Card Front (Question / Term / Formula)
                </label>
                <textarea
                  rows={2}
                  required
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  placeholder="e.g. What is the unit of Electric Resistance?"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Card Back (Answer / Explanation)
                </label>
                <textarea
                  rows={3}
                  required
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  placeholder="e.g. Ohm (Ω). According to Ohm's Law, R = V / I."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-500 font-bold"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  Save Flashcard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
