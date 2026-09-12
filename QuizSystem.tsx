import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Filter,
  Check,
  AlertCircle,
  Bot,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations";
import { QuizQuestion, QuizAttempt } from "../types";
import { initialQuizBank } from "../data/grade9Data";

export const QuizSystem: React.FC = () => {
  const { subjects, recordQuizAttempt, quizHistory, language, user } = useApp();
  const t = getTranslation(language);

  // States
  const [selectedSubject, setSelectedSubject] = useState<string>("science");
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number | string>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(300); // 5 minutes
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [aiTopicInput, setAiTopicInput] = useState<string>("");

  // Current question
  const currentQ = activeQuizQuestions ? activeQuizQuestions[currentQuestionIndex] : null;

  // Timer countdown
  useEffect(() => {
    let interval: any;
    if (timerActive && timeRemaining > 0 && !isQuizCompleted) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining, isQuizCompleted]);

  // Start predefined subject quiz
  const handleStartQuiz = (subjectId: string) => {
    const qList = initialQuizBank[subjectId] || initialQuizBank["science"] || [];
    if (qList.length > 0) {
      setActiveQuizQuestions(qList);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setShowExplanation(false);
      setIsQuizCompleted(false);
      setTimeRemaining(qList.length * 60);
      setTimerActive(true);
    }
  };

  // Generate AI Quiz
  const handleGenerateAIQuiz = async () => {
    const topic = aiTopicInput.trim() || subjects.find((s) => s.id === selectedSubject)?.name.en || "Grade 09 Science";
    setAiGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subjects.find((s) => s.id === selectedSubject)?.name.en || "Science",
          chapter: topic,
          count: 5,
          language: language === "ta" ? "tamil" : language === "si" ? "sinhala" : "english",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setActiveQuizQuestions(data.questions);
          setCurrentQuestionIndex(0);
          setUserAnswers({});
          setShowExplanation(false);
          setIsQuizCompleted(false);
          setTimeRemaining(data.questions.length * 60);
          setTimerActive(true);
        }
      }
    } catch (e) {
      console.error("AI quiz generation error:", e);
      // Fallback
      handleStartQuiz(selectedSubject);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSelectAnswer = (ans: number | string) => {
    if (!currentQ || showExplanation) return;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: ans }));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (!activeQuizQuestions) return;
    setShowExplanation(false);
    if (currentQuestionIndex < activeQuizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    if (!activeQuizQuestions) return;
    setTimerActive(false);
    setIsQuizCompleted(true);

    // Calculate score
    let correct = 0;
    activeQuizQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const percentage = Math.round((correct / activeQuizQuestions.length) * 100);

    // Trigger confetti if high score
    if (percentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }

    // Save attempt in context
    recordQuizAttempt({
      quizTitle: `Grade 09 ${subjects.find((s) => s.id === selectedSubject)?.name.en || "Academic"} Quiz`,
      subjectId: selectedSubject,
      score: correct,
      totalQuestions: activeQuizQuestions.length,
      percentage,
      timeSpentSeconds: activeQuizQuestions.length * 60 - timeRemaining,
      questions: activeQuizQuestions,
    });
  };

  const handleRetry = () => {
    if (!activeQuizQuestions) return;
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowExplanation(false);
    setIsQuizCompleted(false);
    setTimeRemaining(activeQuizQuestions.length * 60);
    setTimerActive(true);
  };

  const handleExit = () => {
    setActiveQuizQuestions(null);
    setIsQuizCompleted(false);
    setTimerActive(false);
  };

  // Format timer
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return (
    <div id="quiz-system-page" className="space-y-6 pb-12">
      {/* 1. If NO active quiz: Show Subject Practice Selection & AI Quiz Creator */}
      {!activeQuizQuestions && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                <HelpCircle className="w-6 h-6 text-purple-600" />
                {t.quiz.title}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Curriculum aligned MCQs, True/False, and instant explanations for Grade 09
              </p>
            </div>

            {/* Quick stats badge */}
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>{user.quizzesCompleted} Quizzes Taken • Avg: {user.averageScore}%</span>
              </div>
            </div>
          </div>

          {/* AI Custom Quiz Generator Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl">
            <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Smart AI Quiz Builder (Trilingual: English, Tamil, Sinhala)</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold mb-2">
              Create a Custom Quiz on ANY Topic
            </h2>
            <p className="text-xs text-purple-200 max-w-xl mb-4">
              Enter any Grade 09 chapter (e.g. "Periodic Table Elements", "Quadratic Equations", or "Water Quality") and our AI Teacher will instantly craft 5 exam-standard practice questions.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={aiTopicInput}
                onChange={(e) => setAiTopicInput(e.target.value)}
                placeholder="e.g. Newton's Laws of Motion or Photosynthesis"
                className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-purple-300 text-xs focus:outline-none focus:border-purple-400"
              />
              <button
                onClick={handleGenerateAIQuiz}
                disabled={aiGenerating}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {aiGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Generating Quiz...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    <span>Generate AI Quiz</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Standard Subject Quizzes Grid */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              Subject Practice Modules
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((sub) => {
                const subQuestions = initialQuizBank[sub.id] || [];
                const questionCount = subQuestions.length || 5;
                return (
                  <div
                    key={sub.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col justify-between hover:border-indigo-400 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm"
                          style={{ backgroundColor: sub.color }}
                        >
                          {sub.code.split("-")[0]}
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-750 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                          {questionCount} Questions
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                        {sub.name[language] || sub.name.en}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        Practice unit questions, term test revisions, and model paper MCQs.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedSubject(sub.id);
                        handleStartQuiz(sub.id);
                      }}
                      className="mt-4 w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-750 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Start Practice Test</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Past Quiz History */}
          {quizHistory.length > 0 && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                Recent Practice Attempts
              </h3>
              <div className="space-y-2">
                {quizHistory.slice(0, 5).map((attempt) => {
                  const sub = subjects.find((s) => s.id === attempt.subjectId);
                  return (
                    <div
                      key={attempt.id}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: sub?.color || "#6366F1" }}
                        />
                        <span className="font-bold text-slate-800 dark:text-slate-100">
                          {sub?.name[language] || attempt.subjectId}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          • {attempt.score}/{attempt.totalQuestions} correct
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-extrabold ${
                            attempt.percentage >= 75
                              ? "text-emerald-600"
                              : attempt.percentage >= 50
                              ? "text-amber-600"
                              : "text-rose-600"
                          }`}
                        >
                          {attempt.percentage}%
                        </span>
                        <span className="text-[10px] text-slate-400">{attempt.date.split("T")[0]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* 2. ACTIVE QUIZ RUNNER */}
      {activeQuizQuestions && !isQuizCompleted && currentQ && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Quiz Top Status Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Question {currentQuestionIndex + 1} of {activeQuizQuestions.length}
              </span>
              <div className="w-24 sm:w-36 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / activeQuizQuestions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Timer & Exit */}
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-xs font-bold ${
                  timeRemaining < 60
                    ? "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 animate-pulse"
                    : "bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-300"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{timeFormatted}</span>
              </div>

              <button
                onClick={handleExit}
                className="text-xs font-bold text-slate-400 hover:text-rose-500 cursor-pointer"
              >
                Exit
              </button>
            </div>
          </div>

          {/* Question Box Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-md space-y-6">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Answer Options Grid */}
            <div className="space-y-3">
              {currentQ.options?.map((opt, idx) => {
                const isSelected = userAnswers[currentQ.id] === opt;
                const isCorrect = currentQ.correctAnswer === opt;

                let btnClass = "border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200";

                if (showExplanation) {
                  if (isCorrect) {
                    btnClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold";
                  } else if (isSelected && !isCorrect) {
                    btnClass = "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 line-through";
                  }
                } else if (isSelected) {
                  btnClass = "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 font-bold";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(opt)}
                    disabled={showExplanation}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {showExplanation && (
                      <div>
                        {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                        {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation card after answering */}
            {showExplanation && (
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-1.5 animate-fade-in">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                  <AlertCircle className="w-4 h-4" />
                  <span>Teacher's Explanation:</span>
                </div>
                <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Footer Next Question Button */}
            {showExplanation && (
              <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>
                    {currentQuestionIndex < activeQuizQuestions.length - 1 ? t.common.next : "Complete Quiz"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. QUIZ RESULTS & RECAP SCREEN */}
      {isQuizCompleted && activeQuizQuestions && (
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl shadow-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white">
            🎉
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Quiz Completed!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Your results have been logged and your study stats have updated.
            </p>
          </div>

          {/* Score Box */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200 dark:border-slate-700 flex items-center justify-around">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Your Score
              </span>
              <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {
                  activeQuizQuestions.filter((q) => userAnswers[q.id] === q.correctAnswer).length
                }{" "}
                / {activeQuizQuestions.length}
              </span>
            </div>

            <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Percentage
              </span>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-white">
                {Math.round(
                  (activeQuizQuestions.filter((q) => userAnswers[q.id] === q.correctAnswer).length /
                    activeQuizQuestions.length) *
                    100
                )}
                %
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRetry}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            <button
              onClick={handleExit}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              Back to Quiz Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
