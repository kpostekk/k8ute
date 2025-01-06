/*
  Warnings:

  - You are about to drop the column `password` on the `Challenger` table. All the data in the column will be lost.
  - Added the required column `argon2` to the `Challenger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Challenger" DROP COLUMN "password",
ADD COLUMN     "argon2" TEXT NOT NULL;
