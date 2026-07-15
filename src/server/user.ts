"use server";

import prisma from "@/lib/prisma";
import { updateUserSchema } from "@/lib/schemas/user";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getSupabaseUser, validateUser } from "./auth";

export async function getUser() {
    const supabaseUser = await getSupabaseUser();

    const user = await prisma.user.upsert({
        where: { id: supabaseUser.id },
        update: {
            name: supabaseUser.user_metadata.name ?? "User",
        },
        create: {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata.name ?? "User",
        },
    });

    return user;
}

export async function updateUser(name: string) {
    const parsed = updateUserSchema.safeParse({ name });

    if (!parsed.success) {
        throw new Error("Invalid input");
    }

    const user = await validateUser();

    return prisma.user.update({
        where: { id: user.id },
        data: { name },
    });
}

export async function deleteUser() {
    const supabase = await createSupabaseServer();

    const user = await validateUser();

    await supabase.auth.admin.deleteUser(user.id);

    return await prisma.user.delete({ where: { id: user.id } });
}
