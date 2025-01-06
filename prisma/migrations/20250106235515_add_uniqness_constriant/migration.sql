/*
  Warnings:

  - A unique constraint covering the columns `[challengeId,challengerId]` on the table `ChallengeDynamicFlag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChallengeDynamicFlag_challengeId_challengerId_key" ON "ChallengeDynamicFlag"("challengeId", "challengerId");
