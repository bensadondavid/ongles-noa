import { prisma } from "@/lib/data/prisma";

type InboundMessage = {
  messageId: string;
  fromPhone: string;
  profileName?: string;
  type: string;
  text?: string;
  receivedAt: Date;
};

export async function persistInboundMessages(messages: InboundMessage[]) {
  if (messages.length === 0) return;

  await prisma.whatsAppInboundMessage.createMany({
    data: messages,
    skipDuplicates: true,
  });
}
