# PayPal-Sprint · Vorbereitung (startet, sobald das Business-Konto existiert)

## Feststehende Parameter

| Parameter | Wert |
|---|---|
| PayPal-Business-Konto | `paypal@mittel-bar.com` (wird noch angelegt) |
| Vertragspartnerin / Zahlungsempfängerin | **KPK Ingrid Lenk** – Bereich „Mister Hochzeit", Alte Auerbacher Str. 23, 08304 Schönheide |
| Inhaltlich verantwortlich / Entwicklung | Marcel Lenk |
| Monatsabo | **4,99 € / Monat** |
| Jahresabo | **39,99 € / Jahr** (≈ 33 % Ersparnis – Hauptverkäufer, Monatspreis ist der Anker) |
| Testphase | 7 Tage kostenlos, danach automatische Abbuchung |
| Kündigung | jederzeit; wirkt zum Ende des laufenden Abrechnungszeitraums |
| **KI-Zugang nach der Beta** | **Ohne Plus: KI-Botschaft nur während der ersten 7 Tage (1×/Tag), danach Offline-Bibliothek. Mit Plus: KI unbegrenzt (Tagesbotschaft + freie Impulse).** Umsetzung: `installISO` beim ersten Start speichern; `aiAllowed = premium \|\| (heute − installISO < 7 Tage)`; abgelaufene Tester sehen beim Ziehen einen sanften Hinweis „Deine KI-Sterntage sind vorbei – mit Plus formuliert Luna weiter live" statt eines Fehlers. Entscheidung Marcel, 04.07.2026 – schützt vor KI-Kosten durch Gratis-Dauernutzer. |
| Abrechnungsstichtag | PayPal Subscriptions rechnet zyklusgenau ab Aktivierungstag ab; existiert der Stichtag im Monat nicht (31. → Februar), bucht PayPal automatisch am Monatsletzten. Keine Eigenlogik nötig. |

## Umsetzungsplan (mein Teil, ~1 Sprint)

1. **PayPal-Konfiguration:** Produkt „Sternenluna Plus" + zwei Billing-Pläne
   (monatlich 4,99 € / jährlich 39,99 €), jeweils mit 7-Tage-Trial; Webhook
   `BILLING.SUBSCRIPTION.*` auf den Worker.
2. **Worker-Endpunkte** (`server/orakel-worker.js` erweitern oder zweiter Worker):
   - `POST /api/plus/verify` – prüft eine Subscription-ID live bei PayPal
     (Status ACTIVE/CANCELLED + `next_billing_time`) und gibt der App einen
     signierten Freischalt-Nachweis mit Ablaufdatum zurück.
   - Secrets: `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET` (Cloudflare-Secrets, nie im Repo).
3. **App:**
   - PlusDetail: echter PayPal-Abo-Button (JS-SDK, Plan-Auswahl Monat/Jahr),
     nach Rückkehr Verifikation über den Worker → `premium` mit Ablaufdatum.
   - Periodische Re-Validierung (z. B. wöchentlich) mit Kulanzfenster offline.
   - **Kündigungsbutton nach § 312k BGB**: gut sichtbar unter Einstellungen →
     Plus verwalten („Verträge hier kündigen"), führt zur PayPal-Kündigung +
     bestätigt in der App; Anzeige „Plus läuft noch bis TT.MM.JJJJ".
   - Beta-Hinweise entfernen, Preise scharf schalten.
4. **Rechtstexte:** AGB + Widerrufsbelehrung (digitale Inhalte, Verzicht bei
   sofortiger Bereitstellung), Preisangaben; anwaltlich prüfen lassen, bevor
   die erste echte Abbuchung läuft.

## Offene To-dos (Marcel)

- [ ] PayPal-Business-Konto für `paypal@mittel-bar.com` anlegen (auf KPK Ingrid Lenk)
- [ ] Steuerliche Einordnung mit Steuerberater/in klären (Kleinunternehmer § 19 UStG?)
- [ ] AGB/Widerruf final prüfen lassen (z. B. eRecht24 / Anwalt)
