"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { verifAdmin } from "@/lib/auth/verif-admin";
import { prisma } from "@/lib/data/prisma";
import { sendWhatsAppText } from "@/lib/whatsapp/cloud-api";
import { isWhatsAppReplyWindowOpen } from "@/lib/whatsapp/reply-window";

const replySchema = z.object({
  inboundMessageId: z.string().min(1),
  text: z.string().trim().min(1).max(4_096),
});

export type ReplyState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function replyToWhatsAppMessage(
  _previousState: ReplyState,
  formData: FormData,
): Promise<ReplyState> {
  await verifAdmin();

  const parsed = replySchema.safeParse({
    inboundMessageId: formData.get("inboundMessageId"),
    text: formData.get("text"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Écris un message de 1 à 4 096 caractères.",
    };
  }

  const inboundMessage = await prisma.whatsAppInboundMessage.findUnique({
    where: { id: parsed.data.inboundMessageId },
    select: { fromPhone: true, messageId: true },
  });

  if (!inboundMessage) {
    return { status: "error", message: "Ce message n’existe plus." };
  }

  const latestInbound = await prisma.whatsAppInboundMessage.findFirst({
    where: { fromPhone: inboundMessage.fromPhone },
    orderBy: { receivedAt: "desc" },
    select: { receivedAt: true },
  });

  if (
    !latestInbound ||
    !isWhatsAppReplyWindowOpen(latestInbound.receivedAt)
  ) {
    return {
      status: "error",
      message:
        "La fenêtre de réponse de 24 h est terminée. Il faut envoyer un modèle approuvé.",
    };
  }

  let result: Awaited<ReturnType<typeof sendWhatsAppText>>;
  try {
    result = await sendWhatsAppText({
      phone: inboundMessage.fromPhone,
      text: parsed.data.text,
      replyToMessageId: inboundMessage.messageId,
    });
  } catch (error) {
    console.error("Échec de la réponse WhatsApp", error);
    return {
      status: "error",
      message: "L’envoi WhatsApp a échoué. Réessaie dans quelques instants.",
    };
  }

  try {
    await prisma.whatsAppOutboundMessage.create({
      data: {
        messageId: result.id,
        toPhone: inboundMessage.fromPhone,
        text: parsed.data.text,
        replyToMessageId: inboundMessage.messageId,
        status: result.status,
      },
    });
  } catch (error) {
    console.error("Réponse WhatsApp envoyée mais non enregistrée", error);
    return {
      status: "success",
      message: "Message envoyé, mais l’historique n’a pas pu être mis à jour.",
    };
  }

  revalidatePath("/dashboard/messages");
  return { status: "success", message: "Message envoyé." };
}
