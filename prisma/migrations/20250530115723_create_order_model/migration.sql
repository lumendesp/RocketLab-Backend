-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_OrderBooks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_OrderBooks_A_fkey" FOREIGN KEY ("A") REFERENCES "Livro" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_OrderBooks_B_fkey" FOREIGN KEY ("B") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrderBooks_AB_unique" ON "_OrderBooks"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderBooks_B_index" ON "_OrderBooks"("B");
