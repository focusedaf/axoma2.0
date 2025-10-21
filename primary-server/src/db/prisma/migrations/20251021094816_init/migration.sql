-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('full_time', 'visiting', 'contract');

-- CreateTable
CREATE TABLE "Students" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "refreshToken" TEXT,
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
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Professors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL,
    "universityName" TEXT NOT NULL,
    "collegeName" TEXT NOT NULL,
    "majorName" TEXT NOT NULL,
    "currentSem" TEXT NOT NULL,
    "startYear" TEXT NOT NULL,
    "gradYear" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentID" TEXT NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessorProfile" (
    "id" TEXT NOT NULL,
    "universityName" TEXT NOT NULL,
    "collegeName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "employmentType" "EmploymentType" NOT NULL DEFAULT 'full_time',
    "joiningYear" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "professorID" TEXT NOT NULL,

    CONSTRAINT "ProfessorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Students_email_key" ON "Students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Students_mobileNumber_key" ON "Students"("mobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Students_walletAddress_key" ON "Students"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Students_refreshToken_key" ON "Students"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "Professors_email_key" ON "Professors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Professors_mobileNumber_key" ON "Professors"("mobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Professors_walletAddress_key" ON "Professors"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Professors_refreshToken_key" ON "Professors"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_studentID_key" ON "StudentProfile"("studentID");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessorProfile_professorID_key" ON "ProfessorProfile"("professorID");

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorProfile" ADD CONSTRAINT "ProfessorProfile_professorID_fkey" FOREIGN KEY ("professorID") REFERENCES "Professors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
