/*
  Warnings:

  - You are about to drop the `_OrderBooks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_OrderBooks";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "OrderBook" (
    "orderId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    PRIMARY KEY ("orderId", "bookId"),
    CONSTRAINT "OrderBook_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Livro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
