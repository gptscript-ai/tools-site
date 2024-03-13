-- CreateTable
CREATE TABLE "Example" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastIndexedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "content" JSONB NOT NULL,
    "url" TEXT NOT NULL,
    "toolEntryId" INTEGER,

    CONSTRAINT "Example_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Example_url_key" ON "Example"("url");

-- AddForeignKey
ALTER TABLE "Example" ADD CONSTRAINT "Example_toolEntryId_fkey" FOREIGN KEY ("toolEntryId") REFERENCES "ToolEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
