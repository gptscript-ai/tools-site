-- CreateTable
CREATE TABLE "ToolEntry" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastIndexedAt" TIMESTAMP(3) NOT NULL,
    "content" JSONB NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "ToolEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubToolEntry" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastIndexedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "content" JSONB NOT NULL,
    "url" TEXT NOT NULL,
    "toolId" INTEGER NOT NULL,

    CONSTRAINT "SubToolEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ToolEntry_url_key" ON "ToolEntry"("url");

-- CreateIndex
CREATE UNIQUE INDEX "SubToolEntry_url_key" ON "SubToolEntry"("url");

-- AddForeignKey
ALTER TABLE "SubToolEntry" ADD CONSTRAINT "SubToolEntry_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "ToolEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
