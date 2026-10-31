// ─────────────────────────────────────────────────────────────
// EDIT EVERYTHING IN THIS FILE. Components read from it.
// Fields marked PLACEHOLDER are honest placeholders — replace
// them with real data. Never invent projects or achievements.
// ─────────────────────────────────────────────────────────────

export type SocialPlatform = "github" | "linkedin" | "twitter" | "email" | "website" | "instagram";

export interface Social {
  platform: SocialPlatform;
  label: string;
  href: string;
  handle?: string;
}

export interface Chapter {
  id: string;
  index: string;
  slug: string;
  heading: string;
}

export interface SiteMeta {
  name: string;
  firstName: string;
  monogram: string;
  roles: string[];
  tagline: string;
  availability: string;
  location: string;
  education: string;
  focus: string;
  email: string;
  socials: Social[];
  story: string[];
}

export interface Technology {
  name: string;
  description: string;
  level?: string;
  icon?: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  technologies: Technology[];
}

export type ProjectCategory = "web" | "ai" | "experiments";

export interface Project {
  id: string;
  index: string;
  title: string;
  year: string;
  category: ProjectCategory;
  summary: string;
  story: string;
  stack: string[];
  cover: string;
  github?: string;
  demo?: string;
  placeholder?: boolean;
}

export interface JourneyEntry {
  year: string;
  title: string;
  description?: string;
  current?: boolean;
}

export interface Interest {
  label: string;
  emoji?: string;
}

/* ─────────────────────────── SITE ─────────────────────────── */

export const site: SiteMeta = {
  name: "SHARUK SHARUK",
  firstName: "ITS",
  monogram: "SK",
  roles: ["Developer", "Creator", "Problem Solver"],
  tagline: "I don't just write code. I create experiences.",
  availability: "Available for opportunities",
  location: "Villupuram, India",
  education: "Msc, Computer Science",
  focus: "Interfaces, systems & the space between",
  email: "hello@yourSharuk.dev",
  socials: [
    { platform: "github",   label: "GitHub",   href: "https://github.com/hitmansharuk15-blip",      handle: "@hitmansharuk15-blip" },
    { platform: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/sharukhan-b-78925b364?utm_source=share_via&utm_content=profile&utm_medium=member_android", handle: "Sharuk@linkedin" },
    { platform: "email",    label: "Email",    href: "hitmansharuk15@gmail.com",         handle: "hello@yourdomain.dev" },
     { platform: "instagram",label: "Instagram",href: "https://www.instagram.com/hitman___official?xtok=MTNyZXNmYjBiZnVtNQ==", handle: "hitman___official" },
  ],
  story: [
    "I build things for the web that feel less like software and more like atmosphere — considered, quiet, deliberate.",
    "I care about typography, motion, and the half-second before something responds. That half-second is where craft lives.",
    "Currently studying, shipping, and looking for a team that treats the browser like a canvas.",
  ],
};

/* ──────────────────────── CHAPTERS ────────────────────────── */

export const chapters: Chapter[] = [
  { id: "hero",     index: "00", slug: "Home",     heading: "ACQUISITION" },
  { id: "about",    index: "01", slug: "About",    heading: "IDENTITY" },
  { id: "skills",   index: "02", slug: "Skills",   heading: "CAPABILITIES" },
  { id: "projects", index: "03", slug: "Projects", heading: "ARTIFACTS" },
  { id: "journey",  index: "04", slug: "Journey",  heading: "TRAJECTORY" },
  { id: "contact",  index: "05", slug: "Contact",  heading: "TRANSMIT" },
];

/* ───────────────────────── SKILLS ─────────────────────────── */

export const skills: SkillCategory[] = [
  {
    id: "frontend",
    label: "Frontend Development",
    technologies: [
      { name: "React",      description: "Component architecture, hooks, composition.", icon: "Atom" },
      { name: "Next.js",    description: "App Router, server components, streaming.",  icon: "Triangle" },
      { name: "TypeScript", description: "Strict typing, generics, discriminated unions.", icon: "FileCode2" },
      { name: "Tailwind",   description: "Design tokens, responsive systems.",          icon: "Wind" },
      { name: "Motion",     description: "Choreographed transitions & scroll effects.", icon: "Waves" },
    ],
  },
  {
    id: "backend",
    label: "Backend Development",
    technologies: [
      { name: "Node.js", description: "APIs, streaming, tooling.",      icon: "Server" },
      { name: "Express", description: "REST endpoints & middleware.",   icon: "Route" },
      { name: "REST",    description: "Resource-oriented API design.",  icon: "Globe" },
    ],
  },
  {
    id: "languages",
    label: "Programming Languages",
    technologies: [
      { name: "TypeScript", description: "Primary language.",        icon: "FileCode2" },
      { name: "JavaScript", description: "Everyday utilities.",      icon: "Braces" },
      { name: "Python",     description: "Scripting & data work.",   icon: "Terminal" },
      { name: "SQL",        description: "Querying & shaping data.", icon: "Database" },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    technologies: [
      { name: "PostgreSQL", description: "Relational data modeling.", icon: "Database" },
      { name: "MongoDB",    description: "Document stores.",          icon: "Leaf" },
    ],
  },
  {
    id: "tools",
    label: "Tools & Workflow",
    technologies: [
      { name: "Git",    description: "Version control & collaboration.", icon: "GitBranch" },
      { name: "Figma",  description: "Interface design & handoff.",       icon: "Figma" },
      { name: "Vercel", description: "Deployment & previews.",            icon: "Triangle" },
    ],
  },
];

/* ───────────────────────── PROJECTS ──────────────────────── */

// PLACEHOLDER PROJECTS — replace with real ones you've actually built.
// `placeholder: true` renders an honest "PLACEHOLDER" tag and disables links.

export const projects: Project[] = [
  {
    id: "foodexpress",
    index: "01",
    title: "Food ordering system",
    year: "2025",
    category: "web",
    summary: "A short, honest line about what this is.",
    story: "What problem it solves, what you learned, what you'd do differently.",
    stack: ["Html", "JavaScript", "Css", "Php"],
    cover: "/1.jpg",
    github: "https://github.com/hitmansharuk15-blip/foodie-express",
    placeholder:false,
  },
  {
    id: "project-02",
    index: "02",
    title: "Portfolio website",
    year: "2025",
    category: "ai",
    summary: "A short, honest line about what this is.",
    story: "What problem it solves, what you learned, what you'd do differently.",
    stack: ["React", "Motion"],
    cover: "/portfolio.jpg",
    github: "https://github.com/hitmansharuk15-blip/portfolio",
    placeholder: true,
  },
  {
    id: "project-03",
    index: "03",
    title: "Cafe website",
    year: "2024",
    category: "experiments",
    summary: "A short, honest line about what this is.",
    story: "What problem it solves, what you learned, what you'd do differently.",
    stack: ["Next.js", "Tailwind"],
    cover: "/cafe.webp",
     github: "https://github.com/hitmansharuk15-blip/website_cafe",
    placeholder: false,
  },
];

/* ───────────────────────── JOURNEY ───────────────────────── */

export const journey: JourneyEntry[] = [
  { year: "2023", title: "Started Msc, Computer Science", description: "First exposure to systems and the web.", current: false },
  { year: "2024", title: "Learned React & design systems",   description: "Shifted from making things work to making things feel right." },
  { year: "2026", title: "Building in public",               description: "Shipping small, honest projects. Currently learning motion & interaction design.", current: true },
];

/* ──────────────────────── INTERESTS ──────────────────────── */

export const interests: Interest[] = [
  { label: "Typography",     emoji: "✳" },
  { label: "Cinematic film", emoji: "◐" },
  { label: "Generative art", emoji: "◆" },
  { label: "Coffee rituals", emoji: "☕" },
  { label: "Night walks",    emoji: "◑" },
];