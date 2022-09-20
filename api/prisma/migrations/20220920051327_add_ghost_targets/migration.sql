/*
  Warnings:

  - Made the column `isReady` on table `Player` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "isReady" SET NOT NULL;

-- AlterTable
ALTER TABLE "Round" ADD COLUMN     "ghostImages" INTEGER[];

-- CreateTable
CREATE TABLE "GhostTarget" (
    "id" SERIAL NOT NULL,
    "ghostId" INTEGER NOT NULL,
    "targetId" INTEGER NOT NULL,
    "roundId" INTEGER NOT NULL,

    CONSTRAINT "GhostTarget_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GhostTarget" ADD CONSTRAINT "GhostTarget_ghostId_fkey" FOREIGN KEY ("ghostId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GhostTarget" ADD CONSTRAINT "GhostTarget_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GhostTarget" ADD CONSTRAINT "GhostTarget_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
