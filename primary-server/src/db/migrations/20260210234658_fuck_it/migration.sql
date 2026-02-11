-- CreateEnum
CREATE TYPE "Role" AS ENUM ('student', 'professor');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "StudentDocType" AS ENUM ('id_card', 'fee_receipt');

-- CreateEnum
CREATE TYPE "ProfessorDocType" AS ENUM ('id_card', 'employment_letter');

-- CreateTable
CREATE TABLE "Students" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "refreshToken" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "verificationTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professors" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "refreshToken" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "verificationTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Professors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleMap" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoleMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL,
    "universityName" TEXT NOT NULL,
    "collegeName" TEXT NOT NULL,
    "majorName" TEXT NOT NULL,
    "currentSem" INTEGER NOT NULL,
    "startYear" INTEGER NOT NULL,
    "gradYear" INTEGER NOT NULL,
    "studentID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessorProfile" (
    "id" TEXT NOT NULL,
    "universityName" TEXT NOT NULL,
    "collegeName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "employmentType" TEXT NOT NULL,
    "joiningYear" INTEGER NOT NULL,
    "professorID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentDocument" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "docType" "StudentDocType" NOT NULL,
    "url" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'pending',
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
    "status" "DocumentStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessorDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Students_email_key" ON "Students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Students_mobileNumber_key" ON "Students"("mobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Students_walletAddress_key" ON "Students"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Students_verificationToken_key" ON "Students"("verificationToken");

-- CreateIndex
CREATE INDEX "Students_email_idx" ON "Students"("email");

-- CreateIndex
CREATE INDEX "Students_mobileNumber_idx" ON "Students"("mobileNumber");

-- CreateIndex
CREATE INDEX "Students_walletAddress_idx" ON "Students"("walletAddress");

-- CreateIndex
CREATE INDEX "Students_verificationToken_idx" ON "Students"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "Professors_email_key" ON "Professors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Professors_mobileNumber_key" ON "Professors"("mobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Professors_walletAddress_key" ON "Professors"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Professors_verificationToken_key" ON "Professors"("verificationToken");

-- CreateIndex
CREATE INDEX "Professors_email_idx" ON "Professors"("email");

-- CreateIndex
CREATE INDEX "Professors_mobileNumber_idx" ON "Professors"("mobileNumber");

-- CreateIndex
CREATE INDEX "Professors_walletAddress_idx" ON "Professors"("walletAddress");

-- CreateIndex
CREATE INDEX "Professors_verificationToken_idx" ON "Professors"("verificationToken");

-- CreateIndex
CREATE INDEX "RoleMap_userId_idx" ON "RoleMap"("userId");

-- CreateIndex
CREATE INDEX "RoleMap_role_idx" ON "RoleMap"("role");

-- CreateIndex
CREATE UNIQUE INDEX "RoleMap_userId_role_key" ON "RoleMap"("userId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_studentID_key" ON "StudentProfile"("studentID");

-- CreateIndex
CREATE INDEX "StudentProfile_studentID_idx" ON "StudentProfile"("studentID");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessorProfile_professorID_key" ON "ProfessorProfile"("professorID");

-- CreateIndex
CREATE INDEX "ProfessorProfile_professorID_idx" ON "ProfessorProfile"("professorID");

-- CreateIndex
CREATE INDEX "StudentDocument_studentId_idx" ON "StudentDocument"("studentId");

-- CreateIndex
CREATE INDEX "StudentDocument_status_idx" ON "StudentDocument"("status");

-- CreateIndex
CREATE INDEX "StudentDocument_docType_idx" ON "StudentDocument"("docType");

-- CreateIndex
CREATE INDEX "ProfessorDocument_professorId_idx" ON "ProfessorDocument"("professorId");

-- CreateIndex
CREATE INDEX "ProfessorDocument_status_idx" ON "ProfessorDocument"("status");

-- CreateIndex
CREATE INDEX "ProfessorDocument_docType_idx" ON "ProfessorDocument"("docType");

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "Students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorProfile" ADD CONSTRAINT "ProfessorProfile_professorID_fkey" FOREIGN KEY ("professorID") REFERENCES "Professors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDocument" ADD CONSTRAINT "StudentDocument_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorDocument" ADD CONSTRAINT "ProfessorDocument_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
