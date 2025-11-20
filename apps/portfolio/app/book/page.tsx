import { Metadata } from "next";
import BookingPageClient from "./BookingPageClient";

export const metadata: Metadata = {
  title: "Schedule a Call | Leroy Steding",
  description: "Book a free consultation to discuss your project, get technical advice, or explore collaboration opportunities with Leroy Steding.",
  openGraph: {
    title: "Schedule a Call with Leroy Steding",
    description: "Book a free consultation to discuss your project, get technical advice, or explore collaboration opportunities.",
    type: "website",
  },
};

export default function BookingPage() {
  return <BookingPageClient />;
}
