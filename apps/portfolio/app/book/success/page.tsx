import { Metadata } from "next";
import BookingSuccessClient from "./BookingSuccessClient";

export const metadata: Metadata = {
  title: "Booking Confirmed | Leroy Steding",
  description: "Your consultation has been successfully scheduled. Check your email for the meeting details.",
};

export default function BookingSuccessPage() {
  return <BookingSuccessClient language="en" />;
}
