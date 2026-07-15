import { z } from "zod";

export const createBookSchema = z.object({
    name: z.string().min(1).max(200),
});

export const updateBookSchema = createBookSchema.partial()