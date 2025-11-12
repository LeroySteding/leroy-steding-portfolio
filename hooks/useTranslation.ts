import { useLanguage } from "@/contexts/LanguageContext";
import { en } from "@/locales/en";
import { nl } from "@/locales/nl";

export function useTranslation() {
  const { language } = useLanguage();
  return language === "nl" ? nl : en;
}
