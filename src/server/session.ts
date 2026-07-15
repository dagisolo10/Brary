"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { validateUser } from "./auth";

export async function getActiveSession() {
    const user = await validateUser();

    return prisma.session.findFirst({
        where: {
            endsAt: null,
            book: { userId: user.id },
        },
        include: { book: true },
    });
}

export async function getSessionsWithBooks() {
    const user = await validateUser();

    return await prisma.session.findMany({
        where: { book: { userId: user.id } },
        include: { book: true },
        orderBy: { startedAt: "desc" },
    });
}

export async function createSession(bookId: string) {
    const user = await validateUser();

    const book = await prisma.book.findFirst({
        where: {
            id: bookId,
            userId: user.id,
        },
    });

    if (!book) {
        throw new Error("Book not found");
    }

    const activeSession = await prisma.session.findFirst({
        where: {
            endsAt: null,
            book: {
                userId: user.id,
            },
        },
    });

    if (activeSession) {
        if (activeSession.bookId === bookId) {
            throw new Error("You already have an active session for this book.");
        }

        throw new Error("You already have an active reading session. End it before starting another.");
    }

    revalidatePath("/");

    return await prisma.session.create({
        data: {
            bookId,
            startedAt: new Date(),
        },
    });
}

export async function endSession({ bookId, sessionId }: { bookId: string; sessionId: string }) {
    const user = await validateUser();

    const book = await prisma.book.findFirst({
        where: {
            id: bookId,
            userId: user.id,
        },
    });

    if (!book) {
        throw new Error("Book not found");
    }

    const session = await prisma.session.findFirst({
        where: {
            id: sessionId,
            bookId,
        },
    });

    if (!session) {
        throw new Error("Session not found");
    }

    if (session.endsAt) {
        throw new Error("Session is already over");
    }

    revalidatePath("/");

    return await prisma.session.update({
        where: {
            id: sessionId,
            bookId,
        },
        data: {
            endsAt: new Date(),
        },
    });
}
