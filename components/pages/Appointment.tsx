"use client";

import type { Appointment as AppointmentType } from "@/lib/data/prisma/client";
import { useTranslations } from "next-intl";
import { Separator } from "../ui/separator";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
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

type AppointmentItem = {
  name: string;
  price: number;
};

export default function Appointment({
  appointments,
}: {
  appointments: AppointmentType[];
}) {
  const t = useTranslations("appointments");
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/delete-rdv", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        return toast.error(t("delete"));
      }

      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 pb-12 bg-transparent">
      <h1 className="mt-10 mb-8 text-center font-third text-[48px] leading-none sm:text-[58px] text-white">
        {t("title")}
      </h1>

      {appointments.length > 0 ? (
        <div className="flex w-full flex-col gap-5">
          {appointments.map((a) => (
            <article
              key={a.id}
              className="w-full overflow-hidden rounded-3xl border border-[#cdbbb2]/50 bg-[#f1e7e2]/85 shadow-[0_18px_45px_rgba(90,65,55,0.12)] backdrop-blur-md"
            >
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8b7065]">
                    {t("date")}
                  </p>

                  <p className="mt-1 text-xl font-semibold text-[#4f3b34]">
                    {a.startsAt.toLocaleDateString("fr-FR")}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <p className="rounded-full border border-[#b89f93]/40 bg-[#dfcec6]/70 px-3 py-1 text-sm font-medium text-[#6f574e]">
                    {a.startsAt.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#b89f93]/40 bg-white/40 text-[#7d6258] transition hover:bg-white/70 hover:text-[#5f4941]">
                        <Trash size={18} />
                      </button>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="border border-[#cdbbb2]/50 bg-[#f1e7e2]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-[#4f3b34]">
                          {t("cancel_title")}
                        </AlertDialogTitle>

                        <AlertDialogDescription className="text-[#6f574e]">
                          {t("cancel_description")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-[#b89f93]/40 bg-white/50 text-[#5f4941] hover:bg-white/80">
                          {t("cancel_back")}
                        </AlertDialogCancel>

                        <AlertDialogAction
                          onClick={() => handleDelete(a.id)}
                          className="bg-[#7d6258] text-white hover:bg-[#6b5148]"
                        >
                          {t("cancel_confirm")}{" "}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <Separator className="bg-[#cdbbb2]/50" />

              <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#cdbbb2]/40 bg-white/40 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-[#8b7065]">
                    {t("prestations")}
                  </p>

                  <p className="mt-2 text-base font-medium text-[#4f3b34]">
                    {Array.isArray(a.appointmentItem) &&
                      (a.appointmentItem[0] as AppointmentItem)?.name}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#cdbbb2]/40 bg-white/40 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-[#8b7065]">
                    {t("options")}
                  </p>

                  <p className="mt-2 text-base text-[#6f574e]">
                    {Array.isArray(a.appointmentOption) &&
                    a.appointmentOption.length > 0
                      ? (a.appointmentOption[0] as AppointmentItem)?.name
                      : "—"}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex w-full flex-col items-center justify-center rounded-3xl border border-[#cdbbb2]/50 bg-[#f1e7e2]/85 px-6 py-10 text-center shadow-[0_18px_45px_rgba(90,65,55,0.12)] backdrop-blur-md">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#b89f93]/40 bg-[#dfcec6]/70 text-2xl">
            ✨
          </div>

          <p className="text-xl font-semibold text-[#4f3b34]">
            {t("empty_title")}{" "}
          </p>

          <p className="mt-2 max-w-sm text-sm leading-6 text-[#6f574e]">
            {t("empty_description")}
          </p>
        </div>
      )}
    </div>
  );
}
