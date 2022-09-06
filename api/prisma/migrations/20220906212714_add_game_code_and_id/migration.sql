/*
  Warnings:

  - You are about to drop the column `hostId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[gameCode]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gameId]` on the table `Round` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gameCode` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avatar` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Made the column `nightTimePrompt` on table `Role` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_hostId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_userId_fkey";

-- DropIndex
DROP INDEX "Game_hostId_key";

-- DropIndex
DROP INDEX "Player_userId_key";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "hostId",
ADD COLUMN     "gameCode" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "userId",
ADD COLUMN     "avatar" TEXT NOT NULL,
ADD COLUMN     "isHost" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "nightTimePrompt" SET NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "voterId" INTEGER NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "phase" TEXT NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_gameCode_key" ON "Game"("gameCode");

-- CreateIndex
CREATE UNIQUE INDEX "Round_gameId_key" ON "Round"("gameId");
