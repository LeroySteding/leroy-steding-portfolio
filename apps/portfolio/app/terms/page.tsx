import TermsContent from "./TermsContent";

export const metadata = {
  title: "Terms of Service | STEDING.",
  description: "Read our terms of service for using this website. Understand your rights and responsibilities when using our services.",
  alternates: {
    canonical: "https://leroysteding.nl/terms",
    languages: {
      'en': 'https://leroysteding.nl/terms',
      'nl': 'https://leroysteding.nl/nl/terms',
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
