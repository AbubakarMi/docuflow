-- AlterTable
ALTER TABLE "users"
  ALTER COLUMN "businessId" DROP NOT NULL,
  ADD COLUMN "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Drop old unique constraint if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_businessId_email_key') THEN
        ALTER TABLE "users" DROP CONSTRAINT "users_businessId_email_key";
    END IF;
END $$;
