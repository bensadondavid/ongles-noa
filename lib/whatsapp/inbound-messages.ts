import { prisma } from "@/lib/data/prisma";
import { sendNewWhatsAppMessagePush } from "@/lib/push/admin-push";

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

  for (const message of messages) {
    const result = await prisma.whatsAppInboundMessage.createMany({
      data: [message],
      skipDuplicates: true,
    });
    if (result.count === 0) continue;

    try {
      await sendNewWhatsAppMessagePush(message);
    } catch (error) {
      // Le webhook reste acquitté après l'enregistrement du message.
      console.error("Impossible de notifier le message WhatsApp entrant :", error);
    }
  }
}
