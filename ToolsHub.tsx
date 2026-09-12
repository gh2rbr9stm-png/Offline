import React, { useState, useRef } from "react";
import {
  Wrench,
  Calculator,
  Book,
  PenTool,
  Printer,
  Sparkles,
  Eraser,
  RotateCcw,
  Search,
  Check,
  Copy,
  Download,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations";

export const ToolsHub: React.FC = () => {
  const { language } = useApp();
  const t = getTranslation(language);

  // Active Tool: 'calc' | 'formula' | 'dict' | 'whiteboard'
  const [activeTool, setActiveTool] = useState<"calc" | "formula" | "dict" | "whiteboard">("calc");

  // 1. SCIENTIFIC CALCULATOR STATE
  const [calcDisplay, setCalcDisplay] = useState<string>("0");
  const [calcHistory, setCalcHistory] = useState<string[]>([]);

  const handleCalcButton = (val: string) => {
    if (val === "C") {
      setCalcDisplay("0");
    } else if (val === "⌫") {
      setCalcDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    } else if (val === "=") {
      try {
        // Safe arithmetic eval
        const sanitized = calcDisplay.replace(/×/g, "*").replace(/÷/g, "/");
        const res = Function(`"use strict"; return (${sanitized})`)();
        setCalcHistory((prev) => [`${calcDisplay} = ${res}`, ...prev.slice(0, 9)]);
        setCalcDisplay(String(res));
      } catch {
        setCalcDisplay("Error");
      }
    } else if (val === "sqrt") {
      try {
        const res = Math.sqrt(parseFloat(calcDisplay));
        setCalcDisplay(String(res));
      } catch {
        setCalcDisplay("Error");
      }
    } else if (val === "sq") {
      try {
        const num = parseFloat(calcDisplay);
        setCalcDisplay(String(num * num));
      } catch {
        setCalcDisplay("Error");
      }
    } else {
      setCalcDisplay((prev) => (prev === "0" || prev === "Error" ? val : prev + val));
    }
  };

  // 2. FORMULA SHEET DATA
  const [formulaSubjectFilter, setFormulaSubjectFilter] = useState("all");
  const formulaList = [
    { subject: "math", name: "Pythagoras' Theorem", formula: "a² + b² = c²", desc: "For right-angled triangles, where c is hypotenuse" },
    { subject: "math", name: "Quadratic Formula", formula: "x = (-b ± √(b² - 4ac)) / 2a", desc: "Roots of ax² + bx + c = 0" },
    { subject: "math", name: "Area of a Circle", formula: "A = πr²", desc: "r is the radius of the circle" },
    { subject: "math", name: "Circumference of a Circle", formula: "C = 2πr", desc: "Perimeter around the circle" },
    { subject: "science", name: "Density Formula", formula: "ρ = m / V", desc: "Density = Mass divided by Volume (g/cm³ or kg/m³)" },
    { subject: "science", name: "Ohm's Law", formula: "V = I × R", desc: "Voltage = Current × Resistance" },
    { subject: "science", name: "Speed / Velocity", formula: "v = d / t", desc: "Velocity = Distance divided by time (m/s)" },
    { subject: "science", name: "Force (Newton's 2nd Law)", formula: "F = m × a", desc: "Force = Mass × Acceleration (N)" },
    { subject: "science", name: "Electric Power", formula: "P = V × I", desc: "Power in Watts = Voltage × Current" },
    { subject: "science", name: "Work Done", formula: "W = F × d", desc: "Work in Joules = Force × displacement" },
  ];

  // 3. DICTIONARY STATE
  const [dictQuery, setDictQuery] = useState("");
  const glossary = [
    {
      term: "Photosynthesis (ஒளிச்சேர்க்கை / ප්‍රභාසංස්ලේෂණය)",
      en: "The biological process by which green plants manufacture carbohydrates from carbon dioxide and water in the presence of sunlight and chlorophyll.",
      ta: "பச்சைத் தாவரங்கள் சூரிய ஒளி மற்றும் பச்சையத்தின் முன்னிலையில் காபனீரொட்சைட்டையும் நீரையும் கொண்டு உணவு தயாரிக்கும் உயிர்ச்செயன்முறை.",
      si: "හරිත ශාක සූර්යාලෝකය සහ හරිතප්‍රද භාවිතයෙන් කාබන් ඩයොක්සයිඩ් හා ජලයෙන් ආහාර නිපදවීමේ ක්‍රියාවලිය.",
    },
    {
      term: "Osmosis (பிரசாரணம் / ආස්‍රැතිය)",
      en: "The net movement of water molecules from a region of higher water concentration to a region of lower water concentration across a semi-permeable membrane.",
      ta: "அரைபுகவிடும் மென்சவ்வினூடாக நீர் மூலக்கூறுகள் உயர் நீர்ச்செறிவிலிருந்து தாழ் நீர்ச்செறிவை நோக்கி நிகழும் நிகர இயக்கம்.",
      si: "අර්ධ පාරගම්‍ය පටලයක් හරහා ජල අණු වැඩි සාන්ද්‍රණයේ සිට අඩු සාන්ද්‍රණයකට ගමන් කිරීම.",
    },
    {
      term: "Inertia (சடத்துவம் / අවස්ථිතිතාව)",
      en: "The natural property of an object to resist changes in its state of rest or uniform motion unless acted on by an external unbalanced force.",
      ta: "புறவிசை ஒன்று தொழிற்படாத வரையில் ஒரு பொருள் தனது ஓய்வு நிலையையோ அல்லது சீரான இயக்க நிலையையோ மாற்றியமைப்பதை எதிர்க்கும் தன்மை.",
      si: "බාහිර බලයක් නොයෙදෙන තාක් වස්තුවක් තම නිශ්චලතාව හෝ ඒකාකාර චලිතය පවත්වා ගැනීමට ඇති නැඹුරුව.",
    },
  ];

  // 4. WHITEBOARD STATE
  const whiteboardRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState("#4f46e5");
  const [brushSize, setBrushSize] = useState(3);

  const startWhiteboardDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = whiteboardRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const drawOnWhiteboard = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = whiteboardRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const clearWhiteboard = () => {
    const canvas = whiteboardRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div id="tools-hub-page" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Wrench className="w-6 h-6 text-indigo-600" />
            Grade 09 Student Toolkit
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Scientific calculator, formula bank, trilingual glossary & interactive scratchpad
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold overflow-x-auto self-start sm:self-auto">
          <button
            onClick={() => setActiveTool("calc")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTool === "calc"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Calculator
          </button>
          <button
            onClick={() => setActiveTool("formula")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTool === "formula"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Formula Bank
          </button>
          <button
            onClick={() => setActiveTool("dict")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTool === "dict"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Trilingual Glossary
          </button>
          <button
            onClick={() => setActiveTool("whiteboard")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTool === "whiteboard"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Scratch Whiteboard
          </button>
        </div>
      </div>

      {/* 1. CALCULATOR TOOL */}
      {activeTool === "calc" && (
        <div className="max-w-md mx-auto p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-xl space-y-4">
          {/* Display */}
          <div className="p-4 rounded-2xl bg-slate-900 text-right text-white font-mono overflow-hidden">
            <span className="text-xs text-slate-400 block h-4">
              {calcHistory[0] || ""}
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight truncate block">
              {calcDisplay}
            </span>
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-4 gap-2 text-sm font-bold">
            {["C", "⌫", "sq", "÷", "7", "8", "9", "×", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "sqrt", "="].map((btn) => {
              const isAction = ["C", "⌫", "sq", "sqrt"].includes(btn);
              const isOperator = ["÷", "×", "-", "+"].includes(btn);
              const isEquals = btn === "=";

              let color = "bg-slate-100 dark:bg-slate-750 text-slate-800 dark:text-slate-200 hover:bg-slate-200";
              if (isAction) color = "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white";
              if (isOperator) color = "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300";
              if (isEquals) color = "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20";

              return (
                <button
                  key={btn}
                  onClick={() => handleCalcButton(btn)}
                  className={`py-3.5 rounded-2xl transition-all active:scale-95 cursor-pointer ${color}`}
                >
                  {btn}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. FORMULA SHEET */}
      {activeTool === "formula" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Filter Subject:</span>
            <select
              value={formulaSubjectFilter}
              onChange={(e) => setFormulaSubjectFilter(e.target.value)}
              className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Formulas</option>
              <option value="math">Mathematics</option>
              <option value="science">Science / Physics</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formulaList
              .filter((f) => formulaSubjectFilter === "all" || f.subject === formulaSubjectFilter)
              .map((f, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">
                      {f.subject === "math" ? "Mathematics" : "Science"}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{f.name}</h3>
                    <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-750 font-mono text-base font-extrabold text-indigo-600 dark:text-indigo-300 text-center">
                      {f.formula}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">{f.desc}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 3. TRILINGUAL GLOSSARY */}
      {activeTool === "dict" && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={dictQuery}
              onChange={(e) => setDictQuery(e.target.value)}
              placeholder="Search scientific and historical terms..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-4">
            {glossary
              .filter((g) => g.term.toLowerCase().includes(dictQuery.toLowerCase()))
              .map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-3"
                >
                  <h3 className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                    {item.term}
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750">
                      <span className="font-bold text-slate-400 block mb-0.5">English Definition:</span>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{item.en}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750">
                      <span className="font-bold text-slate-400 block mb-0.5">தமிழ் விளக்கம்:</span>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-tamil">{item.ta}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750">
                      <span className="font-bold text-slate-400 block mb-0.5">සිංහල අර්ථ දැක්වීම:</span>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-sinhala">{item.si}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 4. SCRATCHPAD WHITEBOARD */}
      {activeTool === "whiteboard" && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span>Color:</span>
              {["#4f46e5", "#ef4444", "#10b981", "#f59e0b", "#0f172a"].map((c) => (
                <button
                  key={c}
                  onClick={() => setDrawColor(c)}
                  className={`w-6 h-6 rounded-full border border-white/50 ${drawColor === c ? "ring-2 ring-indigo-500 scale-110" : ""}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearWhiteboard}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-750 hover:bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Clear Canvas</span>
              </button>
            </div>
          </div>

          <div className="border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden bg-white shadow-inner flex justify-center">
            <canvas
              ref={whiteboardRef}
              width={750}
              height={450}
              onMouseDown={startWhiteboardDraw}
              onMouseMove={drawOnWhiteboard}
              onMouseUp={() => setIsDrawing(false)}
              onMouseLeave={() => setIsDrawing(false)}
              className="cursor-crosshair w-full max-w-[750px] touch-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
