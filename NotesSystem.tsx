import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Plus,
  Search,
  Star,
  Bookmark,
  Trash2,
  Edit3,
  Save,
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  Tag,
  Folder,
  Copy,
  Check,
  Download,
  Share2,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations";
import { Note } from "../types";

export const NotesSystem: React.FC = () => {
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    toggleNoteFavourite,
    toggleNoteBookmark,
    subjects,
    language,
    user,
  } = useApp();

  const t = getTranslation(language);

  // States
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("All");
  const [filterType, setFilterType] = useState<"all" | "short" | "full">("all");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autoSaveIndicator, setAutoSaveIndicator] = useState(false);

  const activeNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  // Active editor buffer
  const [title, setTitle] = useState(activeNote?.title || "");
  const [content, setContent] = useState(activeNote?.content || "");
  const [noteType, setNoteType] = useState<"short" | "full">(activeNote?.type || "short");
  const [subjectId, setSubjectId] = useState(activeNote?.subjectId || "science");
  const [tagsInput, setTagsInput] = useState(activeNote?.tags.join(", ") || "");

  // Update buffer when active note changes
  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
      setNoteType(activeNote.type);
      setSubjectId(activeNote.subjectId);
      setTagsInput(activeNote.tags.join(", "));
    }
  }, [activeNote?.id]);

  // Auto-save logic
  useEffect(() => {
    if (!activeNote) return;
    const timeout = setTimeout(() => {
      if (
        title !== activeNote.title ||
        content !== activeNote.content ||
        noteType !== activeNote.type ||
        subjectId !== activeNote.subjectId
      ) {
        updateNote(activeNote.id, {
          title,
          content,
          type: noteType,
          subjectId,
          tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
        });
        setAutoSaveIndicator(true);
        setTimeout(() => setAutoSaveIndicator(false), 2000);
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [title, content, noteType, subjectId, tagsInput]);

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    const matchesSubject = selectedSubjectFilter === "All" || n.subjectId === selectedSubjectFilter;
    const matchesType = filterType === "all" || n.type === filterType;
    const matchesSearch =
      searchQuery === "" ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesType && matchesSearch;
  });

  const handleCreateNew = (type: "short" | "full") => {
    const newId = addNote({
      title: type === "short" ? "New Short Note" : "New Chapter Study Note",
      content: "Start typing key points, formulas, definitions, and exam tips here...",
      type,
      subjectId: selectedSubjectFilter !== "All" ? selectedSubjectFilter : "science",
      chapterId: "ch-1",
      tags: ["Grade 09", "Revision"],
      isFavourite: false,
      isBookmarked: false,
    });
    setSelectedNoteId(newId);
  };

  // Text-To-Speech
  const handleToggleSpeak = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(`${title}. ${content}`);
    if (language === "ta") {
      utterance.lang = "ta-LK";
    } else if (language === "si") {
      utterance.lang = "si-LK";
    } else {
      utterance.lang = "en-US";
    }
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Speech-to-text dictation
  const handleToggleDictation = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === "ta" ? "ta-LK" : language === "si" ? "si-LK" : "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setContent((prev) => `${prev} ${transcript}`);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      console.warn("Speech recognition error:", e);
      setIsListening(false);
    }
  };

  const handleCopyNote = () => {
    navigator.clipboard.writeText(`${title}\n\n${content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadNote = () => {
    const blob = new Blob([`${title}\n\nSubject: ${subjectId}\nDate: ${new Date().toLocaleDateString()}\n\n${content}`], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}.txt`;
    a.click();
  };

  return (
    <div id="notes-system-page" className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Edit3 className="w-6 h-6 text-amber-500" />
            {t.notes.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.notes.autoSaved} • High-yield revision for Grade 09 subjects
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="new-short-note-btn"
            onClick={() => handleCreateNew("short")}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.notes.shortNote}</span>
          </button>
          <button
            id="new-full-note-btn"
            onClick={() => handleCreateNew("full")}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.notes.fullNote}</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Notes List (Left) + Note Editor (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[680px]">
        {/* Left Column: Note Finder & Filter (4 cols) */}
        <div className="lg:col-span-4 space-y-3 flex flex-col">
          {/* Search and Filters */}
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="flex-1 py-1.5 px-2 text-xs bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
              >
                <option value="All">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name[language] || s.name.en}
                  </option>
                ))}
              </select>

              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-750 p-0.5 text-[11px] font-bold">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-2 py-1 rounded-lg ${
                    filterType === "all" ? "bg-white dark:bg-slate-800 shadow-xs text-indigo-600" : "text-slate-500"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType("short")}
                  className={`px-2 py-1 rounded-lg ${
                    filterType === "short" ? "bg-white dark:bg-slate-800 shadow-xs text-indigo-600" : "text-slate-500"
                  }`}
                >
                  Short
                </button>
                <button
                  onClick={() => setFilterType("full")}
                  className={`px-2 py-1 rounded-lg ${
                    filterType === "full" ? "bg-white dark:bg-slate-800 shadow-xs text-indigo-600" : "text-slate-500"
                  }`}
                >
                  Full
                </button>
              </div>
            </div>
          </div>

          {/* Notes List Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[600px]">
            {filteredNotes.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
                <p className="text-xs text-slate-400">No notes found matching your criteria.</p>
              </div>
            ) : (
              filteredNotes.map((note) => {
                const sub = subjects.find((s) => s.id === note.subjectId);
                const isSelected = note.id === (activeNote?.id || selectedNoteId);
                return (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-500 shadow-sm"
                        : "bg-white dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/60 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: sub?.color || "#6366F1" }}
                        />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {sub?.name[language] || note.subjectId}
                        </span>
                      </div>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          note.type === "short"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                        }`}
                      >
                        {note.type === "short" ? "Short" : "Full"}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {note.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {note.content}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/40 text-[10px] text-slate-400">
                      <span>{note.updatedAt.split("T")[0]}</span>
                      <div className="flex items-center gap-2">
                        {note.isFavourite && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                        {note.isBookmarked && <Bookmark className="w-3 h-3 text-indigo-500 fill-indigo-500" />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Note Editor (8 cols) */}
        <div className="lg:col-span-8 flex flex-col p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
          {activeNote ? (
            <div className="flex flex-col h-full space-y-4">
              {/* Editor Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="py-1 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-750 text-xs font-bold text-slate-700 dark:text-slate-200 border-none focus:outline-none"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name[language] || s.name.en}
                      </option>
                    ))}
                  </select>

                  <select
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value as "short" | "full")}
                    className="py-1 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-750 text-xs font-bold text-slate-700 dark:text-slate-200 border-none focus:outline-none"
                  >
                    <option value="short">Short Quick Note</option>
                    <option value="full">Full Study Summary</option>
                  </select>

                  {autoSaveIndicator && (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-fade-in">
                      <Save className="w-3 h-3" />
                      Saved
                    </span>
                  )}
                </div>

                {/* Toolbar Buttons */}
                <div className="flex items-center gap-1.5">
                  {/* TTS Audio Reader */}
                  <button
                    onClick={handleToggleSpeak}
                    title="Listen to Note (Text-to-Speech)"
                    className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                      isSpeaking
                        ? "bg-amber-500 text-white animate-pulse"
                        : "bg-slate-100 dark:bg-slate-750 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span className="hidden sm:inline">{isSpeaking ? "Stop" : "Audio"}</span>
                  </button>

                  {/* Speech Dictation */}
                  <button
                    onClick={handleToggleDictation}
                    title="Voice Typing Dictation"
                    className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                      isListening
                        ? "bg-rose-600 text-white animate-pulse"
                        : "bg-slate-100 dark:bg-slate-750 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    <span className="hidden sm:inline">{isListening ? "Listening..." : "Dictate"}</span>
                  </button>

                  {/* Copy note */}
                  <button
                    onClick={handleCopyNote}
                    title="Copy note text"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-750 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>

                  {/* Download */}
                  <button
                    onClick={handleDownloadNote}
                    title="Download Note (.txt)"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-750 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {/* Star */}
                  <button
                    onClick={() => toggleNoteFavourite(activeNote.id)}
                    className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-750 cursor-pointer ${
                      activeNote.isFavourite ? "text-amber-500 fill-amber-500" : "text-slate-400 hover:text-amber-500"
                    }`}
                  >
                    <Star className={`w-4 h-4 ${activeNote.isFavourite ? "fill-amber-500" : ""}`} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deleteNote(activeNote.id)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-750 text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title..."
                className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white bg-transparent border-none focus:outline-none w-full"
              />

              {/* Content Textarea */}
              <div className="flex-1 min-h-[360px] flex flex-col">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type your detailed notes, definitions, formula proofs, and diagrams descriptions here..."
                  className="w-full flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed font-sans placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Tags Input & Cloud indicator */}
              <div className="flex items-center justify-between gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Comma separated tags: Grade 09, Science, Acids"
                    className="w-full bg-transparent text-slate-600 dark:text-slate-300 text-xs border-b border-dashed border-slate-300 dark:border-slate-700 focus:outline-none focus:border-indigo-500 py-1"
                  />
                </div>
                <span className="text-[11px] text-slate-400 flex-shrink-0">
                  {content.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                Select a note or create a new one to begin studying.
              </p>
              <button
                onClick={() => handleCreateNew("short")}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Create First Note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
