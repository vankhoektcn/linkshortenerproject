import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateLinkDialog } from "@/components/dashboard/create-link-dialog";
import { DeleteLinkDialog } from "@/components/dashboard/delete-link-dialog";
import { EditLinkDialog } from "@/components/dashboard/edit-link-dialog";
import { getLinksByUserId } from "@/db/queries/links";

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

async function LinksList() {
  const { userId } = await auth.protect();
  const userLinks = await getLinksByUserId(userId);

  if (userLinks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No links yet</CardTitle>
          <CardDescription>
            Links you create will appear here.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <ul className="grid gap-4">
      {userLinks.map((link) => (
        <li key={link.id}>
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">/{link.shortCode}</Badge>
              </CardTitle>
              <CardDescription className="break-all">
                {link.originalUrl}
              </CardDescription>
              <CardAction className="flex gap-2">
                <EditLinkDialog
                  link={{
                    id: link.id,
                    originalUrl: link.originalUrl,
                    shortCode: link.shortCode,
                  }}
                />
                <DeleteLinkDialog
                  link={{ id: link.id, shortCode: link.shortCode }}
                />
              </CardAction>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Created {dateFormatter.format(link.createdAt)}
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Your links</h1>
        <CreateLinkDialog />
      </div>
      <Suspense>
        <LinksList />
      </Suspense>
    </main>
  );
}
