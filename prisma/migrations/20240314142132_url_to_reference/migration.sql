/*
  Warnings:

  - A unique constraint covering the columns `[reference]` on the table `ToolEntry` will be added. If there are existing duplicate values, this will fail.
  - You are about to drop the `SubToolEntry` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `reference` to the `ToolEntry` table without a default value. This is not possible if the table is not empty.

*/

-- DropForeignKey
ALTER TABLE "SubToolEntry" DROP CONSTRAINT "SubToolEntry_toolId_fkey";

-- RenameColumn
ALTER TABLE "ToolEntry" RENAME COLUMN "url" TO "reference";

-- DropIndex
DROP INDEX "ToolEntry_url_key";

-- AlterTable
ALTER TABLE "ToolEntry" ADD COLUMN "systemTool" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "ToolEntry_reference_key" ON "ToolEntry"("reference");
