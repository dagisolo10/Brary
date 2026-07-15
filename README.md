# Brary

A reading tracker built with Next.js (App Router), shadcn/ui, Prisma, and Supabase.

## Getting Started

1. Install dependencies:

```bash
bun install
```

2. Set up your `.env` file with Supabase and database credentials (see `.env.example`).

3. Run database migrations:

```bash
bun x prisma migrate dev
```

4. Start the dev server:

```bash
bun run dev
```

## Project Structure

```
src/
├── app/          # Next.js App Router pages and layout
├── components/   # React components (client and server)
│   └── ui/       # shadcn/ui components
├── lib/          # Shared utilities, Prisma client, schemas
├── server/       # Server actions
└── providers/    # React context providers
```
