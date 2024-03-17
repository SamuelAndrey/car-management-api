/*
  Warnings:

  - You are about to alter the column `cost_per_day` on the `cars` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `cars` MODIFY `cost_per_day` INTEGER NOT NULL;
