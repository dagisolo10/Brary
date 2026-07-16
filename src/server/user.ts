"use server";

import prisma from "@/lib/prisma";
import { updateUserSchema } from "@/lib/schemas/user";
import { createSupabaseServer } from "@/lib/supabase/server";
import { validateUser } from "./auth";

export async function getUser({ userId, name }: { userId: string; name: string }) {
    return prisma.user.upsert({
        where: { id: userId },
        update: { name },
        create: { id: userId, name },
    });
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
