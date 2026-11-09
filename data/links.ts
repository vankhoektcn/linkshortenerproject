import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { links } from "@/db/schema";

export async function createLink(
  userId: string,
  originalUrl: string,
  shortCode: string,
) {
  const [link] = await db
    .insert(links)
    .values({ userId, originalUrl, shortCode })
    .onConflictDoNothing({ target: links.shortCode })
    .returning();

  return link ?? null;
}

type UpdateLinkResult =
  | { status: "updated"; shortCode: string }
  | { status: "not-found" }
  | { status: "short-code-taken" };

function isUniqueViolation(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const { code, cause } = error as { code?: unknown; cause?: unknown };
  return code === "23505" || (cause !== undefined && isUniqueViolation(cause));
}

export async function updateLink(
  userId: string,
  linkId: string,
  originalUrl: string,
  shortCode: string,
): Promise<UpdateLinkResult> {
  try {
    const [link] = await db
      .update(links)
      .set({ originalUrl, shortCode, updatedAt: new Date() })
      .where(and(eq(links.id, linkId), eq(links.userId, userId)))
      .returning({ shortCode: links.shortCode });

    return link
      ? { status: "updated", shortCode: link.shortCode }
      : { status: "not-found" };
  } catch (error) {
    if (isUniqueViolation(error)) return { status: "short-code-taken" };
    throw error;
  }
}

export async function deleteLink(userId: string, linkId: string) {
  const deleted = await db
    .delete(links)
    .where(and(eq(links.id, linkId), eq(links.userId, userId)))
    .returning({ id: links.id });

  return deleted.length > 0;
}
