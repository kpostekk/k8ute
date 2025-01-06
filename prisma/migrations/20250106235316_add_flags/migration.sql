-- CreateTable
CREATE TABLE "ChallengeDynamicFlag" (
    "id" TEXT NOT NULL,
    "challengerId" TEXT NOT NULL,
    "flag" TEXT NOT NULL,

    CONSTRAINT "ChallengeDynamicFlag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChallengeDynamicFlag" ADD CONSTRAINT "ChallengeDynamicFlag_challengerId_fkey" FOREIGN KEY ("challengerId") REFERENCES "Challenger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
