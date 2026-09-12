import React, { useState } from "react";
import {
  FlaskConical,
  Zap,
  TestTube,
  Sun,
  RotateCcw,
  Sliders,
  Info,
  Sparkles,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations";

export const ScienceLab: React.FC = () => {
  const { language } = useApp();
  const t = getTranslation(language);

  // Active experiment tab: 'density' | 'circuit' | 'ph' | 'refraction'
  const [activeExperiment, setActiveExperiment] = useState<"density" | "circuit" | "ph" | "refraction">("density");

  // 1. DENSITY STATE
  const [mass, setMass] = useState<number>(120); // grams
  const [volume, setVolume] = useState<number>(150); // cm3
  const [liquidDensity, setLiquidDensity] = useState<number>(1.0); // water = 1.0, oil = 0.8, mercury = 13.6
  const objectDensity = parseFloat((mass / volume).toFixed(2));
  const willFloat = objectDensity < liquidDensity;

  // 2. CIRCUIT STATE (Ohm's Law)
  const [voltage, setVoltage] = useState<number>(6); // Volts
  const [resistance, setResistance] = useState<number>(10); // Ohms
  const current = parseFloat((voltage / resistance).toFixed(2)); // Amperes
  const power = parseFloat((voltage * current).toFixed(2)); // Watts

  // 3. pH & ACID/BASE STATE
  const [selectedSubstance, setSelectedSubstance] = useState<string>("lemon");
  const [selectedIndicator, setSelectedIndicator] = useState<"litmus" | "phenolphthalein" | "methylOrange">("litmus");

  const substances: Record<string, { name: string; pH: number; type: string }> = {
    lemon: { name: "Lemon Juice (Citric Acid)", pH: 2.2, type: "Strong Acid" },
    vinegar: { name: "Vinegar (Acetic Acid)", pH: 3.0, type: "Weak Acid" },
    water: { name: "Pure Distilled Water", pH: 7.0, type: "Neutral" },
    soap: { name: "Soap Water Solution", pH: 9.5, type: "Weak Base" },
    naoh: { name: "Sodium Hydroxide (NaOH)", pH: 13.0, type: "Strong Base" },
  };

  const getIndicatorColor = (pH: number, indicator: string) => {
    if (indicator === "litmus") {
      if (pH < 7) return "#ef4444"; // Red in acid
      if (pH > 7) return "#3b82f6"; // Blue in base
      return "#a855f7"; // Purple neutral
    }
    if (indicator === "phenolphthalein") {
      if (pH >= 8.3) return "#ec4899"; // Pink in base
      return "#f8fafc"; // Colorless in acid/neutral
    }
    // Methyl Orange
    if (pH <= 3.1) return "#dc2626"; // Red
    if (pH >= 4.4) return "#eab308"; // Yellow
    return "#f97316"; // Orange
  };

  // 4. REFRACTION STATE (Snell's Law)
  const [incidenceAngle, setIncidenceAngle] = useState<number>(45); // degrees
  const glassRefractiveIndex = 1.5; // n2 (air n1 = 1.0)
  const sinR = Math.sin((incidenceAngle * Math.PI) / 180) / glassRefractiveIndex;
  const refractionAngle = Math.round((Math.asin(Math.min(1, sinR)) * 180) / Math.PI);

  return (
    <div id="science-lab-page" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <FlaskConical className="w-6 h-6 text-emerald-500" />
            Virtual Science Laboratory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Interactive Grade 09 practical simulations for Physics & Chemistry
          </p>
        </div>

        {/* Experiment Selector Tabs */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold overflow-x-auto self-start sm:self-auto">
          <button
            onClick={() => setActiveExperiment("density")}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeExperiment === "density"
                ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Density & Buoyancy
          </button>
          <button
            onClick={() => setActiveExperiment("circuit")}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeExperiment === "circuit"
                ? "bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Ohm's Law Circuit
          </button>
          <button
            onClick={() => setActiveExperiment("ph")}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeExperiment === "ph"
                ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Acids, Bases & pH
          </button>
          <button
            onClick={() => setActiveExperiment("refraction")}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeExperiment === "refraction"
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Light Refraction
          </button>
        </div>
      </div>

      {/* 1. DENSITY & BUOYANCY EXPERIMENT */}
      {activeExperiment === "density" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-500" />
              Experiment Parameters
            </h2>

            {/* Mass slider */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-600 dark:text-slate-400">Object Mass (m):</span>
                <span className="text-emerald-600">{mass} grams</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                value={mass}
                onChange={(e) => setMass(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            {/* Volume slider */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-600 dark:text-slate-400">Object Volume (V):</span>
                <span className="text-emerald-600">{volume} cm³</span>
              </div>
              <input
                type="range"
                min="20"
                max="400"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            {/* Liquid select */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Immersion Liquid:
              </label>
              <select
                value={liquidDensity}
                onChange={(e) => setLiquidDensity(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <option value={1.0}>Water (Density: 1.00 g/cm³)</option>
                <option value={0.8}>Kerosene / Cooking Oil (Density: 0.80 g/cm³)</option>
                <option value={1.26}>Glycerin (Density: 1.26 g/cm³)</option>
                <option value={13.6}>Mercury (Density: 13.60 g/cm³)</option>
              </select>
            </div>

            {/* Formula box */}
            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-1 text-xs">
              <span className="font-bold text-emerald-800 dark:text-emerald-300">
                Formula: Density (ρ) = Mass / Volume
              </span>
              <p className="text-emerald-950 dark:text-emerald-200">
                ρ = {mass}g ÷ {volume}cm³ = <strong>{objectDensity} g/cm³</strong>
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
                {willFloat
                  ? `Object floats because ρ (${objectDensity}) < liquid ρ (${liquidDensity})`
                  : `Object sinks because ρ (${objectDensity}) > liquid ρ (${liquidDensity})`}
              </p>
            </div>
          </div>

          {/* Visual Tank Simulation (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col items-center justify-between min-h-[380px]">
            <div className="w-full flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>Beaker Simulation</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${willFloat ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                {willFloat ? "Floating in Equilibrium" : "Sunken to Bottom"}
              </span>
            </div>

            {/* Simulated Water Glass */}
            <div className="relative w-64 h-64 border-4 border-slate-300 dark:border-slate-600 rounded-b-3xl overflow-hidden bg-slate-50 dark:bg-slate-900 mt-4 flex items-end justify-center shadow-inner">
              {/* Liquid Layer */}
              <div
                className="w-full h-44 transition-all duration-300 relative flex items-center justify-center"
                style={{
                  backgroundColor:
                    liquidDensity === 13.6
                      ? "#94a3b8"
                      : liquidDensity === 0.8
                      ? "#fef08a"
                      : "#60a5fa80",
                }}
              >
                <span className="absolute bottom-2 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  Liquid Level (ρ = {liquidDensity} g/cm³)
                </span>

                {/* Object block */}
                <div
                  className="rounded-xl shadow-lg border border-slate-700 flex items-center justify-center text-white text-[10px] font-bold transition-all duration-700 absolute"
                  style={{
                    width: `${Math.min(90, Math.max(40, volume / 4))}px`,
                    height: `${Math.min(90, Math.max(40, volume / 4))}px`,
                    backgroundColor: "#b45309",
                    top: willFloat ? "20px" : "110px",
                  }}
                >
                  {objectDensity} g/cm³
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 text-center mt-4">
              Archimedes Principle: Upthrust equals the weight of the fluid displaced by the object.
            </p>
          </div>
        </div>
      )}

      {/* 2. OHM'S LAW ELECTRIC CIRCUIT */}
      {activeExperiment === "circuit" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Circuit Controls (Ohm's Law: V = I × R)
            </h2>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-600 dark:text-slate-400">Battery Voltage (V):</span>
                <span className="text-amber-600">{voltage} Volts</span>
              </div>
              <input
                type="range"
                min="1"
                max="24"
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-600 dark:text-slate-400">Resistor Resistance (R):</span>
                <span className="text-amber-600">{resistance} Ω (Ohms)</span>
              </div>
              <input
                type="range"
                min="2"
                max="50"
                value={resistance}
                onChange={(e) => setResistance(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-amber-800 dark:text-amber-300 font-bold">Electric Current (I = V / R):</span>
                <span className="font-extrabold text-amber-900 dark:text-amber-100">{current} Amperes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-800 dark:text-amber-300 font-bold">Power Dissipated (P = V × I):</span>
                <span className="font-extrabold text-amber-900 dark:text-amber-100">{power} Watts</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col items-center justify-center min-h-[380px] text-center">
            {/* Visual Light Bulb Glowing */}
            <div className="relative mb-6">
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 mx-auto"
                style={{
                  backgroundColor: current > 0.05 ? "#fbbf24" : "#cbd5e1",
                  boxShadow: current > 0.1 ? `0 0 ${current * 35}px #fbbf24` : "none",
                  opacity: Math.min(1, Math.max(0.3, current * 0.8)),
                }}
              >
                <Zap className={`w-12 h-12 ${current > 0.1 ? "text-amber-900" : "text-slate-400"}`} />
              </div>
              <span className="block text-xs font-bold mt-3 text-slate-800 dark:text-slate-200">
                Light Bulb Brightness: {Math.round(current * 100)}%
              </span>
            </div>

            {/* Meters readouts */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Voltmeter</span>
                <span className="text-lg font-mono font-bold text-amber-600">{voltage}.00 V</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Ammeter</span>
                <span className="text-lg font-mono font-bold text-indigo-600">{current} A</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. pH & ACIDS / BASES */}
      {activeExperiment === "ph" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TestTube className="w-4 h-4 text-rose-500" />
              Test Substance & Indicator
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select Common Solution:
              </label>
              <select
                value={selectedSubstance}
                onChange={(e) => setSelectedSubstance(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                {Object.entries(substances).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.name} (pH {v.pH})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Chemical Indicator:
              </label>
              <select
                value={selectedIndicator}
                onChange={(e) => setSelectedIndicator(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <option value="litmus">Litmus Paper / Solution (Red in Acid, Blue in Base)</option>
                <option value="phenolphthalein">Phenolphthalein (Pink in Base, Colorless in Acid)</option>
                <option value="methylOrange">Methyl Orange (Red in pH &lt; 3.1, Yellow in pH &gt; 4.4)</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs space-y-1">
              <span className="font-bold text-rose-900 dark:text-rose-200 block">
                Substance Classification: {substances[selectedSubstance].type}
              </span>
              <p className="text-rose-800 dark:text-rose-300">
                pH Value: <strong>{substances[selectedSubstance].pH}</strong>
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col items-center justify-between min-h-[380px]">
            <div className="text-xs font-bold text-slate-500">Test Tube Observation</div>

            {/* Test Tube Graphic */}
            <div className="relative w-20 h-56 border-4 border-slate-300 dark:border-slate-600 rounded-b-full overflow-hidden bg-slate-50 dark:bg-slate-900 flex items-end justify-center shadow-md">
              <div
                className="w-full h-40 transition-colors duration-500"
                style={{
                  backgroundColor: getIndicatorColor(
                    substances[selectedSubstance].pH,
                    selectedIndicator
                  ),
                }}
              />
            </div>

            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-4">
              Indicator reaction observed: Solution tinted with selected reagent.
            </p>
          </div>
        </div>
      )}

      {/* 4. LIGHT REFRACTION & PRISM */}
      {activeExperiment === "refraction" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sun className="w-4 h-4 text-blue-500" />
              Refraction Parameters (Snell's Law: n = sin(i) / sin(r))
            </h2>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-600 dark:text-slate-400">Angle of Incidence (i):</span>
                <span className="text-blue-600">{incidenceAngle}°</span>
              </div>
              <input
                type="range"
                min="5"
                max="85"
                value={incidenceAngle}
                onChange={(e) => setIncidenceAngle(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300 font-bold">Glass Refractive Index (n):</span>
                <span className="font-extrabold text-blue-950 dark:text-blue-100">1.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800 dark:text-blue-300 font-bold">Angle of Refraction (r):</span>
                <span className="font-extrabold text-blue-950 dark:text-blue-100">{refractionAngle}°</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col items-center justify-center min-h-[380px]">
            <svg width="320" height="240" className="bg-slate-900 rounded-2xl shadow-inner">
              {/* Glass Block */}
              <rect x="60" y="80" width="200" height="100" fill="#38bdf820" stroke="#38bdf8" strokeWidth="2" />
              <text x="130" y="135" fill="#38bdf8" fontSize="12" fontWeight="bold">Glass (n=1.5)</text>

              {/* Normal line */}
              <line x1="160" y1="40" x2="160" y2="200" stroke="#94a3b8" strokeDasharray="4" strokeWidth="1" />

              {/* Incident Ray */}
              <line
                x1={160 - Math.tan((incidenceAngle * Math.PI) / 180) * 40}
                y1="40"
                x2="160"
                y2="80"
                stroke="#fbbf24"
                strokeWidth="3"
              />

              {/* Refracted Ray */}
              <line
                x1="160"
                y1="80"
                x2={160 + Math.tan((refractionAngle * Math.PI) / 180) * 100}
                y2="180"
                stroke="#38bdf8"
                strokeWidth="3"
              />
            </svg>
            <span className="text-xs text-slate-400 mt-4">
              Light bends towards the normal as it enters an optically denser medium (air to glass).
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
