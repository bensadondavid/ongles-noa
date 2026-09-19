-- CreateTable
CREATE TABLE "WhatsAppOutboundMessage" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "toPhone" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "replyToMessageId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'accepted',
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatsAppOutboundMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppOutboundMessage_messageId_key" ON "WhatsAppOutboundMessage"("messageId");

-- CreateIndex
CREATE INDEX "WhatsAppOutboundMessage_sentAt_idx" ON "WhatsAppOutboundMessage"("sentAt");

-- CreateIndex
CREATE INDEX "WhatsAppOutboundMessage_toPhone_sentAt_idx" ON "WhatsAppOutboundMessage"("toPhone", "sentAt");
