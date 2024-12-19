-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TestCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "steps" TEXT NOT NULL DEFAULT '',
    "expected" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_EXECUTED',
    "isAutomated" BOOLEAN NOT NULL DEFAULT false,
    "automationDetails" TEXT,
    "folderPath" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TestPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TestExecution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "executionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "result" TEXT NOT NULL DEFAULT 'PENDING',
    "status" TEXT NOT NULL DEFAULT 'PENDING'
);

-- CreateTable
CREATE TABLE "UserProject" (
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "projectId")
);

-- CreateTable
CREATE TABLE "_UserProjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UserProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ProjectToTestCase" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ProjectToTestCase_A_fkey" FOREIGN KEY ("A") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProjectToTestCase_B_fkey" FOREIGN KEY ("B") REFERENCES "TestCase" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ProjectToTestPlan" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ProjectToTestPlan_A_fkey" FOREIGN KEY ("A") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProjectToTestPlan_B_fkey" FOREIGN KEY ("B") REFERENCES "TestPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TestCaseTestPlan" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TestCaseTestPlan_A_fkey" FOREIGN KEY ("A") REFERENCES "TestCase" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TestCaseTestPlan_B_fkey" FOREIGN KEY ("B") REFERENCES "TestPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TestExecutionTestCase" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TestExecutionTestCase_A_fkey" FOREIGN KEY ("A") REFERENCES "TestCase" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TestExecutionTestCase_B_fkey" FOREIGN KEY ("B") REFERENCES "TestExecution" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TestExecutionTestPlan" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TestExecutionTestPlan_A_fkey" FOREIGN KEY ("A") REFERENCES "TestExecution" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TestExecutionTestPlan_B_fkey" FOREIGN KEY ("B") REFERENCES "TestPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_UserProjects_AB_unique" ON "_UserProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_UserProjects_B_index" ON "_UserProjects"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToTestCase_AB_unique" ON "_ProjectToTestCase"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToTestCase_B_index" ON "_ProjectToTestCase"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToTestPlan_AB_unique" ON "_ProjectToTestPlan"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToTestPlan_B_index" ON "_ProjectToTestPlan"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TestCaseTestPlan_AB_unique" ON "_TestCaseTestPlan"("A", "B");

-- CreateIndex
CREATE INDEX "_TestCaseTestPlan_B_index" ON "_TestCaseTestPlan"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TestExecutionTestCase_AB_unique" ON "_TestExecutionTestCase"("A", "B");

-- CreateIndex
CREATE INDEX "_TestExecutionTestCase_B_index" ON "_TestExecutionTestCase"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TestExecutionTestPlan_AB_unique" ON "_TestExecutionTestPlan"("A", "B");

-- CreateIndex
CREATE INDEX "_TestExecutionTestPlan_B_index" ON "_TestExecutionTestPlan"("B");
