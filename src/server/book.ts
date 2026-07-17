"use server";

import prisma from "@/lib/prisma";
import { createBookSchema, updateBookSchema } from "@/lib/schemas/book";
import { formatSessionDuration, getTotalTime } from "@/utils/formatters";
import { revalidatePath } from "next/cache";
import { validateUser } from "./auth";

export async function getBooks() {
    const user = await validateUser();
    return prisma.book.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
}

export async function getBook(id: string) {
    const user = await validateUser();

    const book = await prisma.book.findFirst({
        where: {
            id,
            userId: user.id,
        },
        include: {
            sessions: {
                select: {
                    id: true,
                    endsAt: true,
                    startedAt: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    if (!book) {
        throw new Error("Book not found");
    }

    const totalTimeMs = getTotalTime(book.sessions);
    const completedSessionsCount = book.sessions.filter((s) => s.endsAt !== null).length;

    const averageTimeMs = completedSessionsCount > 0 ? Math.round(totalTimeMs / completedSessionsCount) : 0;

    return {
        ...book,
        stats: {
            totalSessions: book.sessions.length,
            completedSessions: completedSessionsCount,
            formattedTotalTime: formatSessionDuration(totalTimeMs),
            formattedAverageTime: formatSessionDuration(averageTimeMs),
        },
    };
}

export async function createBook({ name }: { name: string }) {
    const parsed = createBookSchema.safeParse({ name });

    if (!parsed.success) {
        throw new Error("Invalid input");
    }

    const user = await validateUser();

    await prisma.book.create({ data: { name, userId: user.id } });

    revalidatePath("/books");
}

export async function updateBook(id: string, { name }: { name: string }) {
    const parsed = updateBookSchema.safeParse({ name });

    if (!parsed.success) {
        throw new Error("Invalid input");
    }

    const user = await validateUser();

    const book = await prisma.book.findFirst({ where: { id, userId: user.id } });

    if (!book) {
        throw new Error("Book not found");
    }

    await prisma.$transaction([
        prisma.book.update({
            where: { id, userId: user.id },
            data: { name },
        }),
        prisma.session.updateMany({
            where: { bookId: id },
            data: { bookName: name },
        }),
    ]);

    revalidatePath("/books");
    revalidatePath("/sessions");
}

export async function deleteBook(id: string) {
    const user = await validateUser();

    const book = await prisma.book.findFirst({ where: { id, userId: user.id } });

    if (!book) {
        throw new Error("Book not found");
    }

    await prisma.book.delete({ where: { id, userId: user.id } });

    revalidatePath("/books");
}
