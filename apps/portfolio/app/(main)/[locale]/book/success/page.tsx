import type { Metadata } from "next";
import BookingSuccessClient from "./BookingSuccessClient";

export const metadata: Metadata = {
  title: "Booking Confirmed | Leroy Steding",
  description:
    "Your consultation has been successfully booked. Check your email for confirmation details.",
  robots: {
    index: false, // Don't index success pages
    follow: false,
  },
};

export default function BookingSuccessPage() {
  return <BookingSuccessClient />;
}
