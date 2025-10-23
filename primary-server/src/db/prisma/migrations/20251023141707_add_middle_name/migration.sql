/*
  Warnings:

  - Added the required column `middleName` to the `Students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Students" ADD COLUMN     "middleName" TEXT NOT NULL;
