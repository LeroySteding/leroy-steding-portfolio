import { Metadata } from "next";
import BookingSuccessClient from "@/app/book/success/BookingSuccessClient";

export const metadata: Metadata = {
  title: "Afspraak Bevestigd | Leroy Steding",
  description: "Uw consultatie is succesvol ingepland. Controleer uw email voor de meetingdetails.",
};

export default function BookingSuccessPageNL() {
  return <BookingSuccessClient language="nl" />;
}
