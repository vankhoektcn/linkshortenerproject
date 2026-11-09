"use client";

import { Pencil } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { updateLinkAction } from "./actions";

type EditLinkDialogProps = {
  link: { id: string; originalUrl: string; shortCode: string };
};

export function EditLinkDialog({ link }: EditLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) setError(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const originalUrl = String(data.get("originalUrl") ?? "");
    const shortCode = String(data.get("shortCode") ?? "");

    setError(null);
    startTransition(async () => {
      const result = await updateLinkAction({
        linkId: link.id,
        originalUrl,
        shortCode,
      });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setOpen(false);
    });
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        aria-label={`Edit /${link.shortCode}`}
        onClick={() => setOpen(true)}
      >
        <Pencil />
      </Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Edit link</DialogTitle>
              <DialogDescription>
                Update the destination URL or short code for /{link.shortCode}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <Label htmlFor={`edit-url-${link.id}`}>Destination URL</Label>
              <Input
                id={`edit-url-${link.id}`}
                name="originalUrl"
                type="url"
                defaultValue={link.originalUrl}
                required
                maxLength={2048}
                disabled={isPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`edit-code-${link.id}`}>Short code</Label>
              <Input
                id={`edit-code-${link.id}`}
                name="shortCode"
                defaultValue={link.shortCode}
                required
                minLength={3}
                maxLength={32}
                disabled={isPending}
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving…" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
