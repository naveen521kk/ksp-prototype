"use server";

import { PresidioOutput } from "./types";

export async function getPresidioOutput(
  text: string,
): Promise<PresidioOutput[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/presidio_mask`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    },
  );
  if (!response.ok) {
    throw "unknown error";
  }

  const res = await response.json();
  return res as any;
}
