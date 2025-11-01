-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calculations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "calculation_name" TEXT,
    "calculation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "initial_contribution" DOUBLE PRECISION NOT NULL,
    "monthly_contribution" DOUBLE PRECISION NOT NULL,
    "monthly_rate" DOUBLE PRECISION NOT NULL,
    "months_to_reach_goal" INTEGER NOT NULL,
    "final_amount" DOUBLE PRECISION NOT NULL,
    "total_contributed" DOUBLE PRECISION NOT NULL,
    "total_interest" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "calculations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "calculations_user_id_idx" ON "calculations"("user_id");

-- AddForeignKey
ALTER TABLE "calculations" ADD CONSTRAINT "calculations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
