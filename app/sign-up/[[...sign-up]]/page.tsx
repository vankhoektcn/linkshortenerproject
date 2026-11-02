import { AuthModal } from "@/components/auth-modal";

export default function SignUpPage() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <AuthModal mode="sign-up" />
    </main>
  );
}
