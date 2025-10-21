-- CreateEnum
CREATE TYPE "StudentDocType" AS ENUM ('id_card', 'fee_receipt');

-- CreateEnum
CREATE TYPE "ProfessorDocType" AS ENUM ('id_card', 'employment_letter');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "StudentDocument" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "docType" "StudentDocType" NOT NULL,
    "url" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessorDocument" (
    "id" TEXT NOT NULL,
    "professorId" TEXT NOT NULL,
    "docType" "ProfessorDocType" NOT NULL,
    "url" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessorDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentDocument" ADD CONSTRAINT "StudentDocument_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorDocument" ADD CONSTRAINT "ProfessorDocument_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
