import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

async function DashboardContent() {
  await auth.protect();

  return <h1>Dashboard</h1>;
}

export default function DashboardPage() {
  return (
    <main className="flex-1 p-4">
      <Suspense>
        <DashboardContent />
      </Suspense>
    </main>
  );
}
