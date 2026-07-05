// Sternenluna · Push-Handler (wird per importScripts in den Service Worker geladen)
// Zeigt eingehende Erinnerungen als Benachrichtigung mit Luna-Icon.
self.addEventListener('push', (event) => {
  let d = {}
  try {
    d = event.data ? event.data.json() : {}
  } catch {
    /* Nachricht ohne JSON-Payload */
  }
  event.waitUntil(
    self.registration.showNotification(d.title || '✦ Sternenluna', {
      body: d.body || 'Luna hat einen Gedanken für dich.',
      icon: '/uploads/luna-icon.png',
      badge: '/uploads/luna-icon.png',
      tag: d.tag || 'sternenluna',
      data: { url: d.url || '/' },
    })
  )
})

// Tipp auf die Benachrichtigung: App fokussieren oder öffnen
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) if ('focus' in c) return c.focus()
      return self.clients.openWindow((event.notification.data && event.notification.data.url) || '/')
    })
  )
})
