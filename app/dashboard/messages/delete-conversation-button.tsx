"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteWhatsAppConversation } from "@/app/dashboard/messages/actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DeleteConversationButtonProps = {
  phone: string;
  contactName: string;
};

export function DeleteConversationButton({
  phone,
  contactName,
}: DeleteConversationButtonProps) {
  const [pending, startTransition] = useTransition();

  function deleteConversation() {
    startTransition(async () => {
      try {
        await deleteWhatsAppConversation(phone);
        toast.success("Conversation supprimée");
      } catch {
        toast.error("Impossible de supprimer la conversation");
      }
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={pending}
          className="rounded-full text-white/45 hover:bg-red-400/10 hover:text-red-200"
        >
          <Trash2 aria-hidden="true" />
          <span className="hidden sm:inline">Supprimer</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer cette conversation ?</AlertDialogTitle>
          <AlertDialogDescription>
            Tous les messages échangés avec {contactName} seront définitivement
            supprimés du dashboard. Une nouvelle conversation apparaîtra si ce
            contact écrit à nouveau.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={deleteConversation}
          >
            Supprimer définitivement
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
