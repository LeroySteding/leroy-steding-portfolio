export interface TechCategory {
  name: string;
  nameNL: string;
  icon: string;
  technologies: Technology[];
}

export interface Technology {
  name: string;
  icon: string;
  color: string;
  proficiency: number; // 1-100
}

export const techStack: TechCategory[] = [
  {
    name: "Frontend",
    nameNL: "Frontend",
    icon: "🎨",
    technologies: [
      { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", color: "#61DAFB", proficiency: 95 },
      { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", color: "#000000", proficiency: 95 },
      { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", color: "#3178C6", proficiency: 90 },
      { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", color: "#F7DF1E", proficiency: 95 },
      { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", color: "#06B6D4", proficiency: 90 },
      { name: "Vue.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg", color: "#4FC08D", proficiency: 80 },
      { name: "Angular", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg", color: "#DD0031", proficiency: 75 },
      { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", color: "#E34F26", proficiency: 95 },
      { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", color: "#1572B6", proficiency: 90 },
      { name: "SASS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg", color: "#CC6699", proficiency: 85 },
    ]
  },
  {
    name: "Mobile",
    nameNL: "Mobiel",
    icon: "📱",
    technologies: [
      { name: "React Native", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", color: "#61DAFB", proficiency: 90 },
      { name: "Expo", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/expo/expo-original.svg", color: "#000020", proficiency: 85 },
    ]
  },
  {
    name: "Backend",
    nameNL: "Backend",
    icon: "⚙️",
    technologies: [
      { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", color: "#339933", proficiency: 90 },
      { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", color: "#3776AB", proficiency: 85 },
      { name: "FastAPI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg", color: "#009688", proficiency: 85 },
      { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", color: "#007396", proficiency: 75 },
      { name: "Spring Boot", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg", color: "#6DB33F", proficiency: 70 },
    ]
  },
  {
    name: "Database",
    nameNL: "Database",
    icon: "💾",
    technologies: [
      { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", color: "#4169E1", proficiency: 85 },
      { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", color: "#47A248", proficiency: 80 },
      { name: "Redis", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg", color: "#DC382D", proficiency: 75 },
      { name: "Supabase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg", color: "#3ECF8E", proficiency: 85 },
    ]
  },
  {
    name: "DevOps & Tools",
    nameNL: "DevOps & Tools",
    icon: "🛠️",
    technologies: [
      { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", color: "#2496ED", proficiency: 85 },
      { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", color: "#F05032", proficiency: 95 },
      { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", color: "#181717", proficiency: 90 },
      { name: "GitLab", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg", color: "#FC6D26", proficiency: 85 },
      { name: "Jenkins", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg", color: "#D24939", proficiency: 75 },
      { name: "Vercel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg", color: "#000000", proficiency: 90 },
    ]
  },
  {
    name: "Cloud & Infrastructure",
    nameNL: "Cloud & Infrastructuur",
    icon: "☁️",
    technologies: [
      { name: "Azure", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg", color: "#0089D6", proficiency: 75 },
      { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg", color: "#FF9900", proficiency: 70 },
    ]
  },
  {
    name: "AI & Automation",
    nameNL: "AI & Automatisering",
    icon: "🤖",
    technologies: [
      { name: "OpenAI", icon: "⚡", color: "#10A37F", proficiency: 85 },
      { name: "LangChain", icon: "🦜", color: "#1C3C3C", proficiency: 80 },
      { name: "n8n", icon: "🔗", color: "#EA4B71", proficiency: 85 },
      { name: "Playwright", icon: "🎭", color: "#2EAD33", proficiency: 80 },
    ]
  },
  {
    name: "E-Commerce",
    nameNL: "E-Commerce",
    icon: "🛒",
    technologies: [
      { name: "MedusaJS", icon: "🛍️", color: "#7C3AED", proficiency: 85 },
      { name: "Stripe", icon: "💳", color: "#008CDD", proficiency: 90 },
      { name: "SAP Hybris", icon: "🏢", color: "#0FAAFF", proficiency: 75 },
    ]
  },
  {
    name: "Testing & Quality",
    nameNL: "Testen & Kwaliteit",
    icon: "✅",
    technologies: [
      { name: "Jest", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg", color: "#C21325", proficiency: 85 },
      { name: "Storybook", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/storybook/storybook-original.svg", color: "#FF4785", proficiency: 85 },
      { name: "ESLint", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg", color: "#4B32C3", proficiency: 90 },
      { name: "SonarQube", icon: "🔍", color: "#4E9BCD", proficiency: 75 },
    ]
  },
  {
    name: "Design & Collaboration",
    nameNL: "Design & Samenwerking",
    icon: "🎯",
    technologies: [
      { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", color: "#F24E1E", proficiency: 80 },
      { name: "Jira", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg", color: "#0052CC", proficiency: 85 },
      { name: "Confluence", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/confluence/confluence-original.svg", color: "#172B4D", proficiency: 80 },
    ]
  }
];

export const companies = [
  { name: "SURF", logo: "🎓", website: "https://surf.nl" },
  { name: "Hifive", logo: "🚀", website: "https://hifive.nl" },
  { name: "VodafoneZiggo", logo: "📡", website: "https://vodafoneziggo.nl" },
  { name: "BraveLink", logo: "🔗", website: "https://bravelink.nl" },
  { name: "BraveOrange", logo: "🍊", website: "https://braveorange.nl" },
  { name: "Robidus", logo: "🏥", website: "https://robidus.nl" },
  { name: "Timber & Building Supplies", logo: "🏗️", website: "#" },
];
