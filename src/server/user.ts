"use server";

import prisma from "@/lib/prisma";
import { updateUserSchema } from "@/lib/schemas/user";
import { createSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { validateUser } from "./auth";

export async function getUser({ userId, name }: { userId: string; name: string }) {
    return prisma.user.upsert({
        where: { id: userId },
        update: { name },
        create: { id: userId, name },
    });
}

export async function updateUser(name: string): Promise<{ success: true } | { error: string }> {
    const supabase = await createSupabaseServer();

    const parsed = updateUserSchema.safeParse({ name });

    if (!parsed.success) {
        return { error: "Invalid input" };
    }

    const user = await validateUser();

    const { error: authError } = await supabase.auth.updateUser({
        data: { name: name.trim() },
    });

    if (authError) {
        return { error: `Failed to update authentication metadata: ${authError.message}` };
    }

    await prisma.user.update({ where: { id: user.id }, data: { name: name.trim() } });

    revalidatePath("/profile");

    return { success: true };
}

export async function deleteUser() {
    const supabase = await createSupabaseServer();

    const user = await validateUser();

    await supabase.auth.admin.deleteUser(user.id);

    return await prisma.user.delete({ where: { id: user.id } });
}
