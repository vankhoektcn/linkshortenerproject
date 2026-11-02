"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type AuthModalProps = {
  mode: "sign-in" | "sign-up";
};

export function AuthModal({ mode }: AuthModalProps) {
  const { loaded, openSignIn, openSignUp } = useClerk();
  const open = mode === "sign-in" ? openSignIn : openSignUp;

  useEffect(() => {
    if (loaded) open();
  }, [loaded, open]);

  return (
    <Button onClick={() => open()}>
      {mode === "sign-in" ? "Sign in" : "Sign up"}
    </Button>
  );
}
