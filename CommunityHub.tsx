import React, { useState } from "react";
import {
  Users,
  MessageSquare,
  Trophy,
  Award,
  ThumbsUp,
  Send,
  Plus,
  Flame,
  CheckCircle,
  Share2,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations";

export const CommunityHub: React.FC = () => {
  const { user, achievements, language } = useApp();
  const t = getTranslation(language);

  // Tab: 'forum' | 'groups' | 'leaderboard' | 'achievements'
  const [activeTab, setActiveTab] = useState<"forum" | "groups" | "leaderboard" | "achievements">("forum");

  // Forum Q&A state
  const [forumPosts, setForumPosts] = useState([
    {
      id: "post-1",
      author: "Ananya Sivakumar",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      subject: "Science",
      question: "Can someone explain why sound waves cannot travel through a vacuum, but light waves can?",
      upvotes: 14,
      replies: 3,
      time: "2 hours ago",
    },
    {
      id: "post-2",
      author: "Kavindu Perera",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      subject: "Mathematics",
      question: "What is the fastest way to factorize quadratic expressions where a ≠ 1 like 2x² + 7x + 3?",
      upvotes: 21,
      replies: 5,
      time: "4 hours ago",
    },
    {
      id: "post-3",
      author: "Saravanan Murugan",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      subject: "History",
      question: "What are the main causes that led to the collapse of the Polonnaruwa Kingdom in Grade 09 history?",
      upvotes: 9,
      replies: 2,
      time: "1 day ago",
    },
  ]);

  const [newQuestion, setNewQuestion] = useState("");
  const [newSubject, setNewSubject] = useState("Science");

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setForumPosts([
      {
        id: `post-${Date.now()}`,
        author: user.name,
        avatar: user.avatar,
        subject: newSubject,
        question: newQuestion.trim(),
        upvotes: 1,
        replies: 0,
        time: "Just now",
      },
      ...forumPosts,
    ]);
    setNewQuestion("");
  };

  const handleUpvote = (id: string) => {
    setForumPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p))
    );
  };

  // Study Groups
  const studyGroups = [
    {
      name: "Grade 09 Science Distinction Club",
      members: 128,
      focus: "Term test past paper walkthroughs and Physics numericals",
      badge: "Active Daily",
    },
    {
      name: "Maths Olympiad & Algebra Masters",
      members: 94,
      focus: "Geometry proofs, Pythagoras and quadratic equation challenges",
      badge: "Weekly Quizzes",
    },
    {
      name: "Tamil Language & Sahitya Circle",
      members: 76,
      focus: "Grammar, literary poems recitation & essay marking",
      badge: "Bilingual",
    },
    {
      name: "English Spoken & Grammar Guild",
      members: 110,
      focus: "Reading comprehension, tenses & vocabulary building",
      badge: "Open to all",
    },
  ];

  // Leaderboard data
  const leaderboards = [
    { rank: 1, name: "Thilakshi De Silva", school: "Visakha Vidyalaya", streak: 21, score: 98, points: 2840 },
    { rank: 2, name: "Kavishan Thayalan (You)", school: "Jaffna Hindu College", streak: 7, score: 88, points: 2410 },
    { rank: 3, name: "Mohammed Farhan", school: "Zahira College", streak: 14, score: 91, points: 2280 },
    { rank: 4, name: "Dinithi Bandara", school: "Mahamaya College", streak: 12, score: 89, points: 2150 },
    { rank: 5, name: "Praveen Raj", school: "St. Patrick's College", streak: 9, score: 86, points: 1980 },
  ];

  return (
    <div id="community-hub-page" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-600" />
            Peer Learning Community & Growth
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Collaborate with Grade 09 classmates, ask study questions, and climb academic leaderboards
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold overflow-x-auto self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("forum")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === "forum"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Q&A Forum
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === "groups"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Study Groups
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === "leaderboard"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Leaderboard
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === "achievements"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            My Badges
          </button>
        </div>
      </div>

      {/* 1. FORUM TAB */}
      {activeTab === "forum" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Ask Question Box (4 cols) */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              Ask a Study Question
            </h2>
            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                >
                  <option value="Science">Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Tamil">Tamil Language</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="ICT">ICT</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Your Question</label>
                <textarea
                  rows={4}
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Describe your homework or exam question clearly..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
              >
                Post Question
              </button>
            </form>
          </div>

          {/* Forum Question Feed (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            {forumPosts.map((post) => (
              <div
                key={post.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={post.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {post.author}
                      </span>
                      <span className="text-[10px] text-slate-400">{post.time}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                    {post.subject}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                  {post.question}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/40 text-xs">
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{post.upvotes} Helpful</span>
                  </button>

                  <span className="text-slate-400 text-[11px]">{post.replies} Answers</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. STUDY GROUPS TAB */}
      {activeTab === "groups" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studyGroups.map((g, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                    {g.badge}
                  </span>
                  <span className="text-[11px] text-slate-400 font-bold">{g.members} Grade 9 Students</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{g.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{g.focus}</p>
              </div>

              <button className="mt-4 w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-750 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all cursor-pointer">
                Join Study Group
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 3. LEADERBOARD TAB */}
      {activeTab === "leaderboard" && (
        <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Sri Lanka Grade 09 Scholastic Champions
            </h2>
            <span className="text-xs text-slate-400 font-bold">Weekly Rank</span>
          </div>

          <div className="space-y-2.5">
            {leaderboards.map((lb) => (
              <div
                key={lb.rank}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                  lb.rank === 2
                    ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 font-bold"
                    : "bg-slate-50/50 dark:bg-slate-750 border-slate-200 dark:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      lb.rank === 1
                        ? "bg-amber-400 text-slate-900"
                        : lb.rank === 2
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    #{lb.rank}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{lb.name}</span>
                    <span className="text-[10px] text-slate-400">{lb.school}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400 block">
                      {lb.points} pts
                    </span>
                    <span className="text-[10px] text-slate-400">{lb.streak}d streak • {lb.score}% avg</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ACHIEVEMENTS BADGES TAB */}
      {activeTab === "achievements" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border transition-all text-center flex flex-col items-center justify-between ${
                ach.unlocked
                  ? "bg-white dark:bg-slate-800/90 border-indigo-200 dark:border-indigo-800/60 shadow-md"
                  : "bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-700/40 opacity-50 grayscale"
              }`}
            >
              <div className="text-4xl mb-2">{ach.icon}</div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1">{ach.title}</h3>
              <p className="text-[11px] text-slate-500 leading-snug">{ach.description}</p>
              <span className="mt-3 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                {ach.unlocked ? `Unlocked ${ach.unlockedAt?.split("T")[0]}` : "Locked"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
