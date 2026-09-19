-- CreateTable
CREATE TABLE "WhatsAppInboundMessage" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "fromPhone" TEXT NOT NULL,
    "profileName" TEXT,
    "type" TEXT NOT NULL,
    "text" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatsAppInboundMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppInboundMessage_messageId_key" ON "WhatsAppInboundMessage"("messageId");

-- CreateIndex
CREATE INDEX "WhatsAppInboundMessage_receivedAt_idx" ON "WhatsAppInboundMessage"("receivedAt");

-- CreateIndex
CREATE INDEX "WhatsAppInboundMessage_fromPhone_receivedAt_idx" ON "WhatsAppInboundMessage"("fromPhone", "receivedAt");
