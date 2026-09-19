import { MessageCircle } from "lucide-react";
import { prisma } from "@/lib/data/prisma";
import { verifAdmin } from "@/lib/auth/verif-admin";

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

export default async function WhatsAppMessagesPage() {
  await verifAdmin();

  const messages = await prisma.whatsAppInboundMessage.findMany({
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
  });

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
              Les 100 réponses les plus récentes
            </p>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="rounded-3xl border border-white/20 bg-border/40 p-8 text-center text-white/70">
            Aucune réponse WhatsApp reçue pour le moment.
          </div>
        ) : (
          <ol className="space-y-3">
            {messages.map((message) => (
              <li
                key={message.id}
                className="rounded-3xl border border-white/20 bg-border/40 p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">
                      {message.profileName ?? "Contact WhatsApp"}
                    </p>
                    <a
                      href={`tel:+${message.fromPhone}`}
                      className="text-sm text-white/65 underline-offset-4 hover:underline"
                      dir="ltr"
                    >
                      {formatPhoneNumber(message.fromPhone)}
                    </a>
                  </div>
                  <time
                    dateTime={message.receivedAt.toISOString()}
                    className="text-xs text-white/55"
                  >
                    {dateFormatter.format(message.receivedAt)}
                  </time>
                </div>

                <p
                  className="mt-4 whitespace-pre-wrap break-words rounded-2xl bg-white/10 px-4 py-3 leading-6"
                  dir="auto"
                >
                  {message.text ?? getMessageFallback(message.type)}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  );
}
