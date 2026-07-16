import { getBooks } from "@/server/book";
import Header from "@/components/header";
import { createUser } from "@/server/user";
import { redirect } from "next/navigation";
import { PageClient } from "@/components/page-client";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getActiveSession, getSessionsWithBooks } from "@/server/session";

export default async function Home() {
    const supabase = await createSupabaseServer();

    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData?.session) {
        redirect("/sign-in");
    }

    const user = sessionData.session.user;

    const [books, activeSession, sessions] = await Promise.all([getBooks(), getActiveSession(), getSessionsWithBooks(), createUser({ userId: user.id, name: user.user_metadata?.name ?? "User" })]);

    return (
        <div className="flex flex-1 flex-col">
            <Header />

            <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 p-6">
                <PageClient books={books} sessions={sessions} activeSession={activeSession} />
            </div>
        </div>
    );
}
