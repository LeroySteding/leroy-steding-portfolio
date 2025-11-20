import { Metadata } from "next";
import BookingPageClient from "../../book/BookingPageClient";

export const metadata: Metadata = {
  title: "Plan een Gesprek | Leroy Steding",
  description: "Boek een gratis consult om jouw project te bespreken, technisch advies te krijgen, of samenwerkingsmogelijkheden te verkennen met Leroy Steding.",
  openGraph: {
    title: "Plan een Gesprek met Leroy Steding",
    description: "Boek een gratis consult om jouw project te bespreken, technisch advies te krijgen, of samenwerkingsmogelijkheden te verkennen.",
    type: "website",
    locale: "nl_NL",
  },
};

export default function DutchBookingPage() {
  return <BookingPageClient />;
}
