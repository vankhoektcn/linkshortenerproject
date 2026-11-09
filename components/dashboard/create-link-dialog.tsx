"use client";

import { Plus } from "lucide-react";
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

import { createLinkAction } from "./actions";

export function CreateLinkDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) setError(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const originalUrl = String(data.get("originalUrl") ?? "");
    const shortCode = String(data.get("shortCode") ?? "");

    setError(null);
    startTransition(async () => {
      const result = await createLinkAction({ originalUrl, shortCode });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      form.reset();
      setOpen(false);
    });
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Create link
      </Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Create link</DialogTitle>
              <DialogDescription>
                Paste a URL to shorten. Leave the short code empty to generate
                one.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <Label htmlFor="originalUrl">Destination URL</Label>
              <Input
                id="originalUrl"
                name="originalUrl"
                type="url"
                placeholder="https://example.com/long-url"
                required
                maxLength={2048}
                disabled={isPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shortCode">Custom short code (optional)</Label>
              <Input
                id="shortCode"
                name="shortCode"
                placeholder="my-link"
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
                {isPending ? "Creating…" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
