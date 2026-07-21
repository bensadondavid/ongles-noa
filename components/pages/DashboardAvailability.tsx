"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Rule = { id: string; date: string; startMin: number; endMin: number };
type Appointment = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "CONFIRMED";
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  appointmentItem: unknown;
  appointmentOption: unknown;
  message: string | null;
};

function itemNames(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) =>
    typeof item === "object" && item !== null && "name" in item &&
    typeof item.name === "string"
      ? [item.name]
      : []
  );
}

function minToTime(min: number) {
  const h = String(Math.floor(min / 60)).padStart(2, "0");
  const m = String(min % 60).padStart(2, "0");
  return `${h}:${m}`;
}

export default function DashboardAvailability() {
  const [month, setMonth] = useState(() => new Date());
  const [rules, setRules] = useState<Rule[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [saving, setSaving] = useState(false);

  const selectedKey = format(selectedDate, "yyyy-MM-dd");

  useEffect(() => {
    const fetchMonth = async () => {
      setLoading(true);
      try {
        const monthKey = format(month, "yyyy-MM");
        const [availabilityRes, appointmentsRes] = await Promise.all([
          fetch(`/api/dashboard/availability?month=${monthKey}`),
          fetch(`/api/dashboard/appointments?month=${monthKey}`),
        ]);
        if (!availabilityRes.ok || !appointmentsRes.ok) throw new Error();
        const [availabilityData, appointmentsData] = await Promise.all([
          availabilityRes.json(),
          appointmentsRes.json(),
        ]);
        setRules(availabilityData.rules);
        setAppointments(appointmentsData.appointments);
      } catch {
        toast.error("Impossible de charger le calendrier");
      } finally {
        setLoading(false);
      }
    };
    fetchMonth();
  }, [month]);

  const openDates = useMemo(
    () => new Set(rules.map((r) => r.date)),
    [rules]
  );

  const dayRules = useMemo(
    () =>
      rules
        .filter((r) => r.date === selectedKey)
        .sort((a, b) => a.startMin - b.startMin),
    [rules, selectedKey]
  );

  const appointmentDates = useMemo(
    () => new Set(appointments.map((appointment) => appointment.date)),
    [appointments]
  );

  const dayAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.date === selectedKey),
    [appointments, selectedKey]
  );

  const isOpen = dayRules.length > 0;

  const addPlage = async () => {
    if (startTime >= endTime) {
      toast.error("L'heure de fin doit être après l'heure de début");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedKey, startTime, endTime }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Erreur lors de l'ajout");
        return;
      }
      setRules((prev) => [...prev, data.rule]);
      toast.success("Plage horaire ajoutée");
    } catch {
      toast.error("Erreur lors de l'ajout");
    } finally {
      setSaving(false);
    }
  };

  const deletePlage = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard/availability/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setRules((prev) => prev.filter((r) => r.id !== id));
      toast.success("Plage horaire supprimée");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const closeDay = async () => {
    try {
      const res = await fetch(
        `/api/dashboard/availability?date=${selectedKey}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      setRules((prev) => prev.filter((r) => r.date !== selectedKey));
      toast.success("Journée fermée");
    } catch {
      toast.error("Erreur lors de la fermeture");
    }
  };

  const deleteAppointment = async(id: string)=>{
    try{
      const response = await fetch('/api/dashboard/appointments', {
        method: "PUT",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({id})
      })
      if(!response.ok){
        return toast.error("Erreur dans la suppression du rdv")
      }
      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== id)
      );
      toast.success('Rdv supprimé')
    }
    catch{
      toast.error("Erreur dans la suppression du rdv");
    }
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6 pt-15 md:flex-row md:items-start">
      <Calendar
        dir="ltr"
        mode="single"
        locale={fr}
        month={month}
        onMonthChange={setMonth}
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        modifiers={{
          open: (date) => openDates.has(format(date, "yyyy-MM-dd")),
          booked: (date) => appointmentDates.has(format(date, "yyyy-MM-dd")),
        }}
        modifiersClassNames={{
          open: "after:absolute after:bottom-1 after:left-1/2 after:size-1.5 after:-translate-x-1/2 after:rounded-full after:bg-white",
          booked: "before:absolute before:right-1 before:top-1 before:size-2 before:rounded-full before:bg-amber-300 before:ring-2 before:ring-border",
        }}
        className="rounded-3xl bg-border p-4 text-white font-bold [--cell-size:2.5rem]"
      />

      <div className="flex-1 rounded-3xl bg-border p-6 text-white">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-primary text-lg capitalize">
            {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
          </h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              isOpen ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white/60"
            }`}
          >
            {isOpen ? "Ouvert" : "Fermé"}
          </span>
        </div>

        {loading ? (
          <p className="text-sm text-white/60">Chargement...</p>
        ) : (
          <>
            <ul className="mb-4 flex flex-col gap-2">
              {dayRules.length === 0 && (
                <li className="text-sm text-white/60">
                  Aucune plage horaire pour ce jour.
                </li>
              )}
              {dayRules.map((rule) => (
                <li
                  key={rule.id}
                  className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2"
                >
                  <span>
                    {minToTime(rule.startMin)} – {minToTime(rule.endMin)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => deletePlage(rule.id)}
                    aria-label="Supprimer la plage"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>

            <div className="mb-4 flex flex-wrap items-end gap-3">
              <div>
                <Label htmlFor="startTime" className="mb-1 block text-xs text-white/60">
                  Début
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-28 text-white"
                />
              </div>
              <div>
                <Label htmlFor="endTime" className="mb-1 block text-xs text-white/60">
                  Fin
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-28 text-white"
                />
              </div>
              <Button onClick={addPlage} disabled={saving}>
                Ajouter la plage
              </Button>
            </div>

            {isOpen && (
              <Button variant="destructive" onClick={closeDay}>
                Fermer toute la journée
              </Button>
            )}

            <div className="mt-6 border-t border-white/15 pt-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-primary text-base">Rendez-vous</h3>
                <span className="rounded-full bg-amber-300 px-2.5 py-1 text-xs font-bold text-border">
                  {dayAppointments.length}
                </span>
              </div>

              {dayAppointments.length === 0 ? (
                <p className="text-sm text-white/60">
                  Aucun rendez-vous pour ce jour.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {dayAppointments.map((appointment) => {
                    const prestations = itemNames(appointment.appointmentItem);
                    const options = itemNames(appointment.appointmentOption);

                    return (
                      <li
                        key={appointment.id}
                        className="rounded-xl border border-amber-300/30 bg-white/10 p-3"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold">
                              {appointment.startTime} – {appointment.endTime}
                            </p>
                            <p className="text-sm">{appointment.customerName}</p>
                          </div>
                          <div className="flex flex-row gap-2 items-center justify-center">
                            <span className="rounded-full bg-white/10 px-2 py-1 text-[11px]">
                              {appointment.status}
                            </span>
                            <button className="" onClick={()=>deleteAppointment(appointment.id)}><Trash2 size={23}/></button>
                          </div>
                        </div>
                        {prestations.length > 0 && (
                          <p className="mt-2 text-sm text-white/80">
                            {prestations.join(", ")}
                            {options.length > 0 ? ` · ${options.join(", ")}` : ""}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-white/60">
                          {appointment.customerPhone || appointment.customerEmail}
                        </p>
                        {appointment.message && (
                          <p className="mt-2 rounded-lg bg-black/10 p-2 text-xs text-white/70">
                            {appointment.message}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
