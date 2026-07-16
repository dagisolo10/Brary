"use client";

import { createSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function Header() {
    const router = useRouter();
    const supabase = createSupabaseClient();

    async function SignOut() {
        await supabase.auth.signOut();
        router.refresh();
    }

    return (
        <header className="border-border/40 mx-auto flex w-full max-w-6xl items-center justify-between border-b px-6 py-4">
            <h1 className="font-heading text-xl font-semibold tracking-tight">Brary</h1>
            <Button size={"sm"} onClick={SignOut} variant={"outline"}>
                Sign Out
            </Button>
        </header>
    );
}
