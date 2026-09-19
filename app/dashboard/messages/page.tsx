import { ChevronDown, Clock3, MessageCircle, Phone } from "lucide-react";
import { DeleteConversationButton } from "@/app/dashboard/messages/delete-conversation-button";
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

function getInitials(name: string | null) {
  if (!name) return "WA";

  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
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
    <main className="min-h-full overflow-y-auto px-4 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/15 p-3 text-emerald-100 shadow-lg shadow-emerald-950/10">
              <MessageCircle className="size-6" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Messages WhatsApp
              </h1>
              <p className="mt-1 text-sm text-white/60">
                Consulte et réponds aux messages de tes clientes
              </p>
            </div>
          </div>
          <p className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60">
            {sortedConversations.length} conversation
            {sortedConversations.length > 1 ? "s" : ""}
          </p>
        </div>

        {sortedConversations.length === 0 ? (
          <div className="rounded-3xl border border-white/20 bg-border/40 p-8 text-center text-white/70">
            Aucune réponse WhatsApp reçue pour le moment.
          </div>
        ) : (
          <ol className="space-y-4">
            {sortedConversations.map((conversation, index) => {
              const canReply = isWhatsAppReplyWindowOpen(
                conversation.latestInboundAt,
              );
              const latestMessage =
                conversation.messages[conversation.messages.length - 1];

              return (
                <li key={conversation.phone}>
                  <details
                    open={index === 0}
                    className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/10 transition-colors open:border-white/20 open:bg-white/[0.075]"
                  >
                    <summary className="flex cursor-pointer list-none items-center gap-3 p-4 outline-none transition-colors hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-300/60 sm:gap-4 sm:p-5 [&::-webkit-details-marker]:hidden">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300/30 to-emerald-600/20 text-sm font-bold text-emerald-50 ring-1 ring-inset ring-emerald-200/20 sm:size-12">
                        {getInitials(conversation.profileName)}
                      </div>

                      <div className="min-w-0 flex-1 font-sans">
                        <div className="flex min-w-0 items-baseline gap-2">
                          <p className="truncate font-semibold text-white">
                            {conversation.profileName ?? "Contact WhatsApp"}
                          </p>
                          <span className="shrink-0 text-xs text-white/40" dir="ltr">
                            {formatPhoneNumber(conversation.phone)}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-sm text-white/60" dir="auto">
                          {latestMessage.direction === "outbound" ? "Vous : " : ""}
                          {latestMessage.text}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        <div className="hidden text-right sm:block">
                          <time
                            dateTime={conversation.lastActivityAt.toISOString()}
                            className="block text-xs text-white/45"
                          >
                            {dateFormatter.format(conversation.lastActivityAt)}
                          </time>
                          <span
                            className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.65rem] font-medium ${
                              canReply
                                ? "bg-emerald-400/15 text-emerald-100"
                                : "bg-amber-400/15 text-amber-100"
                            }`}
                          >
                            <Clock3 className="size-3" aria-hidden="true" />
                            {canReply ? "Réponse possible" : "Fenêtre expirée"}
                          </span>
                        </div>
                        <ChevronDown
                          className="size-5 text-white/45 transition-transform duration-200 group-open:rotate-180"
                          aria-hidden="true"
                        />
                      </div>
                    </summary>

                    <div className="border-t border-white/10 bg-black/10 font-sans">
                      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs text-white/50 sm:px-6">
                        <span>
                          {conversation.messages.length} message
                          {conversation.messages.length > 1 ? "s" : ""}
                        </span>
                        <div className="flex items-center gap-1">
                          <a
                            href={`tel:+${conversation.phone}`}
                            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-white/65 transition-colors hover:bg-white/10 hover:text-white"
                            dir="ltr"
                          >
                            <Phone className="size-3.5" aria-hidden="true" />
                            {formatPhoneNumber(conversation.phone)}
                          </a>
                          <DeleteConversationButton
                            phone={conversation.phone}
                            contactName={
                              conversation.profileName ?? "ce contact"
                            }
                          />
                        </div>
                      </div>

                      <ol className="max-h-[32rem] space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
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
                              className={`max-w-[88%] sm:max-w-[75%] ${
                                message.direction === "outbound"
                                  ? "text-right"
                                  : "text-left"
                              }`}
                            >
                              <span className="mb-1 block px-1 text-[0.65rem] font-medium uppercase tracking-wide text-white/35">
                                {message.direction === "outbound"
                                  ? "Vous"
                                  : conversation.profileName ?? "Cliente"}
                              </span>
                              <div
                                className={`rounded-2xl px-4 py-3 shadow-sm ${
                                  message.direction === "outbound"
                                    ? "rounded-br-md bg-emerald-500/25 ring-1 ring-inset ring-emerald-300/10"
                                    : "rounded-bl-md bg-white/10 ring-1 ring-inset ring-white/5"
                                }`}
                              >
                                <p
                                  className="whitespace-pre-wrap break-words text-sm leading-6 text-white/90"
                                  dir="auto"
                                >
                                  {message.text}
                                </p>
                                <time
                                  dateTime={message.occurredAt.toISOString()}
                                  className="mt-1.5 block text-[0.65rem] text-white/40"
                                >
                                  {dateFormatter.format(message.occurredAt)}
                                </time>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ol>

                      <div className="border-t border-white/10 px-4 pb-5 sm:px-6">
                        <ReplyForm
                          inboundMessageId={conversation.latestInboundId}
                          canReply={canReply}
                        />
                      </div>
                    </div>
                  </details>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </main>
  );
}
