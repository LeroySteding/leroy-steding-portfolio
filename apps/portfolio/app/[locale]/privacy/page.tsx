import PrivacyContent from "./PrivacyContent";

export const metadata = {
  title: "Privacy Policy | STEDING.",
  description:
    "Learn how we collect, use, and protect your personal information. Our privacy policy explains our commitment to your privacy and data security.",
  alternates: {
    canonical: "https://leroysteding.nl/privacy",
    languages: {
      en: "https://leroysteding.nl/privacy",
      nl: "https://leroysteding.nl/nl/privacy",
    },
  },
  openGraph: {
    title: "Privacy Policy | STEDING.",
    description:
      "Learn how we collect, use, and protect your personal information.",
    locale: "en_US",
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyContent />;
}
