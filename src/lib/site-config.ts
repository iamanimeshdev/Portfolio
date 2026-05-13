export const siteConfig = {
  name: "Animesh Dev",
  handle: "iamanimeshdev",
  role: "Software Engineer",
  tagline:
    "I build scalable full-stack applications, AI-powered systems, and high-performance digital experiences.",

  bio: "Software Engineering student specializing in AI-driven and full-stack development with experience building scalable applications using LLMs, RAG systems, cloud platforms, and modern web technologies.",

  location: "Bangalore, India",

  email: "iamanimeshdev@gmail.com",

  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  githubUrl: "https://github.com/iamanimeshdev",

  linkedinUrl:
    "https://www.linkedin.com/in/animesh-dev-7140ab275/",

  twitterUrl: "https://twitter.com/iamanimeshdev",

  githubUsername:
    process.env.NEXT_PUBLIC_GITHUB_USERNAME ||
    "iamanimeshdev",

  featuredRepoNames: [
    "OrionAI",
    "HRflow",
    "Prisma",
  ],

  repoDemoUrls: {
    OrionAI: "https://orion-ai-woad.vercel.app/",

    HRflow: "https://h-rflow.vercel.app/",

    Prisma: "https://www.youtube.com/watch?v=owaFW7JMnxk",
  },

  stats: {
    yearsCoding: 3,
    projectsShipped: 25,
    technologiesCount: 28,
    contributionsApprox: "1.2k",
  },

  experience: [
    {
      id: "1",

      company: "CoralLifeScience",

      role: "Web Developer (Contract)",

      period: "Jan 2026",

      summary:
        "Developed and deployed production-grade frontend applications using Next.js and React for pharmaceutical workflows and operational systems.",

      stack: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
      ],
    },
  ],

  detailedProjects: [
    {
      id: "1",
      name: "Real-Time Meeting Transcription & Workflow Automation System",
      role: "Full Stack Developer",
      period: "January 2026",
      summary: [
        "Built an AI-powered transcription system using Node.js and Python, integrating two independent processing pipelines for robust transcript generation from live meeting data.",
        "Developed a Playwright-based pipeline for real-time caption extraction and validation, alongside a separate Python + WhisperX speech-to-text pipeline, improving reliability and accuracy across sessions.",
        "Designed an automated workflow system for transcript summarization and email delivery, reducing manual post-meeting effort by 70% and enabling faster decision-making in team workflows.",
      ],
      stack: ["Node.js", "Express.js", "Python", "WhisperX", "Playwright"],
      githubUrl: "https://github.com/iamanimeshdev/Transcripter.ai",
    },
    {
      id: "2",
      name: "Enterprise Resource Planning (ERP) System",
      role: "Full Stack Developer",
      period: "September 2025",
      summary: [
        "Built a role-based ERP system to streamline inventory, customer records, and order processing workflows across organizational operations.",
        "Implemented PostgreSQL database transactions to maintain accurate inventory data and prevent inconsistencies during concurrent order processing.",
        "Developed and tested secure REST APIs using JWT authentication and middleware-based authorization with Postman, ensuring reliable backend services, and deployed using CI/CD-enabled workflows.",
      ],
      stack: ["Node.js", "Express.js", "React", "PostgreSQL", "Prisma", "JWT", "Render"],
      githubUrl: "https://github.com/iamanimeshdev/NewERP",
    },
    {
      id: "3",
      name: "Orion.ai – AI-Powered React Application Generator",
      role: "Full Stack Developer",
      period: "July 2025",
      summary: [
        "Built an AI-driven platform that converts natural language prompts into fully functional React applications, leveraging LLMs to generate structured, production-ready UI code.",
        "Implemented real-time in-browser code transpilation using Babel, enabling dynamic code generation and rendering of responsive user interfaces in under 60 seconds.",
        "Designed a full-stack architecture using Next.js, Express.js, and Firebase, along with an automated deployment pipeline supporting one-click deployment and seamless cloud hosting.",
      ],
      stack: ["Next.js", "Express.js", "React", "Babel", "Firebase", "LLM", "Vercel", "Railway"],
      githubUrl: "https://github.com/iamanimeshdev/OrionAI",
    },
  ],

  techOrbit: [
    { name: "React", color: "#61dafb" },
    { name: "Next.js", color: "#ffffff" },
    { name: "JavaScript", color: "#f7df1e" },
    { name: "Node.js", color: "#68a063" },
    { name: "Express.js", color: "#9ca3af" },
    { name: "Python", color: "#3776ab" },
    { name: "FastAPI", color: "#009688" },
    { name: "PostgreSQL", color: "#336791" },
    { name: "MongoDB", color: "#10aa50" },
    { name: "Docker", color: "#2496ed" },
    { name: "AWS", color: "#ff9900" },
    { name: "Tailwind CSS", color: "#38bdf8" },
    { name: "LLMs", color: "#a855f7" },
  ],

  heroTerminalLines: [
    "> initializing portfolio...",
    "> loading AI systems...",
    "> syncing GitHub repositories...",
    "> rendering cinematic experience...",
  ],

  rotatingStack: [
    "Next.js",
    "TypeScript",
    "AI Systems",
    "LLMs",
    "RAG Pipelines",
    "Cloud Deployment",
    "PostgreSQL",
    "Full-stack Development",
  ],
} as const;

export type SiteConfig = typeof siteConfig;