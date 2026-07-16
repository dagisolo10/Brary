-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT IF EXISTS "Session_bookId_fkey";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "bookName" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "bookId" DROP NOT NULL;

-- 3. Backfill the existing sessions with their actual book names from the Book table
UPDATE "Session"
SET "bookName" = "Book"."name"
FROM "Book"
WHERE "Session"."bookId" = "Book"."id";

-- 4. Clean up any remaining empty strings just in case (fallback)
UPDATE "Session"
SET "bookName" = 'Deleted Book'
WHERE "bookName" = '';

-- 5. Drop the temporary default constraint so future sessions are forced to explicitly write a bookName
ALTER TABLE "Session" ALTER COLUMN "bookName" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;
