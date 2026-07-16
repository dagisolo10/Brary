"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { validateUser } from "./auth";

export async function getActiveSession() {
    const user = await validateUser();

    return prisma.session.findFirst({
        where: {
            endsAt: null,
            userId: user.id,
        },
    });
}

export async function getSessions() {
    const user = await validateUser();

    return await prisma.session.findMany({
        where: {
            userId: user.id,
        },
        orderBy: { startedAt: "desc" },
    });
}

export async function startSession(bookId: string) {
    const user = await validateUser();

    const book = await prisma.book.findFirst({ where: { id: bookId, userId: user.id } });

    if (!book) {
        throw new Error("Book not found");
    }

    const activeSession = await prisma.session.findFirst({ where: { endsAt: null, book: { userId: user.id } } });

    if (activeSession) {
        if (activeSession.bookId === bookId) {
            throw new Error("You already have an active session for this book.");
        }

        throw new Error("You already have an active reading session. End it before starting another.");
    }

    revalidatePath("/sessions");

    return await prisma.session.create({
        data: {
            bookId,
            userId: user.id,
            bookName: book.name,
            startedAt: new Date(),
        },
    });
}

export async function endSession({ bookId, sessionId }: { bookId: string; sessionId: string }) {
    const user = await validateUser();

    const book = await prisma.book.findFirst({ where: { id: bookId, userId: user.id } });

    if (!book) {
        throw new Error("Book not found");
    }

    const session = await prisma.session.findFirst({ where: { id: sessionId, bookId } });

    if (!session) {
        throw new Error("Session not found");
    }

    if (session.endsAt) {
        throw new Error("Session is already over");
    }

    await prisma.session.update({ where: { id: sessionId, bookId }, data: { endsAt: new Date() } });

    revalidatePath("/sessions");
}
