"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  replyToWhatsAppMessage,
  type ReplyState,
} from "@/app/dashboard/messages/actions";

const initialReplyState: ReplyState = {
  status: "idle",
  message: "",
};

type ReplyFormProps = {
  inboundMessageId: string;
  canReply: boolean;
};

export function ReplyForm({ inboundMessageId, canReply }: ReplyFormProps) {
  const [state, formAction, pending] = useActionState(
    replyToWhatsAppMessage,
    initialReplyState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  if (!canReply) {
    return (
      <p className="mt-4 rounded-2xl bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
        La fenêtre de 24 h est terminée. Utilise un modèle approuvé pour
        reprendre la conversation.
      </p>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="mt-4">
      <input type="hidden" name="inboundMessageId" value={inboundMessageId} />
      <label htmlFor={`reply-${inboundMessageId}`} className="sr-only">
        Réponse WhatsApp
      </label>
      <textarea
        id={`reply-${inboundMessageId}`}
        name="text"
        required
        maxLength={4_096}
        rows={3}
        dir="auto"
        placeholder="Écrire une réponse…"
        className="w-full resize-y rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/45 focus:border-white/50 focus:ring-2 focus:ring-white/15"
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <p
          className={
            state.status === "error"
              ? "text-sm text-red-200"
              : "text-sm text-emerald-200"
          }
          aria-live="polite"
        >
          {state.message}
        </p>
        <Button type="submit" disabled={pending} className="min-w-28">
          <Send aria-hidden="true" />
          {pending ? "Envoi…" : "Envoyer"}
        </Button>
      </div>
    </form>
  );
}
