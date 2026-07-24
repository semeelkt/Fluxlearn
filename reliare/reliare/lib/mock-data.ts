export type MockArticle = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  authorSlug: string;
  date: string;
  readingTime: number;
  cover: string;
  views?: number;
  editorsPick?: boolean;
  trending?: boolean;
};

export const categories = [
  { name: "Islamic Theology", slug: "islamic-theology", count: 124 },
  { name: "Qur'an Studies", slug: "quran-studies", count: 98 },
  { name: "Hadith", slug: "hadith", count: 72 },
  { name: "Fiqh", slug: "fiqh", count: 61 },
  { name: "History", slug: "history", count: 88 },
  { name: "Comparative Religion", slug: "comparative-religion", count: 55 },
  { name: "Science", slug: "science", count: 40 },
  { name: "Technology", slug: "technology", count: 22 },
];

export const articles: MockArticle[] = [
  {
    slug: "epistemic-humility-and-revelation",
    title: "Epistemic Humility and the Limits of Revelation",
    summary:
      "A close reading of how classical scholars framed the boundary between certain knowledge and reasoned inference — and what it means for how we argue today.",
    category: "Islamic Theology",
    author: "Dr. Amina Yusuf",
    authorSlug: "amina-yusuf",
    date: "2026-07-14",
    readingTime: 12,
    cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=1200&q=80",
    editorsPick: true,
  },
  {
    slug: "chronology-of-the-meccan-surahs",
    title: "Reconstructing the Chronology of the Meccan Surahs",
    summary: "Why the traditional ordering matters more than modern readers assume, and where revisionist dating falls short.",
    category: "Qur'an Studies",
    author: "Yusuf Tanvir",
    authorSlug: "yusuf-tanvir",
    date: "2026-07-10",
    readingTime: 9,
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80",
    trending: true,
  },
  {
    slug: "isnad-criticism-modern-historiography",
    title: "Isnad Criticism and Modern Historiography",
    summary: "How the discipline of hadith authentication anticipated methods historians now treat as novel.",
    category: "Hadith",
    author: "Dr. Amina Yusuf",
    authorSlug: "amina-yusuf",
    date: "2026-07-06",
    readingTime: 15,
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=80",
  },
  {
    slug: "maqasid-in-contemporary-fiqh",
    title: "Maqasid al-Shariah in Contemporary Fiqh Debates",
    summary: "Objectives-based reasoning is often invoked, rarely defined. A framework for using it responsibly.",
    category: "Fiqh",
    author: "Sh. Bilal Rahman",
    authorSlug: "bilal-rahman",
    date: "2026-06-29",
    readingTime: 11,
    cover: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80",
    trending: true,
  },
  {
    slug: "andalusian-translation-movement",
    title: "The Andalusian Translation Movement and the Shape of European Thought",
    summary: "Toledo's schools didn't just preserve texts, they restructured how a continent argued.",
    category: "History",
    author: "Yusuf Tanvir",
    authorSlug: "yusuf-tanvir",
    date: "2026-06-22",
    readingTime: 14,
    cover: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1200&q=80",
  },
  {
    slug: "comparative-eschatology",
    title: "Comparative Eschatology: Judgment Across Traditions",
    summary: "Where Abrahamic accounts of the last day converge, and where the differences are irreducible.",
    category: "Comparative Religion",
    author: "Dr. Amina Yusuf",
    authorSlug: "amina-yusuf",
    date: "2026-06-18",
    readingTime: 10,
    cover: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=1200&q=80",
    editorsPick: true,
  },
  {
    slug: "fine-tuning-argument-revisited",
    title: "The Fine-Tuning Argument, Revisited",
    summary: "A sober audit of the strongest objections, and why the argument survives most of them.",
    category: "Science",
    author: "Sh. Bilal Rahman",
    authorSlug: "bilal-rahman",
    date: "2026-06-12",
    readingTime: 13,
    cover: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80",
  },
  {
    slug: "algorithmic-ethics-old-questions",
    title: "Algorithmic Ethics Is an Old Question in New Clothes",
    summary: "Automated decision-making revives debates jurists were already having about proxies for intention.",
    category: "Technology",
    author: "Yusuf Tanvir",
    authorSlug: "yusuf-tanvir",
    date: "2026-06-05",
    readingTime: 8,
    cover: "https://images.unsplash.com/photo-1620712943543-95fc69a92373?w=1200&q=80",
  },
];

export const popularThisWeek = [
  { title: "Epistemic Humility and the Limits of Revelation", slug: "epistemic-humility-and-revelation", date: "Jul 14", views: 18420 },
  { title: "Maqasid al-Shariah in Contemporary Fiqh Debates", slug: "maqasid-in-contemporary-fiqh", date: "Jun 29", views: 15310 },
  { title: "Reconstructing the Chronology of the Meccan Surahs", slug: "chronology-of-the-meccan-surahs", date: "Jul 10", views: 12904 },
  { title: "The Fine-Tuning Argument, Revisited", slug: "fine-tuning-argument-revisited", date: "Jun 12", views: 11255 },
  { title: "Isnad Criticism and Modern Historiography", slug: "isnad-criticism-modern-historiography", date: "Jul 6", views: 9871 },
];

export const researchPapers = [
  {
    slug: "authenticity-criteria-comparative-study",
    title: "Authenticity Criteria in Classical and Modern Hadith Scholarship: A Comparative Study",
    abstract:
      "This paper examines the methodological continuities between isnad-based authentication and modern source-criticism, arguing that the former anticipated key innovations often credited to 19th-century historiography.",
    author: "Dr. Amina Yusuf",
    journal: "Journal of Islamic Studies",
    date: "May 2026",
    cover: "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&q=80",
  },
  {
    slug: "maqasid-framework-bioethics",
    title: "A Maqasid Framework for Emerging Bioethical Questions",
    abstract:
      "Applying objectives-based jurisprudence to gene editing and end-of-life care, proposing a structured decision procedure for contemporary fatwa councils.",
    author: "Sh. Bilal Rahman",
    journal: "Contemporary Fiqh Review",
    date: "March 2026",
    cover: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80",
  },
];

export const authors = [
  {
    slug: "amina-yusuf",
    name: "Dr. Amina Yusuf",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    bio: "Dr. Amina Yusuf is a historian of early Islamic thought, focusing on the transmission and authentication of prophetic tradition.",
  },
  {
    slug: "yusuf-tanvir",
    name: "Yusuf Tanvir",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    bio: "Yusuf Tanvir writes on intellectual history, translation, and the exchange of ideas across the medieval Mediterranean.",
  },
  {
    slug: "bilal-rahman",
    name: "Sh. Bilal Rahman",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    bio: "Sh. Bilal Rahman teaches Islamic jurisprudence and writes on the intersection of classical law and contemporary science.",
  },
];
