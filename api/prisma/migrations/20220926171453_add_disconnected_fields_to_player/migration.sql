/*
  Warnings:

  - A unique constraint covering the columns `[gameId,roundNumber,voterId,phase]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "isDisconnected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "socketId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Vote_gameId_roundNumber_voterId_phase_key" ON "Vote"("gameId", "roundNumber", "voterId", "phase");
