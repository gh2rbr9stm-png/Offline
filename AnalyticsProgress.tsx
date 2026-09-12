import React from "react";
import {
  TrendingUp,
  Award,
  BookOpen,
  Clock,
  Target,
  Brain,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations";

export const AnalyticsProgress: React.FC = () => {
  const { user, subjects, language, quizHistory, pdfFiles, notes } = useApp();
  const t = getTranslation(language);

  // Subject completion dataset for chart
  const subjectProgressData = subjects.map((sub) => ({
    name: sub.code.split("-")[0],
    fullName: sub.name[language] || sub.name.en,
    progress: Math.round((sub.completedChapters / sub.totalChapters) * 100),
    color: sub.color,
  }));

  // Calculate overall syllabus percentage
  const totalChaptersCount = subjects.reduce((a, s) => a + s.totalChapters, 0) || 1;
  const completedChaptersCount = subjects.reduce((a, s) => a + s.completedChapters, 0);
  const overallSyllabusPercent = Math.round((completedChaptersCount / totalChaptersCount) * 100);

  // Quiz score trend dataset
  const quizTrendData = [
    { exam: "Week 1", score: 72 },
    { exam: "Week 2", score: 78 },
    { exam: "Week 3", score: 85 },
    { exam: "Week 4", score: 82 },
    { exam: "Week 5", score: 88 },
    { exam: "Recent", score: user.averageScore },
  ];

  // Strong vs Weak area identification
  const sortedSubjects = [...subjects].sort(
    (a, b) =>
      b.completedChapters / b.totalChapters - a.completedChapters / a.totalChapters
  );
  const strongestSubjects = sortedSubjects.slice(0, 3);
  const focusAreas = sortedSubjects.slice(-3).reverse();

  return (
    <div id="analytics-progress-page" className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          Progress & Diagnostic Performance
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed metrics on syllabus coverage, study stamina, exam accuracy, and personalized AI recommendations
        </p>
      </div>

      {/* Top 4 Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between text-indigo-600 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Syllabus Completion</span>
            <Target className="w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {overallSyllabusPercent}%
          </span>
          <span className="text-[11px] text-emerald-600 font-bold block mt-1">+4% this week</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Study Hours Logged</span>
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {(user.totalStudyMinutes / 60).toFixed(1)} hrs
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            {user.streakDays} consecutive day streak
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between text-emerald-500 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Quiz Accuracy</span>
            <Award className="w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {user.averageScore}%
          </span>
          <span className="text-[11px] text-emerald-600 font-bold block mt-1">Distinction Grade (A)</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between text-purple-500 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Study Assets</span>
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {pdfFiles.length + notes.length} Items
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            {pdfFiles.length} PDFs • {notes.length} Notes
          </span>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subject Mastery Bar Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Subject Mastery Breakdown (All 13 Subjects)
            </h2>
            <span className="text-xs text-slate-400">Percent Complete</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectProgressData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${val}% Complete`,
                    item.payload.fullName,
                  ]}
                />
                <Bar dataKey="progress" radius={[6, 6, 0, 0]}>
                  {subjectProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quiz Performance Trend Line Chart (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Exam Practice Score Trajectory
            </h2>
            <span className="text-xs text-emerald-600 font-bold">Trending Upward</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={quizTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="exam" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#4f46e5" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strong Areas vs Areas Needing Revision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Areas */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Highest Proficiency Subjects</span>
          </div>

          <div className="space-y-2">
            {strongestSubjects.map((sub) => (
              <div
                key={sub.id}
                className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {sub.name[language] || sub.name.en}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {sub.completedChapters} of {sub.totalChapters} chapters mastered
                  </span>
                </div>
                <span className="text-xs font-extrabold text-emerald-600">
                  {Math.round((sub.completedChapters / sub.totalChapters) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Areas Needing Attention */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>Recommended Focus for This Week</span>
          </div>

          <div className="space-y-2">
            {focusAreas.map((sub) => (
              <div
                key={sub.id}
                className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {sub.name[language] || sub.name.en}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {sub.totalChapters - sub.completedChapters} chapters remaining
                  </span>
                </div>
                <span className="text-xs font-extrabold text-amber-600">
                  {Math.round((sub.completedChapters / sub.totalChapters) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
