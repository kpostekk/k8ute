/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Challenger` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Challenger_name_key" ON "Challenger"("name");
