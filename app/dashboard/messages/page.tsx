import { MessageCircle } from "lucide-react";
import { ReplyForm } from "@/app/dashboard/messages/reply-form";
import { verifAdmin } from "@/lib/auth/verif-admin";
import { prisma } from "@/lib/data/prisma";
import { isWhatsAppReplyWindowOpen } from "@/lib/whatsapp/reply-window";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jerusalem",
});

function formatPhoneNumber(phone: string) {
  return phone.startsWith("+") ? phone : `+${phone}`;
}

function getMessageFallback(type: string) {
  const labels: Record<string, string> = {
    audio: "Message vocal reçu",
    document: "Document reçu",
    image: "Image reçue",
    location: "Localisation reçue",
    reaction: "Réaction reçue",
    sticker: "Sticker reçu",
    video: "Vidéo reçue",
  };

  return labels[type] ?? `Message ${type} reçu`;
}

type ConversationMessage = {
  id: string;
  direction: "inbound" | "outbound";
  text: string;
  occurredAt: Date;
};

type Conversation = {
  phone: string;
  profileName: string | null;
  latestInboundId: string;
  latestInboundAt: Date;
  lastActivityAt: Date;
  messages: ConversationMessage[];
};

export default async function WhatsAppMessagesPage() {
  await verifAdmin();

  const [inboundMessages, outboundMessages] = await Promise.all([
    prisma.whatsAppInboundMessage.findMany({
      orderBy: { receivedAt: "desc" },
      take: 100,
      select: {
        id: true,
        fromPhone: true,
        profileName: true,
        type: true,
        text: true,
        receivedAt: true,
      },
    }),
    prisma.whatsAppOutboundMessage.findMany({
      orderBy: { sentAt: "desc" },
      take: 100,
      select: {
        id: true,
        toPhone: true,
        text: true,
        sentAt: true,
      },
    }),
  ]);

  const conversations = new Map<string, Conversation>();

  for (const message of inboundMessages) {
    const existing = conversations.get(message.fromPhone);
    const conversation = existing ?? {
      phone: message.fromPhone,
      profileName: message.profileName,
      latestInboundId: message.id,
      latestInboundAt: message.receivedAt,
      lastActivityAt: message.receivedAt,
      messages: [],
    };

    conversation.messages.push({
      id: message.id,
      direction: "inbound",
      text: message.text ?? getMessageFallback(message.type),
      occurredAt: message.receivedAt,
    });
    conversations.set(message.fromPhone, conversation);
  }

  for (const message of outboundMessages) {
    const conversation = conversations.get(message.toPhone);
    if (!conversation) continue;

    conversation.messages.push({
      id: message.id,
      direction: "outbound",
      text: message.text,
      occurredAt: message.sentAt,
    });
    if (message.sentAt > conversation.lastActivityAt) {
      conversation.lastActivityAt = message.sentAt;
    }
  }

  const sortedConversations = [...conversations.values()]
    .map((conversation) => ({
      ...conversation,
      messages: conversation.messages.sort(
        (a, b) => a.occurredAt.getTime() - b.occurredAt.getTime(),
      ),
    }))
    .sort(
      (a, b) => b.lastActivityAt.getTime() - a.lastActivityAt.getTime(),
    );
  return (
    <main className="min-h-full overflow-y-auto px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-full bg-white/15 p-3">
            <MessageCircle className="size-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Messages WhatsApp</h1>
            <p className="mt-1 text-sm text-white/65">
              Conversations et réponses depuis le dashboard
            </p>
          </div>
        </div>

        {sortedConversations.length === 0 ? (
          <div className="rounded-3xl border border-white/20 bg-border/40 p-8 text-center text-white/70">
            Aucune réponse WhatsApp reçue pour le moment.
          </div>
        ) : (
          <ol className="space-y-6">
            {sortedConversations.map((conversation) => (
              <li
                key={conversation.phone}
                className="rounded-3xl border border-white/20 bg-border/40 p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <p className="font-bold">
                      {conversation.profileName ?? "Contact WhatsApp"}
                    </p>
                    <a
                      href={`tel:+${conversation.phone}`}
                      className="text-sm text-white/65 underline-offset-4 hover:underline"
                      dir="ltr"
                    >
                      {formatPhoneNumber(conversation.phone)}
                    </a>
                  </div>
                  <time
                    dateTime={conversation.lastActivityAt.toISOString()}
                    className="text-xs text-white/55"
                  >
                    {dateFormatter.format(conversation.lastActivityAt)}
                  </time>
                </div>

                <ol className="mt-4 max-h-96 space-y-3 overflow-y-auto pr-1">
                  {conversation.messages.map((message) => (
                    <li
                      key={`${message.direction}-${message.id}`}
                      className={`flex ${
                        message.direction === "outbound"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          message.direction === "outbound"
                            ? "bg-emerald-500/25"
                            : "bg-white/10"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words" dir="auto">
                          {message.text}
                        </p>
                        <time
                          dateTime={message.occurredAt.toISOString()}
                          className="mt-1 block text-right text-[0.7rem] text-white/50"
                        >
                          {dateFormatter.format(message.occurredAt)}
                        </time>
                      </div>
                    </li>
                  ))}
                </ol>

                <ReplyForm
                  inboundMessageId={conversation.latestInboundId}
                  canReply={isWhatsAppReplyWindowOpen(
                    conversation.latestInboundAt,
                  )}
                />
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  );
}
