import TermsContent from "./TermsContent";

export const metadata = {
  title: "Terms of Service | STEDING.",
  description:
    "Read our terms of service for using this website. Understand your rights and responsibilities when using our services.",
  alternates: {
    canonical: "https://leroysteding.nl/terms",
    languages: {
      nl: "https://leroysteding.nl/terms",
      en: "https://leroysteding.nl/en/terms",
      "x-default": "https://leroysteding.nl/terms",
    },
  },
  openGraph: {
    title: "Terms of Service | STEDING.",
    description: "Read our terms of service for using this website.",
    locale: "en_US",
  },
};

export default function TermsOfServicePage() {
  return <TermsContent />;
}
