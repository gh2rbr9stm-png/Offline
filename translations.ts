import { Language } from "./types";

// Safe deep-fallback proxy: any key that isn't defined below returns the
// dotted key path itself instead of crashing the UI (defensive against
// any translation key used in the app that wasn't anticipated here).
function deepProxy(obj: any, path: string[] = []): any {
  return new Proxy(obj || {}, {
    get(target, prop: string) {
      if (typeof prop !== "string") return undefined;
      if (prop in target) {
        const val = target[prop];
        if (val && typeof val === "object") return deepProxy(val, [...path, prop]);
        return val;
      }
      return [...path, prop].join(".");
    },
  });
}

const en = {
  common: {
    welcome: "Welcome back",
    search: "Search subjects, PDFs, notes...",
    streak: "day streak",
    cloudSync: "Cloud Sync",
    upload: "Upload",
    create: "Create",
    cancel: "Cancel",
    next: "Next",
    prev: "Previous",
    viewAll: "View all",
  },
  nav: {
    dashboard: "Dashboard",
    subjects: "Subjects",
    pdfLibrary: "PDF Library",
    notes: "Notes",
    quizzes: "Quizzes",
    flashcards: "Flashcards",
    favourites: "Favourites",
    aiTeacher: "AI Teacher",
    timetable: "Timetable",
    timer: "Study Timer",
    homework: "Homework",
    scienceLab: "Science Lab",
    tools: "Tools",
    community: "Community",
    settings: "Settings",
  },
  dashboard: {
    askAI: "Ask the AI Teacher",
    dailyGoals: "Daily Goals",
    overallProgress: "Overall Progress",
    quickQuiz: "Quick Quiz",
    recentNotes: "Recent Notes",
    recentPdfs: "Recent PDFs",
    startPomodoro: "Start Pomodoro",
    studyStreak: "Study Streak",
    studyTime: "Study Time",
    todaySchedule: "Today's Schedule",
    upcomingExams: "Upcoming Exams",
  },
  flashcards: {
    title: "Flashcards",
    flipPrompt: "Tap the card to flip",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    mastered: "Mastered",
  },
  notes: {
    title: "My Notes",
    shortNote: "Short Note",
    fullNote: "Full Note",
    autoSaved: "Auto-saved",
  },
  pdf: {
    myLibrary: "My Library",
    uploadPrompt: "Click or drag a PDF here to upload",
    dragDrop: "Drop your PDF here",
    newFolder: "New Folder",
    addNote: "Add Note",
    highlight: "Highlight",
    draw: "Draw",
    page: "Page",
    of: "of",
    privateNotice: "Your uploaded PDFs are private and stored only for you.",
  },
  quiz: {
    title: "Quiz Center",
  },
  ai: {
    title: "AI Teacher",
  },
};

const ta = {
  common: {
    welcome: "மீண்டும் வரவேற்கிறோம்",
    search: "பாடங்கள், PDF, குறிப்புகளைத் தேடுங்கள்...",
    streak: "நாள் தொடர்ச்சி",
    cloudSync: "Cloud ஒத்திசைவு",
    upload: "பதிவேற்று",
    create: "உருவாக்கு",
    cancel: "ரத்துசெய்",
    next: "அடுத்து",
    prev: "முந்தைய",
    viewAll: "அனைத்தையும் காண்க",
  },
  nav: {
    dashboard: "முகப்பு",
    subjects: "பாடங்கள்",
    pdfLibrary: "PDF நூலகம்",
    notes: "குறிப்புகள்",
    quizzes: "வினாடி வினா",
    flashcards: "ஃபிளாஷ்கார்டுகள்",
    favourites: "பிடித்தவை",
    aiTeacher: "AI ஆசிரியர்",
    timetable: "கால அட்டவணை",
    timer: "படிப்பு டைமர்",
    homework: "வீட்டுப்பாடம்",
    scienceLab: "அறிவியல் ஆய்வகம்",
    tools: "கருவிகள்",
    community: "சமூகம்",
    settings: "அமைப்புகள்",
  },
  dashboard: {
    askAI: "AI ஆசிரியரிடம் கேளுங்கள்",
    dailyGoals: "தினசரி இலக்குகள்",
    overallProgress: "மொத்த முன்னேற்றம்",
    quickQuiz: "விரைவு வினாடி வினா",
    recentNotes: "சமீபத்திய குறிப்புகள்",
    recentPdfs: "சமீபத்திய PDF கள்",
    startPomodoro: "Pomodoro ஐத் தொடங்கு",
    studyStreak: "படிப்பு தொடர்ச்சி",
    studyTime: "படிப்பு நேரம்",
    todaySchedule: "இன்றைய அட்டவணை",
    upcomingExams: "வரவிருக்கும் தேர்வுகள்",
  },
  flashcards: {
    title: "ஃபிளாஷ்கார்டுகள்",
    flipPrompt: "புரட்ட அட்டையைத் தட்டவும்",
    easy: "எளிது",
    medium: "நடுத்தரம்",
    hard: "கடினம்",
    mastered: "தேர்ச்சி பெற்றது",
  },
  notes: {
    title: "என் குறிப்புகள்",
    shortNote: "குறுங்குறிப்பு",
    fullNote: "முழு குறிப்பு",
    autoSaved: "தானாக சேமிக்கப்பட்டது",
  },
  pdf: {
    myLibrary: "என் நூலகம்",
    uploadPrompt: "PDF பதிவேற்ற இங்கே கிளிக் செய்யவும் அல்லது இழுக்கவும்",
    dragDrop: "உங்கள் PDF ஐ இங்கே விடவும்",
    newFolder: "புதிய கோப்புறை",
    addNote: "குறிப்பு சேர்",
    highlight: "தனிப்படுத்து",
    draw: "வரை",
    page: "பக்கம்",
    of: "இல்",
    privateNotice: "நீங்கள் பதிவேற்றும் PDF கள் தனிப்பட்டவை, உங்களுக்காக மட்டும் சேமிக்கப்படுகின்றன.",
  },
  quiz: {
    title: "வினாடி வினா மையம்",
  },
  ai: {
    title: "AI ஆசிரியர்",
  },
};

const si = {
  common: {
    welcome: "නැවත සාදරයෙන් පිළිගනිමු",
    search: "විෂයයන්, PDF, සටහන් සොයන්න...",
    streak: "දින අඛණ්ඩතාව",
    cloudSync: "Cloud සමමුහුර්තකරණය",
    upload: "උඩුගත කරන්න",
    create: "සාදන්න",
    cancel: "අවලංගු කරන්න",
    next: "ඊළඟ",
    prev: "පෙර",
    viewAll: "සියල්ල බලන්න",
  },
  nav: {
    dashboard: "මුල් පිටුව",
    subjects: "විෂයයන්",
    pdfLibrary: "PDF පුස්තකාලය",
    notes: "සටහන්",
    quizzes: "ප්‍රශ්නෝත්තර",
    flashcards: "ෆ්ලෑෂ්කාඩ්",
    favourites: "ප්‍රියතම",
    aiTeacher: "AI ගුරුවරයා",
    timetable: "කාල සටහන",
    timer: "අධ්‍යයන ටයිමරය",
    homework: "ගෙදර වැඩ",
    scienceLab: "විද්‍යා විද්‍යාගාරය",
    tools: "මෙවලම්",
    community: "ප්‍රජාව",
    settings: "සැකසුම්",
  },
  dashboard: {
    askAI: "AI ගුරුවරයාගෙන් අසන්න",
    dailyGoals: "දෛනික ඉලක්ක",
    overallProgress: "සමස්ත ප්‍රගතිය",
    quickQuiz: "ඉක්මන් ප්‍රශ්නෝත්තර",
    recentNotes: "මෑත සටහන්",
    recentPdfs: "මෑත PDF",
    startPomodoro: "Pomodoro ආරම්භ කරන්න",
    studyStreak: "අධ්‍යයන අඛණ්ඩතාව",
    studyTime: "අධ්‍යයන කාලය",
    todaySchedule: "අද කාලසටහන",
    upcomingExams: "ඉදිරි විභාග",
  },
  flashcards: {
    title: "ෆ්ලෑෂ්කාඩ්",
    flipPrompt: "පෙරළීමට කාඩ්පත ස්පර්ශ කරන්න",
    easy: "පහසු",
    medium: "මධ්‍යම",
    hard: "අමාරු",
    mastered: "ප්‍රගුණ කළා",
  },
  notes: {
    title: "මගේ සටහන්",
    shortNote: "කෙටි සටහන",
    fullNote: "සම්පූර්ණ සටහන",
    autoSaved: "ස්වයංක්‍රීයව සුරැකිණි",
  },
  pdf: {
    myLibrary: "මගේ පුස්තකාලය",
    uploadPrompt: "PDF එකක් උඩුගත කිරීමට මෙහි ක්ලික් කරන්න හෝ ඇද දමන්න",
    dragDrop: "ඔබේ PDF එක මෙහි දමන්න",
    newFolder: "නව ෆෝල්ඩරය",
    addNote: "සටහන එක් කරන්න",
    highlight: "උද්දීපනය",
    draw: "අඳින්න",
    page: "පිටුව",
    of: "න්",
    privateNotice: "ඔබ උඩුගත කරන PDF පුද්ගලිකයි, ඔබ වෙනුවෙන් පමණක් ගබඩා වේ.",
  },
  quiz: {
    title: "ප්‍රශ්නෝත්තර මධ්‍යස්ථානය",
  },
  ai: {
    title: "AI ගුරුවරයා",
  },
};

const dictionaries: Record<Language, any> = { en, ta, si };

export function getTranslation(language: Language) {
  const dict = dictionaries[language] || dictionaries.en;
  return deepProxy(dict) as typeof en;
}
