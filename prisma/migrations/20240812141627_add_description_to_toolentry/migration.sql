-- AlterTable
ALTER TABLE "ToolEntry" ADD COLUMN     "description" TEXT;

UPDATE "ToolEntry" SET description = content->0->>'description' WHERE content->0->>'description' IS NOT NULL;
