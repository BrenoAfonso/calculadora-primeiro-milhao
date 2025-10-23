-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "calculations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "calculation_name" TEXT,
    "calculation_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "initial_contribution" REAL NOT NULL,
    "monthly_contribution" REAL NOT NULL,
    "monthly_rate" REAL NOT NULL,
    "months_to_reach_goal" INTEGER NOT NULL,
    "final_amount" REAL NOT NULL,
    "total_contributed" REAL NOT NULL,
    "total_interest" REAL NOT NULL,
    CONSTRAINT "calculations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
