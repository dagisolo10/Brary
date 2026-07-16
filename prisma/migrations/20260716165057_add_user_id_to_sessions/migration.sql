-- Step 1: Add the column allowing NULL temporarily so existing rows don't break
ALTER TABLE "Session" ADD COLUMN "userId" TEXT;

-- Step 2: Populate the userId using your subquery
UPDATE "Session"
SET "userId" = (
  SELECT "Book"."userId" 
  FROM "Book" 
  WHERE "Book"."id" = "Session"."bookId"
);

-- Step 3: Now that every row has a userId, enforce NOT NULL
ALTER TABLE "Session" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
