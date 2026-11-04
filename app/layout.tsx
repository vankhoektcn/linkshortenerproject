import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import { Link2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Button } from "@/components/ui/button";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkShort — Rút gọn và chia sẻ liên kết",
  description:
    "Biến đường dẫn dài thành liên kết ngắn gọn, dễ chia sẻ và dễ quản lý hơn.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider appearance={{ theme: shadcn }}>
          <header className="flex h-16 items-center justify-between border-b border-border/70 px-5 sm:px-8">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-sm font-semibold tracking-tight"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Link2 className="size-4" aria-hidden="true" />
              </span>
              LinkShort
            </Link>
            <Suspense>
              <div className="flex items-center gap-2">
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="rounded-full px-4">
                      Đăng nhập
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="rounded-full px-4">
                      Bắt đầu miễn phí
                    </Button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <UserButton />
                </Show>
              </div>
            </Suspense>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
