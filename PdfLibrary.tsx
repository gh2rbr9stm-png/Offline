import React, { useState, useRef } from "react";
import {
  Upload,
  FolderPlus,
  Folder,
  FileText,
  Search,
  Star,
  Bookmark,
  Trash2,
  Edit2,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Highlighter,
  PenTool,
  StickyNote,
  Eraser,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Tag,
  Eye,
  Lock,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations";
import { PDFFile, Annotation } from "../types";

export const PdfLibrary: React.FC = () => {
  const {
    pdfFiles,
    addPdfFile,
    deletePdfFile,
    updatePdfFile,
    togglePdfFavourite,
    togglePdfBookmark,
    updatePdfProgress,
    addPdfAnnotation,
    deletePdfAnnotation,
    selectedPdfId,
    setSelectedPdfId,
    subjects,
    language,
    user,
  } = useApp();

  const t = getTranslation(language);

  // States
  const [activeFolder, setActiveFolder] = useState<string>("All");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("All");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [showFolderModal, setShowFolderModal] = useState<boolean>(false);
  const [customFolders, setCustomFolders] = useState<string[]>([
    "Textbooks & Guides",
    "Worksheets & Practice",
    "Past Papers & History",
    "Tamil Grammar Handouts",
    "Personal Uploads",
  ]);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadTitle, setUploadTitle] = useState<string>("");
  const [uploadSubject, setUploadSubject] = useState<string>("science");
  const [uploadFolder, setUploadFolder] = useState<string>("Personal Uploads");
  const [uploadFileBase64, setUploadFileBase64] = useState<string>("");
  const [uploadFileSize, setUploadFileSize] = useState<number>(0);
  const [uploadFileName, setUploadFileName] = useState<string>("");
  const [uploadPageCount, setUploadPageCount] = useState<number>(12);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // PDF Viewer active state
  const activePdf = pdfFiles.find((p) => p.id === selectedPdfId);
  const [currentPage, setCurrentPage] = useState<number>(activePdf?.lastReadPage || 1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeTool, setActiveTool] = useState<"none" | "highlight" | "draw" | "note">("none");
  const [toolColor, setToolColor] = useState<string>("#fde047");
  const [newNoteText, setNewNoteText] = useState<string>("");

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Array<{ x: number; y: number }>>([]);

  // Filtered files
  const filteredPdfs = pdfFiles.filter((pdf) => {
    const matchesFolder = activeFolder === "All" || pdf.folder === activeFolder;
    const matchesSubject = selectedSubjectFilter === "All" || pdf.subjectId === selectedSubjectFilter;
    const matchesSearch =
      searchFilter === "" ||
      pdf.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      pdf.tags.some((tag) => tag.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesFolder && matchesSubject && matchesSearch;
  });

  // Handle File Input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFileName(file.name);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
      setUploadFileSize(file.size);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadFileBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    addPdfFile({
      title: uploadTitle.endsWith(".pdf") ? uploadTitle : `${uploadTitle}.pdf`,
      subjectId: uploadSubject,
      folder: uploadFolder,
      size: uploadFileSize || 1500000,
      pageCount: uploadPageCount || 10,
      lastReadPage: 1,
      isFavourite: false,
      isBookmarked: false,
      isPersonalUpload: true,
      base64Data: uploadFileBase64,
      tags: ["Personal Upload", "Grade 09", subjects.find((s) => s.id === uploadSubject)?.name.en || "General"],
    });

    setShowUploadModal(false);
    setUploadTitle("");
    setUploadFileBase64("");
  };

  const handlePageChange = (newPage: number) => {
    if (!activePdf) return;
    const bounded = Math.max(1, Math.min(newPage, activePdf.pageCount));
    setCurrentPage(bounded);
    updatePdfProgress(activePdf.id, bounded);
  };

  const handleAddHighlight = () => {
    if (!activePdf) return;
    addPdfAnnotation(activePdf.id, {
      page: currentPage,
      type: "highlight",
      color: toolColor,
      text: "Important highlighted definition on page " + currentPage,
    });
  };

  const handleAddNote = () => {
    if (!activePdf || !newNoteText.trim()) return;
    addPdfAnnotation(activePdf.id, {
      page: currentPage,
      type: "note",
      color: toolColor,
      text: newNoteText.trim(),
    });
    setNewNoteText("");
  };

  // Canvas drawing handlers
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== "draw") return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPoints([{ x, y }]);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeTool !== "draw") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPoints((prev) => [...prev, { x, y }]);

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = toolColor;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleCanvasMouseUp = () => {
    if (!isDrawing || !activePdf) return;
    setIsDrawing(false);
    if (currentPoints.length > 1) {
      addPdfAnnotation(activePdf.id, {
        page: currentPage,
        type: "draw",
        color: toolColor,
        points: currentPoints,
      });
    }
    setCurrentPoints([]);
  };

  const handleDownload = (pdf: PDFFile) => {
    if (pdf.base64Data) {
      const link = document.createElement("a");
      link.href = pdf.base64Data;
      link.download = pdf.title;
      link.click();
    } else {
      // Create a virtual text representation of study PDF
      const content = `GRADE 09 STUDY MATERIAL\nTitle: ${pdf.title}\nSubject: ${pdf.subjectId}\nPage Count: ${pdf.pageCount}\nOwner: ${user.name}\n\n-- Annotations --\n${pdf.annotations.map(a => `Page ${a.page} [${a.type}]: ${a.text || "Drawing"}`).join("\n")}`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = pdf.title.replace(".pdf", ".txt");
      link.click();
    }
  };

  return (
    <div id="pdf-library-page" className="space-y-6 pb-12">
      {/* Top Header & Cloud Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-indigo-600" />
            {t.pdf.myLibrary}
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            {t.pdf.privateNotice}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="create-folder-btn"
            onClick={() => setShowFolderModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 transition-all cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-amber-500" />
            <span>{t.pdf.newFolder}</span>
          </button>

          <button
            id="upload-pdf-modal-btn"
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>{t.common.upload} PDF</span>
          </button>
        </div>
      </div>

      {/* Filter and Folder Tabs Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-4">
        {/* Search & Subject select */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search PDFs by title, chapter or tag..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Subjects (13)</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name[language] || s.name.en}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Folders horizontal chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveFolder("All")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeFolder === "All"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-750 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>All Folders ({pdfFiles.length})</span>
          </button>

          {customFolders.map((folder) => {
            const count = pdfFiles.filter((p) => p.folder === folder).length;
            const isActive = activeFolder === folder;
            return (
              <button
                key={folder}
                onClick={() => setActiveFolder(folder)}
                className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm font-bold"
                    : "bg-slate-100 dark:bg-slate-750 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                <Folder className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {folder} ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PDF Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPdfs.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
            <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No PDFs found in this folder
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Upload your school textbooks, past papers, or homework sheets to keep them organized.
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Upload PDF Now
            </button>
          </div>
        ) : (
          filteredPdfs.map((pdf) => {
            const sub = subjects.find((s) => s.id === pdf.subjectId);
            return (
              <div
                key={pdf.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-extrabold text-xs">
                        PDF
                      </div>
                      <div>
                        <span
                          className="text-[10px] font-bold uppercase tracking-wide block"
                          style={{ color: sub?.color || "#6366F1" }}
                        >
                          {sub?.name[language] || pdf.subjectId}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Folder className="w-3 h-3 text-amber-500" />
                          {pdf.folder}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePdfFavourite(pdf.id)}
                        className={`p-1.5 rounded-lg text-slate-400 hover:text-amber-500 ${
                          pdf.isFavourite ? "text-amber-500 fill-amber-500" : ""
                        }`}
                      >
                        <Star className={`w-4 h-4 ${pdf.isFavourite ? "fill-amber-500" : ""}`} />
                      </button>
                      <button
                        onClick={() => togglePdfBookmark(pdf.id)}
                        className={`p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 ${
                          pdf.isBookmarked ? "text-indigo-600 fill-indigo-600" : ""
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${pdf.isBookmarked ? "fill-indigo-600" : ""}`} />
                      </button>
                      {pdf.isPersonalUpload && (
                        <button
                          onClick={() => deletePdfFile(pdf.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500"
                          title="Delete PDF"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 mb-1.5 leading-snug">
                    {pdf.title}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {pdf.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-750 text-[10px] text-slate-600 dark:text-slate-300 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer details & open reader button */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    <span>Page {pdf.lastReadPage} / {pdf.pageCount}</span>
                    {pdf.annotations.length > 0 && (
                      <span className="ml-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                        • {pdf.annotations.length} notes
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDownload(pdf)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`open-pdf-${pdf.id}`}
                      onClick={() => {
                        setSelectedPdfId(pdf.id);
                        setCurrentPage(pdf.lastReadPage || 1);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Read</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FULL IN-APP PDF READER MODAL WITH ANNOTATIONS */}
      {activePdf && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex flex-col">
          {/* Reader Top Toolbar */}
          <div className="h-14 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
            <div className="flex items-center gap-3 overflow-hidden">
              <button
                onClick={() => setSelectedPdfId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="overflow-hidden">
                <h2 className="text-xs sm:text-sm font-bold truncate max-w-md">
                  {activePdf.title}
                </h2>
                <span className="text-[10px] text-slate-400 block truncate">
                  {activePdf.folder} • Page {currentPage} of {activePdf.pageCount}
                </span>
              </div>
            </div>

            {/* Middle Zoom and Tool controls */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(60, z - 15))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-slate-300 w-12 text-center">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(180, z + 15))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-slate-700 mx-1" />

              {/* Annotation Tools */}
              <button
                onClick={() => {
                  setActiveTool(activeTool === "highlight" ? "none" : "highlight");
                  handleAddHighlight();
                }}
                className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-medium ${
                  activeTool === "highlight" ? "bg-amber-500 text-black font-bold" : "text-slate-400 hover:bg-slate-800"
                }`}
                title="Highlight"
              >
                <Highlighter className="w-4 h-4" />
                <span className="hidden lg:inline">{t.pdf.highlight}</span>
              </button>

              <button
                onClick={() => setActiveTool(activeTool === "draw" ? "none" : "draw")}
                className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-medium ${
                  activeTool === "draw" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:bg-slate-800"
                }`}
                title="Pen Drawing"
              >
                <PenTool className="w-4 h-4" />
                <span className="hidden lg:inline">{t.pdf.draw}</span>
              </button>

              <button
                onClick={() => setActiveTool(activeTool === "note" ? "none" : "note")}
                className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-medium ${
                  activeTool === "note" ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:bg-slate-800"
                }`}
                title="Add Margin Note"
              >
                <StickyNote className="w-4 h-4" />
                <span className="hidden lg:inline">{t.pdf.addNote}</span>
              </button>

              {/* Color selector */}
              <div className="flex items-center gap-1 ml-2">
                {["#fde047", "#38bdf8", "#4ade80", "#f43f5e"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setToolColor(c)}
                    className={`w-4 h-4 rounded-full border border-white/30 ${
                      toolColor === c ? "ring-2 ring-white scale-110" : ""
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownload(activePdf)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                title="Download PDF"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedPdfId(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Reader Main Content Area */}
          <div className="flex-1 overflow-auto bg-slate-950 p-4 sm:p-8 flex justify-center items-start relative">
            {/* Sheet Page Canvas representation */}
            <div
              className="bg-white text-slate-900 rounded-lg shadow-2xl transition-all duration-150 relative overflow-hidden flex flex-col"
              style={{
                width: `${(600 * zoomLevel) / 100}px`,
                minHeight: `${(850 * zoomLevel) / 100}px`,
              }}
            >
              {/* Header on page */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold tracking-wider uppercase text-indigo-600">
                  {activePdf.subjectId.toUpperCase()} • GRADE 09 CURRICULUM
                </span>
                <span>Page {currentPage} of {activePdf.pageCount}</span>
              </div>

              {/* Simulated / Real PDF page body */}
              <div className="p-8 flex-1 space-y-4 text-xs sm:text-sm leading-relaxed text-slate-800 relative select-text">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 border-b pb-2">
                  Unit Lesson {currentPage}: {activePdf.title.replace(".pdf", "")}
                </h2>

                <p>
                  <strong>Grade 09 Syllabus Overview:</strong> In this chapter, students investigate the underlying principles governing standard concepts. Focus is placed on definition precision, SI unit applications, and structured problem solving.
                </p>

                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs">
                  <h4 className="font-bold mb-1">Key Examination Standard:</h4>
                  <p>
                    Always verify your intermediate steps. For equations and formulas, state the governing formula before substituting numerical values to receive full method marks.
                  </p>
                </div>

                <p>
                  <strong>Theoretical Insights & Practical Observations:</strong>
                  Regular revision of diagrams and active recall using flashcards strengthens long-term memory retention. Students should cross-check definitions with the Official National Institute of Education (NIE) syllabus.
                </p>

                {/* Render Annotations on Page */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <h4 className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                    <StickyNote className="w-3.5 h-3.5" />
                    Saved Notes & Highlights for Page {currentPage}:
                  </h4>
                  {activePdf.annotations.filter((a) => a.page === currentPage).length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic">No notes or highlights on this page yet.</p>
                  ) : (
                    activePdf.annotations
                      .filter((a) => a.page === currentPage)
                      .map((anno) => (
                        <div
                          key={anno.id}
                          className="p-2 rounded-lg text-xs flex items-start justify-between gap-2"
                          style={{ backgroundColor: `${anno.color}25`, borderLeft: `3px solid ${anno.color}` }}
                        >
                          <p className="flex-1 font-medium">{anno.text || "Handwritten Pen annotation"}</p>
                          <button
                            onClick={() => deletePdfAnnotation(activePdf.id, anno.id)}
                            className="text-slate-400 hover:text-rose-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                  )}
                </div>

                {/* Overlay Pen Canvas */}
                {activeTool === "draw" && (
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={800}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    className="absolute inset-0 z-20 cursor-crosshair"
                  />
                )}
              </div>

              {/* Page Footer */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>Grade 09 Smart Learning Hub • Sri Lankan Curriculum</span>
                <span>Document ID: {activePdf.id}</span>
              </div>
            </div>

            {/* Note input popup if note tool active */}
            {activeTool === "note" && (
              <div className="fixed right-6 bottom-20 w-80 bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-2xl z-30 text-white">
                <h4 className="text-xs font-bold mb-2 flex items-center gap-1.5 text-blue-400">
                  <StickyNote className="w-4 h-4" />
                  Add Margin Note for Page {currentPage}
                </h4>
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Type your personal note here..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-slate-400">Saved to Cloud</span>
                  <button
                    onClick={handleAddNote}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold cursor-pointer"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reader Bottom Navigation Bar */}
          <div className="h-14 px-6 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-white text-xs">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.common.prev}</span>
            </button>

            <div className="flex items-center gap-2">
              <span>{t.pdf.page}</span>
              <input
                type="number"
                min={1}
                max={activePdf.pageCount}
                value={currentPage}
                onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
                className="w-12 py-1 text-center bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
              />
              <span>{t.pdf.of} {activePdf.pageCount}</span>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= activePdf.pageCount}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <span>{t.common.next}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* UPLOAD PDF MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                {t.pdf.uploadPrompt}
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              {/* File Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-300 dark:border-indigo-700/60 rounded-2xl p-6 text-center hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all cursor-pointer"
              >
                <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {uploadFileName || t.pdf.dragDrop}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Supports .pdf textbooks, past paper printouts, worksheets
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Title input */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  PDF Title
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g., Grade 09 Science Second Term Past Paper 2024"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Subject & Folder Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={uploadSubject}
                    onChange={(e) => setUploadSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
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
                    Folder
                  </label>
                  <select
                    value={uploadFolder}
                    onChange={(e) => setUploadFolder(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {customFolders.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Estimated Pages
                </label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={uploadPageCount}
                  onChange={(e) => setUploadPageCount(parseInt(e.target.value) || 10)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 font-bold"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  Save to Personal Cloud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE FOLDER MODAL */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-amber-500" />
              {t.pdf.newFolder}
            </h3>
            <input
              type="text"
              autoFocus
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="e.g. Model Exam Papers 2026"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowFolderModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={() => {
                  if (newFolderName.trim()) {
                    setCustomFolders((prev) => [...prev, newFolderName.trim()]);
                    setActiveFolder(newFolderName.trim());
                    setNewFolderName("");
                    setShowFolderModal(false);
                  }
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {t.common.create}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
