-- AlterTable
ALTER TABLE "User" ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "last_name" DROP NOT NULL,
ALTER COLUMN "dob" DROP NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
