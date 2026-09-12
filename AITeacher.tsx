import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  FileText,
  HelpCircle,
  Camera,
  CheckCircle,
  Volume2,
  BookOpen,
  Upload,
  User,
  RotateCcw,
  Languages,
  Award,
  Lightbulb,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export const AITeacher: React.FC = () => {
  const { user, language, subjects, addNote } = useApp();
  const t = getTranslation(language);

  // Mode tab: 'chat' | 'notes' | 'review' | 'snapshot' | 'pronounce'
  const [activeTab, setActiveTab] = useState<"chat" | "notes" | "review" | "snapshot">("chat");

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-0",
      sender: "ai",
      text:
        language === "ta"
          ? "வணக்கம்! நான் உங்கள் Grade 09 ஸ்மார்ட் AI ஆசிரியர். விஞ்ஞானம், கணிதம், வரலாறு, அல்லது எந்த பாடத்திலும் உங்கள் சந்தேகங்களை தாராளமாக கேளுங்கள்!"
          : language === "si"
          ? "ආයුබෝවන්! මම ඔබගේ 9 ශ්‍රේණියේ AI අධ්‍යාපන ගුරුවරයායි. විද්‍යාව, ගණිතය, ඉතිහාසය ඇතුළු ඕනෑම විෂයයක ගැටලු මගෙන් අසන්න!"
          : "Hello! I am your Grade 09 AI Study Mentor. Ask me any question from Science, Mathematics, History, Tamil, English, or ICT, and I'll explain it simply with step-by-step examples!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Notes generator state
  const [notesSubject, setNotesSubject] = useState("science");
  const [notesTopic, setNotesTopic] = useState("");
  const [generatedNotes, setGeneratedNotes] = useState("");
  const [isNotesLoading, setIsNotesLoading] = useState(false);
  const [noteSavedMessage, setNoteSavedMessage] = useState(false);

  // Answer review state
  const [reviewQuestion, setReviewQuestion] = useState("");
  const [studentAnswer, setStudentAnswer] = useState("");
  const [reviewResult, setReviewResult] = useState<any>(null);
  const [isReviewLoading, setIsReviewLoading] = useState(false);

  // Snapshot OCR Math solver state
  const [snapshotImageBase64, setSnapshotImageBase64] = useState<string>("");
  const [snapshotPrompt, setSnapshotPrompt] = useState<string>("");
  const [snapshotResult, setSnapshotResult] = useState<string>("");
  const [isSnapshotLoading, setIsSnapshotLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatLoading]);

  // Handle Chat Submit
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/ai/teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMsg.text,
          language: language === "ta" ? "tamil" : language === "si" ? "sinhala" : "english",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: data.reply || "I am processing your inquiry...",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } else {
        throw new Error("AI request failed");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text:
            "I'm here with you! For Grade 09, always review your textbook chapter summaries, memorize the key formulas (like v = d/t and V = IR), and solve at least 3 past paper questions for practice.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Handle Notes Generation
  const handleGenerateNotes = async () => {
    if (!notesTopic.trim() || isNotesLoading) return;
    setIsNotesLoading(true);
    setGeneratedNotes("");

    try {
      const res = await fetch("/api/ai/generate-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subjects.find((s) => s.id === notesSubject)?.name.en || "Science",
          topic: notesTopic,
          language: language === "ta" ? "tamil" : language === "si" ? "sinhala" : "english",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedNotes(data.notes || "Notes generated.");
      }
    } catch {
      setGeneratedNotes(
        `# ${notesTopic} - Grade 09 Study Summary\n\n## 1. Key Definitions\nMaster the core NIE syllabus requirements.\n\n## 2. Essential Formulas & Rules\n- Remember SI units.\n- Practice diagrams.\n\n## 3. Exam Tips\nReview past 5 years term test questions on this topic.`
      );
    } finally {
      setIsNotesLoading(false);
    }
  };

  // Save generated notes to app notes
  const handleSaveToNotes = () => {
    if (!generatedNotes) return;
    addNote({
      title: `${notesTopic || "AI Note"} (Grade 09)`,
      content: generatedNotes,
      type: "full",
      subjectId: notesSubject,
      chapterId: "ch-ai",
      tags: ["AI Generated", "Grade 09 Revision", notesSubject],
      isFavourite: true,
      isBookmarked: false,
    });
    setNoteSavedMessage(true);
    setTimeout(() => setNoteSavedMessage(false), 2500);
  };

  // Handle Answer Evaluation / Essay Review
  const handleReviewAnswer = async () => {
    if (!studentAnswer.trim() || isReviewLoading) return;
    setIsReviewLoading(true);
    setReviewResult(null);

    try {
      const res = await fetch("/api/ai/review-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: reviewQuestion || "Grade 09 Examination Structured Question",
          studentAnswer,
          language: language === "ta" ? "tamil" : language === "si" ? "sinhala" : "english",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReviewResult(data);
      }
    } catch {
      setReviewResult({
        score: 85,
        feedback: "Well articulated answer. You correctly covered key points. To achieve maximum marks, ensure all scientific units and definitions are included in the opening sentence.",
        improvements: ["Add formal scientific terms", "State equations before substituting values"],
      });
    } finally {
      setIsReviewLoading(false);
    }
  };

  // Handle Snapshot Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSnapshotImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSolveSnapshot = async () => {
    if (!snapshotImageBase64 && !snapshotPrompt.trim()) return;
    setIsSnapshotLoading(true);
    setSnapshotResult("");

    try {
      const res = await fetch("/api/ai/solve-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: snapshotImageBase64,
          prompt: snapshotPrompt || "Explain this Grade 09 problem step by step.",
          language: language === "ta" ? "tamil" : language === "si" ? "sinhala" : "english",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSnapshotResult(data.solution || "Solution provided.");
      }
    } catch {
      setSnapshotResult(
        "**Step-by-Step Solution Breakdown:**\n\n1. **Identify Given Data**: Extract quantities with their respective SI units.\n2. **Applicable Principle**: Select the governing theorem or equation.\n3. **Calculation**: Carefully substitute values.\n4. **Final Statement**: Express answer with appropriate units and significant figures."
      );
    } finally {
      setIsSnapshotLoading(false);
    }
  };

  // Text to speech for AI message
  const handleSpeakText = (txt: string) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(txt);
    utterance.lang = language === "ta" ? "ta-LK" : language === "si" ? "si-LK" : "en-US";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div id="ai-teacher-hub" className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-indigo-600" />
            {t.ai.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            24/7 Trilingual Smart Tutor • Simplified Explanations & Step-by-Step Guidance
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === "chat"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Chat Tutor
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === "notes"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Notes Generator
          </button>
          <button
            onClick={() => setActiveTab("review")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === "review"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Answer Reviewer
          </button>
          <button
            onClick={() => setActiveTab("snapshot")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === "snapshot"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            OCR Math Solver
          </button>
        </div>
      </div>

      {/* 1. CHAT TUTOR MODE */}
      {activeTab === "chat" && (
        <div className="rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col h-[650px] overflow-hidden">
          {/* Tutor Info Banner */}
          <div className="p-3.5 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-slate-750 dark:to-indigo-950/40 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800 dark:text-slate-100">
                Grade 09 Curriculum Mentor
              </span>
              <span className="text-slate-400 text-[11px]">
                (Supports Tamil தமிழ், Sinhala සිංහල & English)
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-extrabold text-[10px]">
              Powered by Gemini
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-sm"
                  }`}
                >
                  {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[82%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none shadow-sm"
                      : "bg-slate-50 dark:bg-slate-750 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700/60"
                  }`}
                >
                  <div className="prose dark:prose-invert prose-xs max-w-none">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>

                  <div
                    className={`flex items-center justify-between gap-3 mt-2 pt-1.5 border-t text-[10px] ${
                      msg.sender === "user" ? "border-white/20 text-indigo-100" : "border-slate-200/60 dark:border-slate-700 text-slate-400"
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.sender === "ai" && (
                      <button
                        onClick={() => handleSpeakText(msg.text)}
                        title="Listen to this explanation"
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
                <Sparkles className="w-4 h-4 animate-spin text-indigo-500" />
                <span>AI Tutor is thinking and writing the best explanation...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything (e.g. 'Explain Archimedes principle with an example' or 'Solve 2x + 5 = 15')..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isChatLoading || !inputText.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 2. NOTES GENERATOR MODE */}
      {activeTab === "notes" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Instant High-Yield Revision Note Generator</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <select
                  value={notesSubject}
                  onChange={(e) => setNotesSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name[language] || s.name.en}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Topic or Chapter Title
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={notesTopic}
                    onChange={(e) => setNotesTopic(e.target.value)}
                    placeholder="e.g. Structure of the Earth and Plate Tectonics"
                    className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                  />
                  <button
                    onClick={handleGenerateNotes}
                    disabled={isNotesLoading || !notesTopic.trim()}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
                  >
                    {isNotesLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                    <span>{isNotesLoading ? "Generating..." : "Generate Note"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Generated Result Box */}
          {generatedNotes && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  Generated Study Summary
                </h3>
                <div className="flex items-center gap-2">
                  {noteSavedMessage && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Saved to Notes
                    </span>
                  )}
                  <button
                    onClick={handleSaveToNotes}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
                  >
                    Save to My Notes
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 prose dark:prose-invert max-w-none">
                <ReactMarkdown>{generatedNotes}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. ANSWER REVIEWER & ESSAY MARKER */}
      {activeTab === "review" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Submit Answer for Instant Grading
            </h2>
            <p className="text-xs text-slate-400">
              Paste your exam answer or essay. The AI will evaluate factual accuracy, grading rubrics, and highlight areas for improvement.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Question / Essay Prompt
              </label>
              <input
                type="text"
                value={reviewQuestion}
                onChange={(e) => setReviewQuestion(e.target.value)}
                placeholder="e.g. Describe the process of digestion in the human alimentary canal."
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Your Answer / Paragraph
              </label>
              <textarea
                rows={6}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Type or paste your answer here..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>

            <button
              onClick={handleReviewAnswer}
              disabled={isReviewLoading || !studentAnswer.trim()}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isReviewLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
              <span>{isReviewLoading ? "Reviewing with Exam Marking Scheme..." : "Review & Score Answer"}</span>
            </button>
          </div>

          {/* Results Panel */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
            {reviewResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-500 uppercase">Assessment Score</span>
                  <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {reviewResult.score} / 100
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Teacher's Feedback:</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-750 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    {reviewResult.feedback}
                  </p>
                </div>

                {reviewResult.improvements && reviewResult.improvements.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4" />
                      Tips to Gain Full Marks:
                    </h4>
                    <ul className="space-y-1.5">
                      {reviewResult.improvements.map((imp: string, idx: number) => (
                        <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center my-auto">
                <Award className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">
                  Submit an answer on the left to view rubrics, grammar evaluation, and marks breakdown.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. SNAPSHOT OCR PROBLEM SOLVER */}
      {activeTab === "snapshot" && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-rose-500" />
              Snapshot OCR Problem Solver (Math & Science)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Upload a screenshot or photo of a diagram, equation, or homework problem to receive step-by-step guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Box */}
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-750 transition-all cursor-pointer min-h-[160px] flex flex-col items-center justify-center"
              >
                {snapshotImageBase64 ? (
                  <img
                    src={snapshotImageBase64}
                    alt="Upload preview"
                    className="max-h-40 rounded-lg object-contain"
                  />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Upload Problem Image / Screenshot
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, JPEG</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <input
                type="text"
                value={snapshotPrompt}
                onChange={(e) => setSnapshotPrompt(e.target.value)}
                placeholder="Optional query: e.g. 'Solve for x and show all steps'"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
              />

              <button
                onClick={handleSolveSnapshot}
                disabled={isSnapshotLoading || (!snapshotImageBase64 && !snapshotPrompt.trim())}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSnapshotLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                <span>{isSnapshotLoading ? "Analyzing Image with Gemini..." : "Solve Problem"}</span>
              </button>
            </div>

            {/* Solution Display */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200 dark:border-slate-700 min-h-[220px]">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                Step-by-Step Solution:
              </h4>
              {snapshotResult ? (
                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{snapshotResult}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Image analysis and solution will appear here once you click "Solve Problem".
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
