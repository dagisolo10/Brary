import prisma from "@/lib/prisma";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function getSupabaseUser() {
    const supabase = await createSupabaseServer();

    const {
        error,
        data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (error || !supabaseUser) {
        throw new Error("Unauthorized");
    }

    return supabaseUser;
}

export async function validateUser() {
    const supabaseUser = await getSupabaseUser();

    const user = await prisma.user.findUnique({ where: { id: supabaseUser.id } });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}
