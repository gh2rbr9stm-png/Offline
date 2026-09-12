import { Subject, PDFFile, Note, QuizQuestion, Flashcard, TimetableEntry, DailyGoal, ExamEntry, HomeworkItem, EducationalVideo, ImportantQuestion, AchievementBadge } from "../types";

export const grade9Subjects: Subject[] = [
  {
    id: "math",
    code: "MATH-09",
    name: {
      en: "Mathematics",
      ta: "கணிதம்",
      si: "ගණිතය",
    },
    icon: "Calculator",
    color: "#3B82F6",
    totalChapters: 24,
    completedChapters: 16,
    description: "Numbers, Algebra, Geometry, Statistics, and Sets for Grade 09.",
    chapters: [
      { id: "math-c1", number: 1, title: { en: "Square Roots", ta: "வர்க்கமூலம்", si: "වර්ගමූලය" }, description: "Estimation and division method for finding square roots.", completed: true, topics: ["Estimation of square roots", "Division method", "Real number relations"] },
      { id: "math-c2", number: 2, title: { en: "Indices", ta: "சுட்டிகள்", si: "දර්ශක" }, description: "Laws of indices with positive and fractional powers.", completed: true, topics: ["Product rule", "Quotient rule", "Power of a power"] },
      { id: "math-c3", number: 3, title: { en: "Algebraic Expressions", ta: "அட்சரகணிதக் கோவைகள்", si: "වීජීය ප්‍රකාශන" }, description: "Expansion, factorisation and simplifying quadratic expressions.", completed: true, topics: ["Difference of two squares", "Quadratic factors", "Algebraic fractions"] },
      { id: "math-c4", number: 4, title: { en: "Linear Equations", ta: "ஒருங்கமை சமன்பாடுகள்", si: "සරල සමීකරණ" }, description: "Solving simultaneous linear equations in two unknowns.", completed: true, topics: ["Elimination method", "Substitution method", "Word problems"] },
      { id: "math-c5", number: 5, title: { en: "Triangles & Congruence", ta: "முக்கோணங்களும் ஒருங்கிசைவும்", si: "ත්‍රිකෝණ හා අංගසාම්‍යය" }, description: "Conditions of congruence: SAS, ASA, SSS, RHS.", completed: false, topics: ["SAS theorem", "ASA theorem", "Geometric proofs"] },
      { id: "math-c6", number: 6, title: { en: "Circles & Chords", ta: "வட்டமும் நாண்களும்", si: "වෘත්තය හා ජ්‍යාය" }, description: "Theorems regarding perpendicular from centre to chord.", completed: false, topics: ["Perpendicular bisector theorem", "Equidistant chords"] },
      { id: "math-c7", number: 7, title: { en: "Perimeter and Area", ta: "சுற்றளவும் பரப்பளவும்", si: "පරිමිතිය හා වර්ගඵලය" }, description: "Area of trapeziums, parallelograms, and sectors.", completed: true, topics: ["Trapezium formula", "Sector area", "Composite shapes"] },
      { id: "math-c8", number: 8, title: { en: "Statistics & Data", ta: "புள்ளியியலும் தரவுகளும்", si: "සංඛ්‍යානය හා දත්ත" }, description: "Mean, median, mode of grouped frequency tables.", completed: false, topics: ["Grouped frequency", "Histograms", "Cumulative frequency"] },
    ],
  },
  {
    id: "science",
    code: "SCI-09",
    name: {
      en: "Science",
      ta: "விஞ்ஞானம்",
      si: "විද්‍යාව",
    },
    icon: "Atom",
    color: "#10B981",
    totalChapters: 20,
    completedChapters: 14,
    description: "Biology, Chemistry, and Physics integrated Grade 09 concepts.",
    chapters: [
      { id: "sci-c1", number: 1, title: { en: "Structure of Matter", ta: "சடப்பொருளின் கட்டமைப்பு", si: "ද්‍රව්‍යයේ ව්‍යුහය" }, description: "Atoms, atomic number, mass number, and electronic configuration.", completed: true, topics: ["Protons, neutrons, electrons", "Bohr models", "Periodic table groups"] },
      { id: "sci-c2", number: 2, title: { en: "Acids, Bases and Salts", ta: "அமிலங்கள், காரங்கள், உப்புக்கள்", si: "අම්ල, භෂ්ම හා ලවණ" }, description: "Properties, litmus and universal indicators, neutralization reactions.", completed: true, topics: ["pH scale", "Universal indicator", "Neutralization equations"] },
      { id: "sci-c3", number: 3, title: { en: "Motion & Newton's Laws", ta: "இயக்கமும் நியூட்டனின் விதிகளும்", si: "චලිතය හා නිව්ටන් නියම" }, description: "Displacement, velocity, acceleration, and inertia.", completed: true, topics: ["Velocity-time graphs", "Newton's first law", "Newton's second law"] },
      { id: "sci-c4", number: 4, title: { en: "Work, Energy & Power", ta: "வேலை, சக்தி, வலு", si: "කාර්යය, ශක්තිය හා ක්ෂමතාව" }, description: "Kinetic energy, gravitational potential energy, conservation of energy.", completed: true, topics: ["Work = Force x Distance", "Kinetic vs Potential", "Power in Watts"] },
      { id: "sci-c5", number: 5, title: { en: "Electricity & Circuits", ta: "மின்னோட்டமும் மின்சுற்றுக்களும்", si: "ධාරා විද්‍යුතය හා පරිපථ" }, description: "Current, potential difference, Ohm's law, series and parallel circuits.", completed: false, topics: ["V = IR", "Resistors in series", "Circuit safety"] },
      { id: "sci-c6", number: 6, title: { en: "Plant & Animal Tissues", ta: "தாவர மற்றும் விலங்கு இழையங்கள்", si: "ශාක හා සත්ව පටක" }, description: "Meristematic, permanent, epithelial, and connective tissues.", completed: true, topics: ["Xylem and phloem", "Muscular tissue", "Nervous tissue"] },
      { id: "sci-c7", number: 7, title: { en: "Photosynthesis & Respiration", ta: "ஒளித்தொகுப்பும் சுவாசமும்", si: "ප්‍රභාසංස්ලේෂණය හා ශ්වසනය" }, description: "Light dependent reaction, cellular respiration, gas exchange.", completed: false, topics: ["Chloroplast structure", "Aerobic vs Anaerobic", "Stomata mechanism"] },
    ],
  },
  {
    id: "tamil",
    code: "TAM-09",
    name: {
      en: "Tamil Language",
      ta: "தமிழ் மொழி",
      si: "දෙමළ භාෂාව",
    },
    icon: "BookOpen",
    color: "#EC4899",
    totalChapters: 18,
    completedChapters: 12,
    description: "Grammar, classical literature, modern poetry, and comprehension.",
    chapters: [
      { id: "tam-c1", number: 1, title: { en: "Punarcci Rules (புணர்ச்சி)", ta: "சொற்புணர்ச்சி விதிகள்", si: "සන්ධි නීති" }, description: "Thonri, Thirinthal, and Keduthal rules in Tamil sandhi.", completed: true, topics: ["உயிர்முன் உயிர்", "மெய்முன் உயிர்", "தோன்றல் புணர்ச்சி"] },
      { id: "tam-c2", number: 2, title: { en: "Thirukkural Selections", ta: "திருக்குறள் அதிகாரங்கள்", si: "තිරුක්කුරල්" }, description: "Kural couplets on friendship, education, and moral duty.", completed: true, topics: ["கல்வி அதிகாரம்", "நட்பு அதிகாரம்", "பொருளுரை"] },
      { id: "tam-c3", number: 3, title: { en: "Short Stories & Essay Writing", ta: "சிறுகதையும் கட்டுரை வரைதலும்", si: "කෙටිකතා සහ රචනා" }, description: "Character analysis, theme extraction, and creative essays.", completed: false, topics: ["கட்டுரை அமைக்கும் முறை", "சுருக்கம் வரைதல்", "பந்திப் பிரிப்பு"] },
    ],
  },
  {
    id: "english",
    code: "ENG-09",
    name: {
      en: "English Language",
      ta: "ஆங்கில மொழி",
      si: "ඉංග්‍රීසි භාෂාව",
    },
    icon: "Languages",
    color: "#6366F1",
    totalChapters: 16,
    completedChapters: 11,
    description: "Grammar tenses, active/passive voice, formal letter writing, reading skills.",
    chapters: [
      { id: "eng-c1", number: 1, title: { en: "Tenses & Conditionals", ta: "காலங்களும் நிபந்தனை வாக்கியங்களும்", si: "කාල හා කොන්දේසි වාක්‍ය" }, description: "Past continuous, future perfect, and type 1, 2, 3 conditionals.", completed: true, topics: ["Present perfect continuous", "If-clauses", "Modal verbs"] },
      { id: "eng-c2", number: 2, title: { en: "Active and Passive Voice", ta: "செய்வினை செயப்பாட்டுவினை", si: "කර්ම කාරක වාක්‍ය" }, description: "Transforming sentences across all 12 tenses with standard rules.", completed: true, topics: ["Object transformation", "Past participle rules", "Agent by-phrase"] },
      { id: "eng-c3", number: 3, title: { en: "Formal Letters & Reports", ta: "அலுவலகக் கடிதங்களும் அறிக்கைகளும்", si: "ලිපි ලේඛන හා වාර්තා" }, description: "Structure, salutation, tone, body paragraphs, and conclusion.", completed: false, topics: ["Letter to Principal/Editor", "Factual report writing", "Notice writing"] },
    ],
  },
  {
    id: "history",
    code: "HIS-09",
    name: {
      en: "History",
      ta: "வரலாறு",
      si: "ඉතිහාසය",
    },
    icon: "Landmark",
    color: "#F59E0B",
    totalChapters: 12,
    completedChapters: 8,
    description: "Medieval Sri Lankan history, Polonnaruwa, Dambadeniya, and Yapahuwa kingdoms.",
    chapters: [
      { id: "his-c1", number: 1, title: { en: "Polonnaruwa Kingdom", ta: "பொலன்னறுவை இராச்சியம்", si: "පොළොන්නරු යුගය" }, description: "Vijayabahu I, Parakramabahu the Great, irrigation wonders and culture.", completed: true, topics: ["Sea of Parakrama", "Gal Vihara sculptures", "Chola invasions"] },
      { id: "his-c2", number: 2, title: { en: "Southwest Shift of Kingdoms", ta: "தென்மேற்கு நோக்கிய இராச்சிய நகர்வு", si: "නිරිතදිග රාජධානි" }, description: "Dambadeniya, Yapahuwa, Kurunegala, and Gampola eras.", completed: true, topics: ["Yapahuwa rock fortress", "Tooth Relic custodianship", "Economic challenges"] },
      { id: "his-c3", number: 3, title: { en: "Kotte Kingdom & European Arrival", ta: "கோட்டே இராச்சியமும் ஐரோப்பியர் வருகையும்", si: "කෝට්ටේ යුගය" }, description: "Parakramabahu VI, Portuguese arrival in 1505, trade treaties.", completed: false, topics: ["Spices trade", "Fort of Colombo", "Resistance battles"] },
    ],
  },
  {
    id: "geography",
    code: "GEO-09",
    name: {
      en: "Geography",
      ta: "புவியியல்",
      si: "භූගෝල විද්‍යාව",
    },
    icon: "Globe",
    color: "#06B6D4",
    totalChapters: 10,
    completedChapters: 7,
    description: "Map reading, topography of Sri Lanka, weather, climate, and agriculture.",
    chapters: [
      { id: "geo-c1", number: 1, title: { en: "Topographic Maps & Contours", ta: "நிலத்தோற்றப் படங்களும் சமவுயரக் கோடுகளும்", si: "භූවිෂමතා සිතියම්" }, description: "Reading 1:50,000 maps, relief, drainage patterns, and cultural features.", completed: true, topics: ["Contour intervals", "Spurs and valleys", "Grid coordinates"] },
      { id: "geo-c2", number: 2, title: { en: "Climate Zones of Sri Lanka", ta: "இலங்கையின் காலநிலை வலயங்கள்", si: "දේශගුණික කලාප" }, description: "Wet zone, dry zone, intermediate zone, rainfall patterns, monsoons.", completed: true, topics: ["SW and NE Monsoons", "Inter-monsoonal showers", "Temperature distribution"] },
    ],
  },
  {
    id: "ict",
    code: "ICT-09",
    name: {
      en: "Information & Communication Tech",
      ta: "தகவல் தொடர்பாடல் தொழிநுட்பம்",
      si: "තොරතුරු හා සන්නිවේදන තාක්ෂණය",
    },
    icon: "MonitorSmartphone",
    color: "#8B5CF6",
    totalChapters: 10,
    completedChapters: 8,
    description: "Computer hardware, operating systems, spreadsheets, flowcharts, and Scratch/Python logic.",
    chapters: [
      { id: "ict-c1", number: 1, title: { en: "Computer Architecture & OS", ta: "கணினி கட்டமைப்பு & தொழிற்பாட்டு முறைமை", si: "පරිගණක නිර්මාණ ශිල්පය" }, description: "CPU, ALU, registers, RAM vs ROM, system and application software.", completed: true, topics: ["Motherboard components", "Volatile vs Non-volatile", "File management"] },
      { id: "ict-c2", number: 2, title: { en: "Spreadsheet Formulas & Charts", ta: "விரிதாள் சூத்திரங்களும் வரைபுகளும்", si: "පැතුරුම්පත්" }, description: "SUM, AVERAGE, IF formulas, cell referencing, and bar/pie charts.", completed: true, topics: ["Relative vs Absolute referencing", "Conditional logic", "Chart formatting"] },
      { id: "ict-c3", number: 3, title: { en: "Algorithms & Flowcharts", ta: "படிமுறைத்தீர்வுகளும் பாய்ச்சற்போக்குப்படங்களும்", si: "ගැලීම් සටහන්" }, description: "Symbols, sequential, selection, and looping structures.", completed: false, topics: ["Decision diamond", "Looping iteration", "Pseudocode writing"] },
    ],
  },
  {
    id: "health",
    code: "HLT-09",
    name: {
      en: "Health & Physical Education",
      ta: "சுகாதாரமும் உடற்கல்வியும்",
      si: "සෞඛ්‍යය හා ශාරීරික අධ්‍යාපනය",
    },
    icon: "HeartPulse",
    color: "#EF4444",
    totalChapters: 8,
    completedChapters: 6,
    description: "Nutrition, human body systems, sports safety, mental health, and physical fitness.",
    chapters: [
      { id: "hlt-c1", number: 1, title: { en: "Cardiorespiratory Endurance", ta: "இதயசுவாசத் தாங்குதிறன்", si: "හෘද ශ්වසන යෝග්‍යතාව" }, description: "Aerobic fitness, pulse rate measurement, target heart rate zones.", completed: true, topics: ["Resting pulse rate", "Aerobic vs Anaerobic", "Cool-down techniques"] },
      { id: "hlt-c2", number: 2, title: { en: "Nutritional Balance & Disorders", ta: "போசாக்குச் சமநிலையும் குறைபாடுகளும்", si: "පෝෂණ ඌනතා" }, description: "Macronutrients, micronutrients, malnutrition, and lifestyle diseases.", completed: true, topics: ["Food pyramid", "BMI calculation", "Vitamins and minerals"] },
    ],
  },
  {
    id: "civics",
    code: "CIV-09",
    name: {
      en: "Civic Education",
      ta: "குடிமையியல் கல்வி",
      si: "පුරවැසි අධ්‍යාපනය",
    },
    icon: "Scale",
    color: "#14B8A6",
    totalChapters: 8,
    completedChapters: 5,
    description: "Democracy, constitution, human rights, local government, and active citizenship.",
    chapters: [
      { id: "civ-c1", number: 1, title: { en: "Democratic Governance", ta: "சனநாயக ஆட்சிமுறை", si: "ප්‍රජාතන්ත්‍රවාදී පාලනය" }, description: "Separation of powers: Legislature, Executive, and Judiciary.", completed: true, topics: ["Parliament role", "Cabinet of ministers", "Independent courts"] },
      { id: "civ-c2", number: 2, title: { en: "Fundamental Rights & Duties", ta: "அடிப்படை உரிமைகளும் கடமைகளும்", si: "මූලික අයිතිවාසිකම්" }, description: "Universal declaration of human rights, civic responsibilities.", completed: true, topics: ["Freedom of expression", "Equality under law", "Civic duties"] },
    ],
  },
  {
    id: "sinhala",
    code: "SIN-09",
    name: {
      en: "Sinhala Language",
      ta: "சிங்கள மொழி",
      si: "සිංහල භාෂාව හා සාහිත්‍යය",
    },
    icon: "PenTool",
    color: "#E11D48",
    totalChapters: 12,
    completedChapters: 7,
    description: "Sinhala grammar, second national language basics, poetry, and essay skills.",
    chapters: [
      { id: "sin-c1", number: 1, title: { en: "Sinhala Nouns & Verbs", ta: "நாமச்சொற்களும் வினைச்சொற்களும்", si: "නාම පද හා ක්‍රියා පද" }, description: "Classification of nouns, genders, and verb agreements in Sinhala.", completed: true, topics: ["විභක්ති", "ක්‍රියා පද කාල", "වචන ප්‍රභේද"] },
    ],
  },
  {
    id: "music",
    code: "MUS-09",
    name: {
      en: "Music",
      ta: "இசை",
      si: "සංගීතය",
    },
    icon: "Music",
    color: "#D946EF",
    totalChapters: 8,
    completedChapters: 5,
    description: "Ragas, Talas, musical notations, instruments, and classical compositions.",
    chapters: [
      { id: "mus-c1", number: 1, title: { en: "Ragas & Talas", ta: "இராகங்களும் தாளங்களும்", si: "රාග හා තාල" }, description: "Yaman / Bilawal / Mayamalavagowla ragas, Rupak and Teen Tala.", completed: true, topics: ["Arohana & Avarohana", "Vadi & Samvadi", "Tala matras"] },
    ],
  },
  {
    id: "saivanery",
    code: "SAI-09",
    name: {
      en: "Saivanery / Religion",
      ta: "சைவநெறி / சமயம்",
      si: "ආගමික අධ්‍යාපනය",
    },
    icon: "Sparkles",
    color: "#F97316",
    totalChapters: 8,
    completedChapters: 6,
    description: "Saiva Siddhantham, Thirumurai, temple architecture, and moral principles.",
    chapters: [
      { id: "sai-c1", number: 1, title: { en: "Pati, Pasu, Pasam", ta: "பதி, பசு, பாசம்", si: "දර්ශනය හා සදාචාරය" }, description: "Three fundamental entities in Saiva Siddhanta philosophy.", completed: true, topics: ["இறைவனின் இலக்கணம்", "ஆன்மாவின் இயல்பு", "மும்மலம்"] },
    ],
  },
  {
    id: "pts",
    code: "PTS-09",
    name: {
      en: "Practical & Technical Skills (PTS)",
      ta: "நடைமுறை மற்றும் தொழிநுட்பத் திறன்கள்",
      si: "ප්‍රායෝගික හා තාක්ෂණික කුසලතා",
    },
    icon: "Wrench",
    color: "#64748B",
    totalChapters: 8,
    completedChapters: 5,
    description: "Woodworking, technical drawing, electronics, domestic wiring, and metal craft.",
    chapters: [
      { id: "pts-c1", number: 1, title: { en: "Technical Drawing & Projections", ta: "தொழிநுட்ப வரைதலும் எறிவுகளும்", si: "තාක්ෂණික ඇඳීම" }, description: "Orthographic projection, first angle, isometric drawings.", completed: true, topics: ["Plan, front, side views", "Dimensioning rules", "Isometric axis"] },
    ],
  },
];

// Sample pre-populated personal cloud PDFs with Grade 09 syllabus content
export const initialPdfFiles: PDFFile[] = [
  {
    id: "pdf-sci-01",
    title: "Grade 09 Science - Unit 02 Acids Bases and Salts Official Study Guide.pdf",
    subjectId: "science",
    chapterId: "sci-c2",
    folder: "Textbooks & Guides",
    size: 2450000,
    pageCount: 18,
    lastReadPage: 4,
    isFavourite: true,
    isBookmarked: true,
    isPersonalUpload: false,
    uploadedAt: "2026-03-01",
    tags: ["Acids & Bases", "Chemistry", "Curriculum"],
    bookmarks: [1, 4, 12],
    annotations: [
      {
        id: "anno-1",
        page: 4,
        type: "highlight",
        color: "#fde047",
        text: "Acids turn blue litmus red; Bases turn red litmus blue. Universal indicator turns red at pH 1 and purple at pH 14.",
        createdAt: "2026-03-05",
      },
    ],
  },
  {
    id: "pdf-math-01",
    title: "Grade 09 Mathematics - Simultaneous Linear Equations Worked Examples.pdf",
    subjectId: "math",
    chapterId: "math-c4",
    folder: "Worksheets & Practice",
    size: 1820000,
    pageCount: 14,
    lastReadPage: 2,
    isFavourite: true,
    isBookmarked: false,
    isPersonalUpload: false,
    uploadedAt: "2026-03-03",
    tags: ["Algebra", "Equations", "Past Paper Questions"],
    bookmarks: [2, 7],
    annotations: [],
  },
  {
    id: "pdf-his-01",
    title: "Grade 09 History - Polonnaruwa Era & Parakramabahu Water Heritage.pdf",
    subjectId: "history",
    chapterId: "his-c1",
    folder: "Past Papers & History",
    size: 3100000,
    pageCount: 22,
    lastReadPage: 6,
    isFavourite: false,
    isBookmarked: true,
    isPersonalUpload: false,
    uploadedAt: "2026-03-04",
    tags: ["History", "Polonnaruwa", "Sri Lanka"],
    bookmarks: [1, 6],
    annotations: [],
  },
  {
    id: "pdf-tam-01",
    title: "தரம் 09 தமிழ் மொழி - இலக்கண சுருக்கக் கையேடு (புணர்ச்சி விதிகள்).pdf",
    subjectId: "tamil",
    chapterId: "tam-c1",
    folder: "Tamil Grammar Handouts",
    size: 1420000,
    pageCount: 10,
    lastReadPage: 1,
    isFavourite: true,
    isBookmarked: false,
    isPersonalUpload: false,
    uploadedAt: "2026-03-06",
    tags: ["Tamil", "Grammar", "Punarcci"],
    bookmarks: [1],
    annotations: [],
  },
  {
    id: "pdf-ict-01",
    title: "Grade 09 ICT - Algorithms, Flowcharts and Spreadsheet Formulas.pdf",
    subjectId: "ict",
    chapterId: "ict-c2",
    folder: "Worksheets & Practice",
    size: 2150000,
    pageCount: 16,
    lastReadPage: 3,
    isFavourite: false,
    isBookmarked: false,
    isPersonalUpload: false,
    uploadedAt: "2026-03-07",
    tags: ["ICT", "Excel", "Flowcharts"],
    bookmarks: [3],
    annotations: [],
  },
];

// Sample Pre-populated Notes
export const initialNotes: Note[] = [
  {
    id: "note-sci-1",
    title: "Acids, Bases, and Neutralization Reactions",
    subjectId: "science",
    chapterId: "sci-c2",
    topic: "Neutralization",
    type: "short",
    isFavourite: true,
    isBookmarked: true,
    createdAt: "2026-03-08T10:00:00.000Z",
    updatedAt: "2026-03-10T14:30:00.000Z",
    tags: ["Acids", "pH Scale", "Exam Favorite"],
    content: `<h2>Acids and Bases Key Formulae</h2>
<p><strong>1. Litmus Behavior:</strong></p>
<ul>
<li><strong>Acid:</strong> Turns blue litmus into red. pH &lt; 7</li>
<li><strong>Base:</strong> Turns red litmus into blue. pH &gt; 7</li>
<li><strong>Neutral Water:</strong> pH = 7. Litmus remains unchanged.</li>
</ul>
<p><strong>2. Core Reaction:</strong></p>
<pre><code>Acid + Base → Salt + Water (Neutralization)
HCl(aq) + NaOH(aq) → NaCl(aq) + H2O(l)</code></pre>
<p><em>Exam Tip:</em> Phenolphthalein is colourless in acid and turns bright pink in base.</p>`,
  },
  {
    id: "note-math-1",
    title: "Elimination Method for Simultaneous Equations",
    subjectId: "math",
    chapterId: "math-c4",
    topic: "Linear Equations",
    type: "full",
    isFavourite: true,
    isBookmarked: false,
    createdAt: "2026-03-09T08:30:00.000Z",
    updatedAt: "2026-03-10T11:15:00.000Z",
    tags: ["Algebra", "Methods", "Step-by-Step"],
    content: `<h2>Step-by-Step Elimination Protocol</h2>
<p><strong>Problem:</strong> Solve <code>2x + y = 7</code> and <code>3x - y = 8</code></p>
<ol>
<li>Observe the coefficients of <code>y</code> (+1 and -1). Since signs are opposite, <strong>ADD</strong> equations:
<br/><code>(2x + y) + (3x - y) = 7 + 8</code>
<br/><code>5x = 15 ⇒ x = 3</code></li>
<li>Substitute <code>x = 3</code> into Equation 1:
<br/><code>2(3) + y = 7 ⇒ 6 + y = 7 ⇒ y = 1</code></li>
<li><strong>Final Check:</strong> 3(3) - 1 = 9 - 1 = 8. Verified!</li>
</ol>`,
  },
  {
    id: "note-tam-1",
    title: "புணர்ச்சி விதிகள் - தோன்றல், திரிதல், கெடுதல் சுருக்கம்",
    subjectId: "tamil",
    chapterId: "tam-c1",
    topic: "இலக்கணம்",
    type: "short",
    isFavourite: false,
    isBookmarked: true,
    createdAt: "2026-03-07T16:00:00.000Z",
    updatedAt: "2026-03-09T18:00:00.000Z",
    tags: ["தமிழ்", "புணர்ச்சி", "இலக்கணம்"],
    content: `<h2>விகாரப் புணர்ச்சியின் மூன்று வகைகள்</h2>
<ol>
<li><strong>தோன்றல்:</strong> நிலைமொழியும் வருமொழியும் இணையும் போது புதிய எழுத்து தோன்றுதல்.
<br/><em>உதாரணம்:</em> வாழை + பழம் = வாழைப்பழம் ('ப்' தோன்றியது)</li>
<li><strong>திரிதல்:</strong> ஒரு எழுத்து மற்றொரு எழுத்தாக மாறுதல்.
<br/><em>உதாரணம்:</em> பல் + பொடி = பற்பொடி ('ல்' என்பது 'ற்' ஆகத் திரிந்தது)</li>
<li><strong>கெடுதல்:</strong> ஒரு எழுத்து மறைந்து போதல்.
<br/><em>உதாரணம்:</em> மரம் + வேர் = மரவேர் ('ம்' கெட்டது)</li>
</ol>`,
  },
];

// Rich Quiz questions for Grade 09
export const initialQuizBank: Record<string, QuizQuestion[]> = {
  science: [
    {
      id: "sci-q1",
      type: "mcq",
      question: "Which of the following is produced during the neutralization reaction between dilute Hydrochloric acid and Sodium hydroxide?",
      options: ["Sodium chloride and Water", "Sodium sulfate and Hydrogen gas", "Chlorine gas and Water", "Sodium hydride and Oxygen"],
      correctAnswer: "Sodium chloride and Water",
      explanation: "Acid + Base forms Salt (NaCl) and Water (H2O).",
      difficulty: "Easy",
    },
    {
      id: "sci-q2",
      type: "true_false",
      question: "According to Newton's First Law, an object at rest will remain at rest unless acted upon by an unbalanced external force.",
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "This is the classic law of inertia formulated by Sir Isaac Newton.",
      difficulty: "Easy",
    },
    {
      id: "sci-q3",
      type: "mcq",
      question: "What is the unit of Electrical Resistance in SI system?",
      options: ["Ohm (Ω)", "Volt (V)", "Ampere (A)", "Watt (W)"],
      correctAnswer: "Ohm (Ω)",
      explanation: "Resistance is measured in Ohms (symbol: Ω).",
      difficulty: "Easy",
    },
    {
      id: "sci-q4",
      type: "fill_blank",
      question: "In Ohm's Law formula V = I x R, 'I' represents the electric ________.",
      options: ["Current", "Power", "Voltage", "Charge"],
      correctAnswer: "Current",
      explanation: "I stands for electric current measured in Amperes.",
      difficulty: "Medium",
    },
    {
      id: "sci-q5",
      type: "mcq",
      question: "Which tissue in vascular plants is responsible for transporting water and dissolved minerals from roots to leaves?",
      options: ["Xylem", "Phloem", "Parenchyma", "Collenchyma"],
      correctAnswer: "Xylem",
      explanation: "Xylem vessels conduct water upward; Phloem transports organic nutrients/food.",
      difficulty: "Medium",
    },
  ],
  math: [
    {
      id: "math-q1",
      type: "mcq",
      question: "What is the square root of 289?",
      options: ["17", "13", "19", "23"],
      correctAnswer: "17",
      explanation: "17 x 17 = 289.",
      difficulty: "Easy",
    },
    {
      id: "math-q2",
      type: "mcq",
      question: "If 3x + 5 = 26, what is the value of x?",
      options: ["7", "5", "6", "8"],
      correctAnswer: "7",
      explanation: "3x = 26 - 5 = 21. x = 21 / 3 = 7.",
      difficulty: "Easy",
    },
    {
      id: "math-q3",
      type: "true_false",
      question: "The sum of interior angles in any Euclidean triangle is always 180 degrees.",
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Interior angles in any plane triangle sum to 180°.",
      difficulty: "Easy",
    },
    {
      id: "math-q4",
      type: "mcq",
      question: "What is the expansion of (a + b)(a - b)?",
      options: ["a² - b²", "a² + b²", "a² - 2ab + b²", "a² + 2ab + b²"],
      correctAnswer: "a² - b²",
      explanation: "This is the difference of two squares identity.",
      difficulty: "Easy",
    },
    {
      id: "math-q5",
      type: "fill_blank",
      question: "The area of a trapezium is given by: 1/2 x (sum of parallel sides) x ________.",
      options: ["Height", "Base", "Perimeter", "Radius"],
      correctAnswer: "Height",
      explanation: "Area = 1/2 x (a + b) x h.",
      difficulty: "Medium",
    },
  ],
  tamil: [
    {
      id: "tam-q1",
      type: "mcq",
      question: "'வாழை + பழம் = வாழைப்பழம்' - இது எவ்வகை புணர்ச்சி?",
      options: ["தோன்றல் விகாரம்", "திரிதல் விகாரம்", "கெடுதல் விகாரம்", "இயல்புப் புணர்ச்சி"],
      correctAnswer: "தோன்றல் விகாரம்",
      explanation: "நிலைமொழியும் வருமொழியும் இணையும் போது 'ப்' எனும் மெய்யெழுத்து புதிதாகத் தோன்றியுள்ளது.",
      difficulty: "Easy",
    },
    {
      id: "tam-q2",
      type: "mcq",
      question: "திருக்குறளை இயற்றிய புலவர் யார்?",
      options: ["திருவள்ளுவர்", "ஔவையார்", "பாரதியார்", "கம்பர்"],
      correctAnswer: "திருவள்ளுவர்",
      explanation: "திருக்குறளை இயற்றியவர் திருவள்ளுவர்.",
      difficulty: "Easy",
    },
  ],
};

// Initial Flashcards
export const initialFlashcards: Flashcard[] = [
  {
    id: "fc-1",
    subjectId: "science",
    chapterId: "sci-c2",
    front: "What is the pH of a neutral solution like pure water at 25°C?",
    back: "pH = 7. Acidic solutions have pH < 7, and Alkaline solutions have pH > 7.",
    status: "mastered",
    reviewCount: 4,
    isFavourite: true,
  },
  {
    id: "fc-2",
    subjectId: "science",
    chapterId: "sci-c5",
    front: "State Ohm's Law in words and equation.",
    back: "The current through a conductor between two points is directly proportional to the voltage across the two points: V = I x R.",
    status: "easy",
    reviewCount: 3,
    isFavourite: true,
  },
  {
    id: "fc-3",
    subjectId: "math",
    chapterId: "math-c3",
    front: "Factorise: x² - 49",
    back: "(x + 7)(x - 7) using the difference of two squares identity a² - b² = (a+b)(a-b).",
    status: "easy",
    reviewCount: 2,
    isFavourite: false,
  },
  {
    id: "fc-4",
    subjectId: "math",
    chapterId: "math-c7",
    front: "Formula for the Area of a Trapezium",
    back: "Area = 1/2 × (a + b) × h, where a and b are lengths of parallel sides, and h is the perpendicular height.",
    status: "medium",
    reviewCount: 1,
    isFavourite: true,
  },
  {
    id: "fc-5",
    subjectId: "history",
    chapterId: "his-c1",
    front: "Which monarch built the famous Parakrama Samudra reservoir?",
    back: "King Parakramabahu the Great (1153–1186 AD) in the Polonnaruwa Kingdom.",
    status: "mastered",
    reviewCount: 5,
    isFavourite: true,
  },
  {
    id: "fc-6",
    subjectId: "tamil",
    chapterId: "tam-c1",
    front: "மெய்முன் உயிர் புணர்ச்சி விதி யாது?",
    back: "'உடல்மேல் உயிர்வந்து ஒன்றுவது இயல்பே' - நிலைமொழி ஈற்று மெய்யோடு வருமொழி முதலுயிர் இணைந்து உயிர்மெய்யாகும். எ.கா: கல் + எறிந்தான் = கல்லெறிந்தான்.",
    status: "hard",
    reviewCount: 1,
    isFavourite: true,
  },
];

// Initial Timetable entries
export const initialTimetable: TimetableEntry[] = [
  { id: "tt-1", dayOfWeek: 1, subjectId: "math", startTime: "16:00", endTime: "17:00", topic: "Simultaneous Equations", completed: true },
  { id: "tt-2", dayOfWeek: 1, subjectId: "science", startTime: "17:15", endTime: "18:15", topic: "Ohm's Law Practice", completed: false },
  { id: "tt-3", dayOfWeek: 2, subjectId: "tamil", startTime: "16:00", endTime: "17:00", topic: "Punarcci Rules & Thirukkural", completed: false },
  { id: "tt-4", dayOfWeek: 2, subjectId: "english", startTime: "17:15", endTime: "18:00", topic: "Active / Passive Voice Drills", completed: false },
  { id: "tt-5", dayOfWeek: 3, subjectId: "history", startTime: "16:00", endTime: "17:00", topic: "Polonnaruwa Irrigation", completed: false },
  { id: "tt-6", dayOfWeek: 4, subjectId: "ict", startTime: "16:00", endTime: "17:00", topic: "Excel Formulas & Logic", completed: false },
  { id: "tt-7", dayOfWeek: 5, subjectId: "math", startTime: "16:00", endTime: "17:30", topic: "Geometry Congruence Proofs", completed: false },
];

// Initial Daily Goals
export const initialGoals: DailyGoal[] = [
  { id: "g-1", title: "Complete 25m Pomodoro Science Study", targetMinutes: 25, completed: true, category: "study", date: "2026-03-12" },
  { id: "g-2", title: "Solve 5 Math Linear Equation Questions", completed: true, category: "quiz", date: "2026-03-12" },
  { id: "g-3", title: "Read Chapter 2 in Science PDF", completed: false, category: "pdf", date: "2026-03-12" },
  { id: "g-4", title: "Review 10 Flashcards in Spaced Repetition", completed: false, category: "revision", date: "2026-03-12" },
  { id: "g-5", title: "Write Short Note on Ohm's Law", completed: false, category: "notes", date: "2026-03-12" },
];

// Initial Exams
export const initialExams: ExamEntry[] = [
  {
    id: "ex-1",
    subjectId: "math",
    title: "Grade 09 Term 2 Mid-Term Mathematics Assessment",
    date: "2026-04-05",
    time: "08:30 AM",
    syllabusCoveredPercent: 82,
    pastPapersAvailable: 8,
    notes: "Focus especially on quadratic expressions and simultaneous equations.",
  },
  {
    id: "ex-2",
    subjectId: "science",
    title: "Grade 09 Science Second Term Examination",
    date: "2026-04-08",
    time: "08:30 AM",
    syllabusCoveredPercent: 75,
    pastPapersAvailable: 6,
    notes: "Revise experimental setups for neutralization and Ohm's Law circuits.",
  },
  {
    id: "ex-3",
    subjectId: "tamil",
    title: "Tamil Language & Literature Term Test",
    date: "2026-04-12",
    time: "10:30 AM",
    syllabusCoveredPercent: 90,
    pastPapersAvailable: 5,
    notes: "Revise Thirukkural explanations and letter writing format.",
  },
];

// Homework
export const initialHomework: HomeworkItem[] = [
  { id: "hw-1", subjectId: "math", title: "Exercise 4.2 Simultaneous Equations Q 1-10", description: "Solve using elimination method and show all working steps in notebook.", dueDate: "2026-03-15", completed: false, priority: "high" },
  { id: "hw-2", subjectId: "science", title: "Draw and label the Universal Indicator pH Chart", description: "Colours from pH 1 to 14 with everyday examples of acids and bases.", dueDate: "2026-03-16", completed: true, priority: "medium" },
  { id: "hw-3", subjectId: "ict", title: "Create Spreadsheet Budget with SUM & AVERAGE", description: "Create table for weekly expenses and insert a pie chart.", dueDate: "2026-03-18", completed: false, priority: "low" },
];

// Educational Videos
export const initialVideos: EducationalVideo[] = [
  {
    id: "vid-1",
    subjectId: "science",
    title: "Grade 09 Science: Acids, Bases, Salts & Litmus Reactions Explained",
    duration: "14:20",
    thumbnail: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    channel: "National Institute of Education (NIE)",
    isFavourite: true,
    watched: true,
  },
  {
    id: "vid-2",
    subjectId: "math",
    title: "Grade 09 Mathematics: How to Solve Simultaneous Equations Easily",
    duration: "18:45",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    channel: "Master Math Sri Lanka",
    isFavourite: true,
    watched: false,
  },
  {
    id: "vid-3",
    subjectId: "history",
    title: "Polonnaruwa Civilization & Parakramabahu Water Engineering",
    duration: "21:10",
    thumbnail: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    channel: "Sri Lankan Heritage Education",
    isFavourite: false,
    watched: false,
  },
];

// Important Questions Archive
export const initialImportantQuestions: ImportantQuestion[] = [
  {
    id: "iq-1",
    subjectId: "science",
    question: "Explain what happens when dilute Hydrochloric acid (HCl) is added to Sodium hydroxide (NaOH) solution with phenolphthalein.",
    answer: "The solution initially turns pink due to the basic NaOH. As HCl is added drops by drops, H+ ions neutralize OH- ions forming water and sodium chloride. At the neutralization point, the solution turns completely colourless.",
    explanation: "Standard structured question appearing in 2022 and 2024 Grade 09 papers.",
    isFavourite: true,
    year: "2024 Term 2",
  },
  {
    id: "iq-2",
    subjectId: "math",
    question: "A father is 3 times as old as his son. In 12 years, he will be twice as old as his son. Find their present ages.",
    answer: "Let son's age = x, father's age = 3x. In 12 years: (3x + 12) = 2(x + 12) ⇒ 3x + 12 = 2x + 24 ⇒ x = 12. Son is 12 years old, Father is 36 years old.",
    explanation: "Linear simultaneous word equation frequently tested in Section B.",
    isFavourite: true,
    year: "2023 Provincial",
  },
  {
    id: "iq-3",
    subjectId: "tamil",
    question: "'கற்க கசடறக் கற்பவை கற்றபின் நிற்க அதற்குத் தக' - இக்குறளின் பொருளை விளக்குக.",
    answer: "கற்க வேண்டிய நூல்களை குற்றமறக் கற்க வேண்டும். அவ்வாறு கற்ற பின்னர், கற்ற கல்விக்கு ஏற்றவாறு நன்னெறியில் ஒழுக்கமாக வாழ வேண்டும் என்பதே இதன் பொருளாகும்.",
    explanation: "கல்வி அதிகாரத்தில் இடம்பெறும் முதன்மைக் குறள்.",
    isFavourite: true,
    year: "2024",
  },
];

// Achievements & Badges
export const initialAchievements: AchievementBadge[] = [
  { id: "ach-1", title: "First Step Scholar", description: "Completed your very first Grade 09 study session", icon: "GraduationCap", unlocked: true, unlockedAt: "2026-03-01", progress: 1, maxProgress: 1 },
  { id: "ach-2", title: "7-Day Streak Master", description: "Maintained a continuous 7-day study streak", icon: "Flame", unlocked: true, unlockedAt: "2026-03-07", progress: 7, maxProgress: 7 },
  { id: "ach-3", title: "Quiz Champion", description: "Scored 100% on any Grade 09 academic quiz", icon: "Award", unlocked: true, unlockedAt: "2026-03-09", progress: 1, maxProgress: 1 },
  { id: "ach-4", title: "Bookworm Reader", description: "Read and annotated more than 50 pages of study PDFs", icon: "BookOpen", unlocked: false, progress: 34, maxProgress: 50 },
  { id: "ach-5", title: "Pomodoro Warrior", description: "Logged over 10 hours of focused study time", icon: "Clock", unlocked: false, progress: 7.5, maxProgress: 10 },
  { id: "ach-6", title: "Memory Prodigy", description: "Mastered 25 Flashcards with spaced repetition", icon: "Brain", unlocked: false, progress: 14, maxProgress: 25 },
];
