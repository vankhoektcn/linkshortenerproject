import { auth } from "@clerk/nextjs/server";
import { SignUpButton } from "@clerk/nextjs";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Link2,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Link2,
    title: "Liên kết ngắn gọn",
    description:
      "Biến những đường dẫn dài thành liên kết ngắn, rõ ràng và dễ ghi nhớ.",
  },
  {
    icon: Zap,
    title: "Chia sẻ thật nhanh",
    description:
      "Dễ dàng gửi liên kết qua tin nhắn, email, mạng xã hội hay bất cứ đâu.",
  },
  {
    icon: ShieldCheck,
    title: "Quản lý tập trung",
    description:
      "Giữ các liên kết đã tạo ngăn nắp và tìm lại nhanh chóng khi cần.",
  },
];

async function RedirectIfSignedIn() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return null;
}

export default function Home() {
  return (
    <>
      <Suspense>
        <RedirectIfSignedIn />
      </Suspense>
      <main className="flex-1">
        <section className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-2 md:gap-16 md:py-28">
          <div className="flex flex-col items-start">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground">
              <Sparkles className="size-4 text-foreground" aria-hidden="true" />
              Chia sẻ liên kết theo cách gọn hơn
            </div>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl md:leading-[1.08]">
              Đường link dài?
              <span className="block text-muted-foreground">
                Chia sẻ thật gọn.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
              Rút gọn liên kết chỉ trong vài bước, giúp mọi đường dẫn trở nên
              dễ chia sẻ và dễ quản lý hơn.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <SignUpButton mode="modal">
                <Button size="lg" className="h-12 gap-2 rounded-full px-6">
                  Bắt đầu miễn phí
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </SignUpButton>
              <Link
                href="#features"
                className="inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Khám phá tính năng
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="size-4 text-foreground" aria-hidden="true" />
              Bắt đầu nhanh chóng, không rườm rà
            </div>
          </div>

          <div
            className="relative mx-auto w-full max-w-lg"
            aria-label="Minh họa liên kết dài được rút gọn"
          >
            <div className="absolute -inset-5 -z-10 rounded-[2rem] bg-muted/70 blur-2xl" />
            <div className="rounded-3xl border border-border bg-card p-5 shadow-xl shadow-foreground/5 sm:p-8">
              <div className="flex items-center justify-between border-b border-border pb-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Link2 className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-medium text-card-foreground">
                      Liên kết của bạn
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Sẵn sàng để chia sẻ
                    </p>
                  </div>
                </div>
                <span className="size-2.5 rounded-full bg-primary" />
              </div>

              <div className="space-y-3 py-6">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Đường dẫn ban đầu
                </p>
                <div className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                  example.com/blog/huong-dan-bat-dau
                </div>
                <div className="flex justify-center py-1">
                  <ArrowRight
                    className="size-4 rotate-90 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Liên kết rút gọn
                </p>
                <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3">
                  <span className="truncate text-sm font-medium text-foreground">
                    linkshort.app/a8k2
                  </span>
                  <Check
                    className="size-4 shrink-0 text-foreground"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                <Sparkles className="size-4 shrink-0 text-foreground" aria-hidden="true" />
                Ngắn gọn hơn. Dễ chia sẻ hơn.
              </div>
            </div>
            <div className="absolute -bottom-5 -left-3 hidden items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium shadow-lg sm:flex">
              <Check className="size-4" aria-hidden="true" />
              Sẵn sàng chia sẻ
            </div>
          </div>
        </section>

        <section
          id="features"
          className="border-t border-border bg-muted/30 px-5 py-16 sm:px-8 sm:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Mọi thứ cần thiết
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Chia sẻ liên kết, đơn giản hơn
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Tập trung vào điều bạn muốn chia sẻ, không phải một URL dài
                ngoằng.
              </p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-border bg-card p-6 sm:p-7"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-muted text-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-card-foreground">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </article>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <SignUpButton mode="modal">
                <Button size="lg" className="h-12 gap-2 rounded-full px-6">
                  Tạo liên kết đầu tiên
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </SignUpButton>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
