-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TestExecution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "executionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "result" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "status" TEXT NOT NULL DEFAULT 'NOT_EXECUTED'
);
INSERT INTO "new_TestExecution" ("executionDate", "id", "result", "status") SELECT "executionDate", "id", "result", "status" FROM "TestExecution";
DROP TABLE "TestExecution";
ALTER TABLE "new_TestExecution" RENAME TO "TestExecution";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
