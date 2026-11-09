"use server";

import { auth } from "@clerk/nextjs/server";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createLink, deleteLink, updateLink } from "@/data/links";

type CreateLinkInput = {
  originalUrl: string;
  shortCode?: string;
};

type CreateLinkResult =
  | { success: { shortCode: string } }
  | { error: string };

type UpdateLinkInput = {
  linkId: string;
  originalUrl: string;
  shortCode: string;
};

type UpdateLinkResult = CreateLinkResult;

type DeleteLinkInput = {
  linkId: string;
};

type DeleteLinkResult = { success: true } | { error: string };

const originalUrlSchema = z
  .string()
  .trim()
  .max(2048, "URL is too long")
  .pipe(z.url({ protocol: /^https?$/, error: "Enter a valid http(s) URL" }));

const shortCodeSchema = z
  .string()
  .trim()
  .regex(
    /^[A-Za-z0-9_-]{3,32}$/,
    "Use 3-32 letters, numbers, hyphens or underscores",
  );

const createLinkSchema = z.object({
  originalUrl: originalUrlSchema,
  shortCode: shortCodeSchema.optional(),
});

const updateLinkSchema = z.object({
  linkId: z.uuid({ error: "Invalid link" }),
  originalUrl: originalUrlSchema,
  shortCode: shortCodeSchema,
});

const deleteLinkSchema = z.object({
  linkId: z.uuid({ error: "Invalid link" }),
});

const ALPHABET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const GENERATED_CODE_LENGTH = 7;
const MAX_GENERATION_ATTEMPTS = 5;

function generateShortCode() {
  const bytes = randomBytes(GENERATED_CODE_LENGTH);
  return Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join("");
}

export async function createLinkAction(
  input: CreateLinkInput,
): Promise<CreateLinkResult> {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "You must be signed in to create a link" };

    const parsed = createLinkSchema.safeParse({
      originalUrl: input?.originalUrl,
      shortCode: input?.shortCode || undefined,
    });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const { originalUrl, shortCode } = parsed.data;

    if (shortCode) {
      const link = await createLink(userId, originalUrl, shortCode);
      if (!link) return { error: "That short code is already taken" };
      revalidatePath("/dashboard");
      return { success: { shortCode: link.shortCode } };
    }

    for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
      const link = await createLink(userId, originalUrl, generateShortCode());
      if (link) {
        revalidatePath("/dashboard");
        return { success: { shortCode: link.shortCode } };
      }
    }

    return { error: "Could not generate a short code. Please try again" };
  } catch {
    return { error: "Something went wrong. Please try again" };
  }
}

export async function updateLinkAction(
  input: UpdateLinkInput,
): Promise<UpdateLinkResult> {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "You must be signed in to edit a link" };

    const parsed = updateLinkSchema.safeParse(input);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const { linkId, originalUrl, shortCode } = parsed.data;
    const result = await updateLink(userId, linkId, originalUrl, shortCode);

    if (result.status === "not-found") return { error: "Link not found" };
    if (result.status === "short-code-taken") {
      return { error: "That short code is already taken" };
    }

    revalidatePath("/dashboard");
    return { success: { shortCode: result.shortCode } };
  } catch {
    return { error: "Something went wrong. Please try again" };
  }
}

export async function deleteLinkAction(
  input: DeleteLinkInput,
): Promise<DeleteLinkResult> {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "You must be signed in to delete a link" };

    const parsed = deleteLinkSchema.safeParse(input);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const deleted = await deleteLink(userId, parsed.data.linkId);
    if (!deleted) return { error: "Link not found" };

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { error: "Something went wrong. Please try again" };
  }
}
