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
      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-300/15 bg-amber-400/10 px-4 py-3 text-sm text-amber-50/90">
        <div className="mt-1 size-2 shrink-0 rounded-full bg-amber-300" />
        <p>
          La fenêtre de 24 h est terminée. Utilise un modèle approuvé pour
          reprendre la conversation.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3"
    >
      <input type="hidden" name="inboundMessageId" value={inboundMessageId} />
      <label
        htmlFor={`reply-${inboundMessageId}`}
        className="mb-2 block px-1 text-xs font-medium text-white/55"
      >
        Répondre sur WhatsApp
      </label>
      <textarea
        id={`reply-${inboundMessageId}`}
        name="text"
        required
        maxLength={4_096}
        rows={3}
        dir="auto"
        placeholder="Écrire une réponse…"
        className="w-full resize-y rounded-xl border border-white/10 bg-black/15 px-4 py-3 text-sm leading-6 text-white outline-none transition-colors placeholder:text-white/35 focus:border-emerald-300/40 focus:ring-2 focus:ring-emerald-300/10"
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
        <Button
          type="submit"
          disabled={pending}
          className="min-w-28 rounded-xl bg-emerald-500 text-white hover:bg-emerald-400"
        >
          <Send aria-hidden="true" />
          {pending ? "Envoi…" : "Envoyer"}
        </Button>
      </div>
    </form>
  );
}
