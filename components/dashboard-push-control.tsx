"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";

function decodePublicKey(value: string) {
  const padded = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

function subscribeToDisplayMode(callback: () => void) {
  const media = window.matchMedia("(display-mode: standalone)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function DashboardPushControl() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const installed = useSyncExternalStore(subscribeToDisplayMode, isStandalone, () => false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    async function prepare() {
      if (!("serviceWorker" in navigator)) {
        throw new Error("Les notifications ne sont pas disponibles sur cet appareil.");
      }
      const [worker, key] = await Promise.all([
        navigator.serviceWorker.register("/push-sw.js"),
        fetch("/api/dashboard/push").then(async (response) => {
          if (!response.ok) throw new Error("Notifications non configurées sur le serveur.");
          const data: { publicKey: string } = await response.json();
          return data.publicKey;
        }),
      ]);
      if (!("pushManager" in worker) || !worker.pushManager) {
        throw new Error(
          isStandalone()
            ? "Cette installation ne donne pas accès aux notifications. Supprimez l’ancienne icône et ajoutez le site à nouveau depuis Safari."
            : "Ouvrez le site depuis son icône sur l’écran d’accueil pour activer les notifications.",
        );
      }
      const current = await worker.pushManager.getSubscription();
      if (!active) return;
      setRegistration(worker);
      setPublicKey(key);
      setSubscription(current);
    }
    prepare().catch((error) => {
      if (active) setMessage(error instanceof Error ? error.message : "Notifications indisponibles.");
    });
    return () => {
      active = false;
    };
  }, []);

  async function enable() {
    if (!registration || !publicKey) return;
    setBusy(true);
    setMessage("");
    try {
      // Sur iPhone, subscribe doit être appelé depuis le geste de l'utilisateur.
      const next = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: decodePublicKey(publicKey).buffer as ArrayBuffer,
      });
      const response = await fetch("/api/dashboard/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next.toJSON()),
      });
      if (!response.ok) {
        await next.unsubscribe();
        throw new Error("Impossible d'enregistrer cet iPhone.");
      }
      setSubscription(next);
      setMessage("Notifications activées sur cet appareil.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Autorisation refusée ou activation impossible.");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    if (!subscription) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/dashboard/push", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
      if (!response.ok) throw new Error("Impossible de désactiver les notifications.");
      await subscription.unsubscribe();
      setSubscription(null);
      setMessage("Notifications désactivées sur cet appareil.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Désactivation impossible.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-6 pt-16" aria-label="Notifications de rendez-vous">
      <div className="flex flex-col gap-3 rounded-3xl bg-border p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-primary text-lg">
            <Bell className="size-5" aria-hidden="true" /> Notifications de rendez-vous
          </h2>
          <p className="mt-1 text-sm text-white/70">
            {subscription ? "Activées sur cet appareil." : "Recevez une alerte pour chaque nouveau rendez-vous."}
          </p>
          {!installed && (
            <p className="mt-2 text-sm text-white/70">
              Sur iPhone, ajoutez d’abord ce site à l’écran d’accueil, puis ouvrez-le depuis son icône.
            </p>
          )}
          {message && <p className="mt-2 text-sm" role="status">{message}</p>}
        </div>
        {subscription ? (
          <Button type="button" variant="outline" disabled={busy} onClick={disable}>
            <BellOff className="size-4" aria-hidden="true" /> Désactiver
          </Button>
        ) : (
          <Button type="button" disabled={!installed || !registration || !publicKey || busy} onClick={enable}>
            Activer les notifications
          </Button>
        )}
      </div>
    </section>
  );
}
