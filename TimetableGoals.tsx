import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  Award,
  Bell,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations";

export const TimetableGoals: React.FC = () => {
  const {
    timetable,
    addTimetableEntry,
    deleteTimetableEntry,
    toggleTimetableEntry,
    goals,
    addGoal,
    toggleGoal,
    deleteGoal,
    recordStudyMinutes,
    subjects,
    language,
    user,
  } = useApp();

  const t = getTranslation(language);

  // Sub-tab: 'planner' | 'pomodoro'
  const [activeTab, setActiveTab] = useState<"planner" | "pomodoro">("planner");
  const [selectedDay, setSelectedDay] = useState<number>(1); // 1 = Monday

  // Add timetable modal
  const [showAddEntryModal, setShowAddEntryModal] = useState(false);
  const [entrySubject, setEntrySubject] = useState("science");
  const [entryTopic, setEntryTopic] = useState("");
  const [entryStart, setEntryStart] = useState("16:00");
  const [entryEnd, setEntryEnd] = useState("17:00");

  // Add goal modal
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalTargetMinutes, setGoalTargetMinutes] = useState(45);

  // POMODORO TIMER STATE
  const [timerMode, setTimerMode] = useState<"focus" | "shortBreak" | "longBreak">("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSound, setSelectedSound] = useState<"none" | "rain" | "ocean" | "whiteNoise">("none");
  const [sessionCount, setSessionCount] = useState(0);

  // Web Audio Context for offline ambient sounds
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundNodeRef = useRef<any>(null);

  const days = [
    { id: 1, label: "Monday" },
    { id: 2, label: "Tuesday" },
    { id: 3, label: "Wednesday" },
    { id: 4, label: "Thursday" },
    { id: 5, label: "Friday" },
    { id: 6, label: "Saturday" },
    { id: 0, label: "Sunday" },
  ];

  // Pomodoro countdown effect
  useEffect(() => {
    let interval: any;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      // Bell chime
      playBellSound();
      if (timerMode === "focus") {
        recordStudyMinutes(25);
        setSessionCount((c) => c + 1);
        setTimerMode("shortBreak");
        setTimeLeft(5 * 60);
      } else {
        setTimerMode("focus");
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, timerMode]);

  // Audio synthesizer for ambient sound
  const playBellSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch {}
  };

  const startAmbientSound = (type: "rain" | "ocean" | "whiteNoise") => {
    stopAmbientSound();
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;

      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === "rain") {
          // Pink noise filter
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 0.8;
        } else if (type === "ocean") {
          // Low rumbling waves
          output[i] = (lastOut + 0.005 * white) / 1.005;
          lastOut = output[i];
          output[i] *= 1.5;
        } else {
          output[i] = white * 0.1;
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);

      whiteNoise.connect(gainNode);
      gainNode.connect(ctx.destination);
      whiteNoise.start();

      soundNodeRef.current = { source: whiteNoise, gain: gainNode, ctx };
    } catch (e) {
      console.warn("Ambient sound error:", e);
    }
  };

  const stopAmbientSound = () => {
    if (soundNodeRef.current) {
      try {
        soundNodeRef.current.source.stop();
        soundNodeRef.current.ctx.close();
      } catch {}
      soundNodeRef.current = null;
    }
  };

  const handleSoundChange = (type: "none" | "rain" | "ocean" | "whiteNoise") => {
    setSelectedSound(type);
    if (type === "none") {
      stopAmbientSound();
    } else {
      startAmbientSound(type);
    }
  };

  // Switch mode
  const switchTimerMode = (mode: "focus" | "shortBreak" | "longBreak") => {
    setIsRunning(false);
    setTimerMode(mode);
    if (mode === "focus") setTimeLeft(25 * 60);
    else if (mode === "shortBreak") setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  // Add timetable entry submit
  const handleAddEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryTopic.trim()) return;
    addTimetableEntry({
      dayOfWeek: selectedDay,
      startTime: entryStart,
      endTime: entryEnd,
      subjectId: entrySubject,
      topic: entryTopic.trim(),
      completed: false,
    });
    setEntryTopic("");
    setShowAddEntryModal(false);
  };

  // Add goal submit
  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    addGoal({
      title: goalTitle.trim(),
      completed: false,
      targetMinutes: goalTargetMinutes,
      category: "study",
    });
    setGoalTitle("");
    setShowAddGoalModal(false);
  };

  const dayEntries = timetable.filter((item) => item.dayOfWeek === selectedDay);

  // Time format
  const timerMins = Math.floor(timeLeft / 60);
  const timerSecs = timeLeft % 60;
  const timerString = `${timerMins.toString().padStart(2, "0")}:${timerSecs.toString().padStart(2, "0")}`;

  return (
    <div id="timetable-goals-page" className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-indigo-600" />
            Study Planner, Timetable & Focus Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize Grade 09 daily study routines, target goals, and boost concentration with Pomodoro
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("planner")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "planner"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Weekly Schedule & Goals
          </button>
          <button
            onClick={() => setActiveTab("pomodoro")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "pomodoro"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Focus Pomodoro</span>
          </button>
        </div>
      </div>

      {/* 1. PLANNER & GOALS MODE */}
      {activeTab === "planner" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Daily Goals Panel (4 cols) */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {t.dashboard.dailyGoals}
                </h2>
                <button
                  onClick={() => setShowAddGoalModal(true)}
                  className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {goals.map((g) => (
                  <div
                    key={g.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-2.5 transition-all ${
                      g.completed
                        ? "bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/40 opacity-75"
                        : "bg-white dark:bg-slate-750 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <div
                      onClick={() => toggleGoal(g.id)}
                      className="flex items-center gap-2.5 flex-1 cursor-pointer"
                    >
                      {g.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                      <span
                        className={`text-xs font-medium leading-snug ${
                          g.completed ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-100"
                        }`}
                      >
                        {g.title}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteGoal(g.id)}
                      className="text-slate-300 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Streak motivator */}
            <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center gap-3">
              <Flame className="w-6 h-6 text-amber-500 fill-amber-500 animate-pulse flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-900 dark:text-amber-300">
                  {user.streakDays} Day Study Streak!
                </p>
                <p className="text-[10px] text-amber-700 dark:text-amber-400">
                  Complete today's goals to extend your streak and unlock badges.
                </p>
              </div>
            </div>
          </div>

          {/* Weekly Timetable Schedule (8 cols) */}
          <div className="lg:col-span-8 p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                Weekly Schedule
              </h2>
              <button
                onClick={() => setShowAddEntryModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Study Session</span>
              </button>
            </div>

            {/* Day Selector Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {days.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDay(d.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedDay === d.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-750 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Timetable entries list */}
            <div className="space-y-3 pt-2">
              {dayEntries.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <Calendar className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">
                    No study sessions scheduled for this day. Click "Add Study Session" to plan ahead!
                  </p>
                </div>
              ) : (
                dayEntries.map((item) => {
                  const sub = subjects.find((s) => s.id === item.subjectId);
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-750 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTimetableEntry(item.id)}
                          className="cursor-pointer text-slate-400 hover:text-emerald-500"
                        >
                          {item.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300" />
                          )}
                        </button>

                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: sub?.color || "#6366F1" }}
                        >
                          {sub?.name.en.charAt(0) || "S"}
                        </div>

                        <div>
                          <p
                            className={`text-xs font-bold ${
                              item.completed ? "line-through text-slate-400" : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {sub?.name[language] || item.subjectId}
                          </p>
                          <p className="text-[11px] text-slate-500">{item.topic}</p>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block mt-0.5">
                            {item.startTime} - {item.endTime}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteTimetableEntry(item.id)}
                        className="text-slate-300 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. FOCUS POMODORO & AMBIENT SOUNDS */}
      {activeTab === "pomodoro" && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-xl text-center space-y-6">
            {/* Mode selection buttons */}
            <div className="flex items-center justify-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-750 text-xs font-bold">
              <button
                onClick={() => switchTimerMode("focus")}
                className={`px-4 py-2 rounded-xl transition-all ${
                  timerMode === "focus"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Focus (25m)
              </button>
              <button
                onClick={() => switchTimerMode("shortBreak")}
                className={`px-4 py-2 rounded-xl transition-all ${
                  timerMode === "shortBreak"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Short Break (5m)
              </button>
              <button
                onClick={() => switchTimerMode("longBreak")}
                className={`px-4 py-2 rounded-xl transition-all ${
                  timerMode === "longBreak"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Long Break (15m)
              </button>
            </div>

            {/* Giant Clock Display */}
            <div className="py-4">
              <span className="text-6xl sm:text-7xl font-mono font-extrabold tracking-tight text-slate-900 dark:text-white">
                {timerString}
              </span>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                {timerMode === "focus"
                  ? "🧠 Deep Concentration Mode — Stay off social media & distractions"
                  : "☕ Rest your eyes, drink water and stretch"}
              </p>
            </div>

            {/* Play, Pause & Reset Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-8 py-3.5 rounded-2xl text-white font-extrabold text-sm shadow-lg flex items-center gap-2 transition-all cursor-pointer ${
                  isRunning
                    ? "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25"
                }`}
              >
                {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                <span>{isRunning ? "Pause Session" : "Start Session"}</span>
              </button>

              <button
                onClick={() => {
                  setIsRunning(false);
                  if (timerMode === "focus") setTimeLeft(25 * 60);
                  else if (timerMode === "shortBreak") setTimeLeft(5 * 60);
                  else setTimeLeft(15 * 60);
                }}
                className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-750 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Ambient Sound Player */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Volume2 className="w-4 h-4 text-indigo-500" />
                Background Study Atmosphere (Works Offline)
              </span>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { id: "none", label: "Mute" },
                  { id: "rain", label: "Gentle Rain 🌧️" },
                  { id: "ocean", label: "Ocean Waves 🌊" },
                  { id: "whiteNoise", label: "Soft Noise 📻" },
                ].map((snd) => (
                  <button
                    key={snd.id}
                    onClick={() => handleSoundChange(snd.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedSound === snd.id
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-750 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {snd.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD ENTRY MODAL */}
      {showAddEntryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add Timetable Session</h3>
              <button onClick={() => setShowAddEntryModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEntrySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <select
                  value={entrySubject}
                  onChange={(e) => setEntrySubject(e.target.value)}
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
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Topic / Lesson</label>
                <input
                  type="text"
                  required
                  value={entryTopic}
                  onChange={(e) => setEntryTopic(e.target.value)}
                  placeholder="e.g. Chemical Bonding & Electron Configuration"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={entryStart}
                    onChange={(e) => setEntryStart(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">End Time</label>
                  <input
                    type="time"
                    value={entryEnd}
                    onChange={(e) => setEntryEnd(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddEntryModal(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD GOAL MODAL */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Create Daily Study Goal</h3>
            <form onSubmit={handleAddGoalSubmit} className="space-y-3 text-xs">
              <input
                type="text"
                required
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="e.g. Read 5 pages of History and take 1 quiz"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-3 py-1.5 text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
