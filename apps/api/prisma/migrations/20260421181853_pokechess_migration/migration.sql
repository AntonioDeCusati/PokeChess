-- CreateEnum
CREATE TYPE "CreatureType" AS ENUM ('fire', 'water', 'grass', 'electric', 'poison', 'dark', 'ghost', 'dragon', 'light');

-- CreateEnum
CREATE TYPE "CreatureRarity" AS ENUM ('common', 'rare', 'epic', 'legendary');

-- CreateEnum
CREATE TYPE "SpriteType" AS ENUM ('image', 'spritesheet');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "exp" INTEGER NOT NULL DEFAULT 0,
    "expToNext" INTEGER NOT NULL DEFAULT 1200,
    "gold" INTEGER NOT NULL DEFAULT 0,
    "gems" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Creature" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CreatureType" NOT NULL,
    "rarity" "CreatureRarity" NOT NULL,
    "spriteKey" TEXT NOT NULL,
    "spriteType" "SpriteType" NOT NULL DEFAULT 'spritesheet',
    "spriteFrame" INTEGER,
    "fallbackColor" TEXT,
    "fallbackLabel" TEXT,
    "defaultProgressMax" INTEGER NOT NULL DEFAULT 50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Creature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCreature" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "creatureId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "exp" INTEGER NOT NULL DEFAULT 0,
    "progressCurrent" INTEGER NOT NULL DEFAULT 0,
    "progressMax" INTEGER NOT NULL DEFAULT 50,
    "owned" BOOLEAN NOT NULL DEFAULT true,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCreature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamSlot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slotIndex" INTEGER NOT NULL,
    "creatureId" TEXT NOT NULL,
    "moveId" TEXT NOT NULL,

    CONSTRAINT "TeamSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "userId" TEXT NOT NULL,
    "supportId" TEXT,
    "trainerId" TEXT,
    "backgroundId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Creature_slug_key" ON "Creature"("slug");

-- CreateIndex
CREATE INDEX "Creature_type_idx" ON "Creature"("type");

-- CreateIndex
CREATE INDEX "Creature_rarity_idx" ON "Creature"("rarity");

-- CreateIndex
CREATE INDEX "UserCreature_userId_idx" ON "UserCreature"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCreature_userId_creatureId_key" ON "UserCreature"("userId", "creatureId");

-- CreateIndex
CREATE INDEX "TeamSlot_userId_idx" ON "TeamSlot"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamSlot_userId_slotIndex_key" ON "TeamSlot"("userId", "slotIndex");

-- AddForeignKey
ALTER TABLE "UserCreature" ADD CONSTRAINT "UserCreature_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCreature" ADD CONSTRAINT "UserCreature_creatureId_fkey" FOREIGN KEY ("creatureId") REFERENCES "Creature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamSlot" ADD CONSTRAINT "TeamSlot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamSlot" ADD CONSTRAINT "TeamSlot_creatureId_fkey" FOREIGN KEY ("creatureId") REFERENCES "Creature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
