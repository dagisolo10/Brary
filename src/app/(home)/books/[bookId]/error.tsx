"use client";

import { ArrowLeft, BookOpen, Library, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ErrorProps {
    error: Error;
    reset: () => void;
}

export default function BookDetailError({ error, reset }: ErrorProps) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        console.error("Caught system boundary exception:", error);
    }, [error]);

    if (!mounted) return null;

    const msg = error?.message?.toLowerCase() || "";

    const isNotFound = msg.includes("not found") || msg.includes("missing");

    const ui = isNotFound
        ? {
              title: "We couldn't find this book",
              description: "The book you are looking for might have been deleted, moved, or belongs to another user account.",
              primaryAction: (
                  <Link
                      href="/books"
                      className="bg-foreground text-background hover:bg-foreground/90 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold transition-all"
                  >
                      <Library className="size-4" /> Go to Library
                  </Link>
              ),
          }
        : {
              title: "Something went wrong on our end",
              description: "We hit a temporary snag loading your reading details. It should resolve in a moment.",
              primaryAction: (
                  <button
                      onClick={() => reset()}
                      className="bg-foreground text-background hover:bg-foreground/90 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold transition-all"
                  >
                      <RefreshCw className="size-4" /> Reload Page
                  </button>
              ),
              secondaryAction: (
                  <button
                      onClick={() => router.back()}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/30 py-3 text-xs font-semibold text-zinc-300 transition-all hover:bg-zinc-900"
                  >
                      <ArrowLeft className="size-4" /> Go Back
                  </button>
              ),
          };

    return (
        <main className="container mx-auto flex h-[80vh] max-w-md flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-6 flex size-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/50 text-zinc-400">
                <BookOpen className="size-6" />
                <div className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">!</div>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-zinc-100">{ui.title}</h1>
            <p className="text-muted-foreground mt-2 max-w-xs text-xs leading-relaxed">{ui.description}</p>

            <div className="mt-8 flex w-full flex-col gap-2.5">{ui.primaryAction}</div>
        </main>
    );
}
