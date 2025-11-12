import { projects as projectsEN } from "@/data/projects";
import { experiences as experiencesEN } from "@/data/experiences";
import { projectsNL } from "@/data/projects-nl";
import { experiencesNL } from "@/data/experiences-nl";

type Language = "en" | "nl";

export function getProjects(language: Language) {
  return language === 'nl' ? projectsNL : projectsEN;
}

export function getExperiences(language: Language) {
  return language === 'nl' ? experiencesNL : experiencesEN;
}

export function getProjectById(id: string, language: Language) {
  const projects = getProjects(language);
  return projects.find(p => p.id === id);
}

export function getExperienceById(id: string, language: Language) {
  const experiences = getExperiences(language);
  return experiences.find(e => e.id === id);
}
