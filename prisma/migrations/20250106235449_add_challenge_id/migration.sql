/*
  Warnings:

  - Added the required column `challengeId` to the `ChallengeDynamicFlag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChallengeDynamicFlag" ADD COLUMN     "challengeId" TEXT NOT NULL;
