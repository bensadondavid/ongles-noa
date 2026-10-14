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
      data: { url: data.url === "/dashboard/messages" ? data.url : "/dashboard" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url === "/dashboard/messages"
    ? "/dashboard/messages"
    : "/dashboard";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      const target = windows.find((window) => new URL(window.url).pathname === url);
      if (target) return target.navigate(url).then((window) => window?.focus());
      return clients.openWindow(url);
    }),
  );
});
