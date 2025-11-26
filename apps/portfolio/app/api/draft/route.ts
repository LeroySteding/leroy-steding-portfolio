import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/lib/client";

const token = process.env.SANITY_API_TOKEN;

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token }),
});
