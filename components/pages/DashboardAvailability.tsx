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

function minToTime(min: number) {
  const h = String(Math.floor(min / 60)).padStart(2, "0");
  const m = String(min % 60).padStart(2, "0");
  return `${h}:${m}`;
}

export default function DashboardAvailability() {
  const [month, setMonth] = useState(() => new Date());
  const [rules, setRules] = useState<Rule[]>([]);
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
        const res = await fetch(
          `/api/dashboard/availability?month=${format(month, "yyyy-MM")}`
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setRules(data.rules);
      } catch {
        toast.error("Impossible de charger les disponibilités");
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

  const isOpen = dayRules.length > 0;

  const addPlage = async () => {
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

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6 md:flex-row md:items-start">
      <Calendar
        dir="ltr"
        mode="single"
        locale={fr}
        month={month}
        onMonthChange={setMonth}
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        modifiers={{ open: (date) => openDates.has(format(date, "yyyy-MM-dd")) }}
        modifiersClassNames={{
          open: "after:absolute after:bottom-1 after:left-1/2 after:size-1.5 after:-translate-x-1/2 after:rounded-full after:bg-white",
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
          </>
        )}
      </div>
    </div>
  );
}
