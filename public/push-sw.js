self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
    if (!data || typeof data !== "object") data = {};
  } catch {
    data = {};
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "Noa Bensadon", {
      body: data.body || "Un nouveau rendez-vous a été réservé.",
      icon: "/logo-noa-fav.png",
      badge: "/logo-noa-fav.png",
      tag: data.tag,
      data: { url: "/dashboard" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      const dashboard = windows.find((window) => new URL(window.url).pathname.startsWith("/dashboard"));
      if (dashboard) return dashboard.focus();
      return clients.openWindow("/dashboard");
    }),
  );
});
