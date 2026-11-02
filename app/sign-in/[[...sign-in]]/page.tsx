import { AuthModal } from "@/components/auth-modal";

export default function SignInPage() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <AuthModal mode="sign-in" />
    </main>
  );
}
