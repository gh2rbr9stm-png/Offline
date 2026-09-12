import React, { useState } from "react";
import {
  GraduationCap,
  FileCheck,
  UserCheck,
  Printer,
  Download,
  Award,
  Clock,
  Calendar,
  Send,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations";

export const ParentTeacherPortal: React.FC = () => {
  const { user, subjects, language } = useApp();
  const t = getTranslation(language);

  // Portal view: 'parent' | 'teacher' | 'reportCard'
  const [activePortal, setActivePortal] = useState<"parent" | "teacher" | "reportCard">("parent");

  // Teacher feedback notes state
  const [teacherFeedbackList, setTeacherFeedbackList] = useState([
    {
      id: "f-1",
      teacher: "Mr. K. Ratnam",
      subject: "Science",
      comment: "Excellent conceptual understanding of Density and Ohm's Law. Needs slightly more practice writing full explanations for biological terms in Sinhala and English.",
      date: "Yesterday",
      status: "Verified",
    },
    {
      id: "f-2",
      teacher: "Mrs. N. Wickramasinghe",
      subject: "Mathematics",
      comment: "Showed tremendous improvement in Pythagoras theorem and algebraic expansions. Scored 94% on the last mock paper.",
      date: "3 days ago",
      status: "Commended",
    },
  ]);

  const [newFeedbackComment, setNewFeedbackComment] = useState("");
  const [feedbackSubject, setFeedbackSubject] = useState("Science");

  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedbackComment.trim()) return;
    setTeacherFeedbackList([
      {
        id: `f-${Date.now()}`,
        teacher: "Teacher Reviewer",
        subject: feedbackSubject,
        comment: newFeedbackComment.trim(),
        date: "Just now",
        status: "New Feedback",
      },
      ...teacherFeedbackList,
    ]);
    setNewFeedbackComment("");
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div id="parent-teacher-portal-page" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            Parent & Teacher Supervision Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Guardian progress oversight, teacher appraisal feedback & official Grade 09 term report card
          </p>
        </div>

        {/* Portal Switcher */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold overflow-x-auto self-start sm:self-auto">
          <button
            onClick={() => setActivePortal("parent")}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activePortal === "parent"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Parent Oversight
          </button>
          <button
            onClick={() => setActivePortal("teacher")}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activePortal === "teacher"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Teacher Remarks & Grading
          </button>
          <button
            onClick={() => setActivePortal("reportCard")}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activePortal === "reportCard"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Official Report Card
          </button>
        </div>
      </div>

      {/* 1. PARENT OVERSIGHT VIEW */}
      {activePortal === "parent" && (
        <div className="space-y-6">
          {/* Summary Overview */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Student Profile</span>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{user.name}</h2>
                <span className="text-xs text-slate-500">
                  {user.grade} • {user.school}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Streak</span>
                <span className="text-sm font-extrabold text-amber-600">{user.streakDays} Days</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Study Time</span>
                <span className="text-sm font-extrabold text-indigo-600">
                  {(user.totalStudyMinutes / 60).toFixed(1)} hrs
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Avg Score</span>
                <span className="text-sm font-extrabold text-emerald-600">{user.averageScore}%</span>
              </div>
            </div>
          </div>

          {/* Parental Insight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-2">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Consistent Attendance
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Student logged in on 7 consecutive days and completed scheduled Math and Science revision tasks on time.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-2">
              <span className="text-xs font-bold text-indigo-600 flex items-center gap-1.5">
                <Award className="w-4 h-4" /> High Quiz Performance
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Maintained an average of 88% across Science and Mathematics mock exams this month.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-2">
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Recommendation
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Encourage student to complete 2 more units in History and Sinhala Second Language before the upcoming term evaluation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. TEACHER FEEDBACK & REMARKS VIEW */}
      {activePortal === "teacher" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Add Teacher Comment (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              Submit Teacher Evaluation
            </h2>
            <p className="text-xs text-slate-400">
              Teachers can leave constructive appraisals and academic directions visible to the student and parents.
            </p>

            <form onSubmit={handleAddFeedback} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Subject</label>
                <select
                  value={feedbackSubject}
                  onChange={(e) => setFeedbackSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name.en}>
                      {s.name[language] || s.name.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                  Teacher's Notes & Advice
                </label>
                <textarea
                  rows={5}
                  required
                  value={newFeedbackComment}
                  onChange={(e) => setNewFeedbackComment(e.target.value)}
                  placeholder="Enter remarks on student's homework, homework completion, or exam preparation..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
              >
                Publish Feedback
              </button>
            </form>
          </div>

          {/* Feedback Timeline (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            {teacherFeedbackList.map((fb) => (
              <div
                key={fb.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {fb.teacher}
                    </span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                      {fb.subject} Faculty
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold">
                    {fb.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-750 p-3 rounded-xl">
                  {fb.comment}
                </p>

                <span className="text-[10px] text-slate-400 block text-right">{fb.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. OFFICIAL PRINTABLE REPORT CARD */}
      {activePortal === "reportCard" && (
        <div className="space-y-4">
          <div className="flex justify-end gap-2">
            <button
              onClick={handlePrintReport}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Report Card</span>
            </button>
          </div>

          <div
            id="official-report-card"
            className="p-8 rounded-3xl bg-white text-slate-900 border-2 border-slate-200 shadow-xl space-y-6 max-w-3xl mx-auto print:border-none print:shadow-none"
          >
            {/* Report Header */}
            <div className="text-center border-b pb-4 space-y-1">
              <h2 className="text-lg font-extrabold uppercase tracking-wide">
                Sri Lanka Ministry of Education
              </h2>
              <h3 className="text-base font-bold text-indigo-900">
                Grade 09 National Curriculum — Academic Evaluation & Progress Report
              </h3>
              <p className="text-xs text-slate-500">Academic Year 2025/2026 • Term Assessment</p>
            </div>

            {/* Student Info Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Name</span>
                <span className="font-extrabold">{user.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">School</span>
                <span className="font-extrabold">{user.school}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Grade</span>
                <span className="font-extrabold">{user.grade}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Medium</span>
                <span className="font-extrabold">Trilingual (Tamil / Sinhala / Eng)</span>
              </div>
            </div>

            {/* Grades Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-500 uppercase text-[10px]">
                    <th className="py-2">Subject</th>
                    <th className="py-2">Syllabus Covered</th>
                    <th className="py-2">Mock Exam Score</th>
                    <th className="py-2">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjects.slice(0, 8).map((s) => {
                    const pct = Math.round((s.completedChapters / s.totalChapters) * 100);
                    const mockMark = Math.min(100, Math.max(65, pct + 20));
                    const letterGrade = mockMark >= 75 ? "A (Distinction)" : mockMark >= 65 ? "B (Very Good)" : "C (Credit)";

                    return (
                      <tr key={s.id}>
                        <td className="py-2.5 font-bold">{s.name.en} ({s.name[language] || ""})</td>
                        <td className="py-2.5">{pct}%</td>
                        <td className="py-2.5 font-bold text-indigo-700">{mockMark}/100</td>
                        <td className="py-2.5 font-bold">{letterGrade}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary & Signatures */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs text-slate-500">
              <div className="border-t border-dashed border-slate-400 pt-2">
                Class Teacher Signature
              </div>
              <div className="border-t border-dashed border-slate-400 pt-2">
                Principal / Sectional Head
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
