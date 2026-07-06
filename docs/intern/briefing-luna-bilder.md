# Briefing: Luna-Bildassets (für Bildgenerierung/Illustration)

## Wichtigste Regel: EINE Luna-Identität

Alle Bilder müssen exakt dieselbe Figur zeigen wie die bestehenden Assets
(`public/uploads/luna-*.png`): lila-goldenes Fuchs-Sternenwesen mit
- gleichem **Stirnmond** (goldene Mondsichel auf der Stirn),
- gleichen **Ohrensternen** (goldene Sterne an den Ohrspitzen),
- gleichen **transparenten Feenflügeln** (lila-gold),
- gleicher **Schwanzspitze mit Stern**,
- gleicher **Augenform** (große violette Augen),
- gleichen **Körperproportionen** (kindchenschema, sitzend/schwebend).

## Technische Vorgaben

- echtes **transparentes PNG** (Alpha-Kanal), zusätzlich WebP
- mindestens **2048 × 2048 px**
- keine Schachbrettfläche, keine Beschriftung, kein Rahmen
- Stil identisch zu den bestehenden Bildern (weicher Painterly-Look, Gold-Glow)

## FEHLENDES Asset (Priorität 1)

### `luna-sehnsucht-transparent.png` — Sanfte Sehnsucht

**Einsatz:** Rückkehr nach Pause, offene Reflexion, längere Abwesenheit.

**Pose & Ausdruck:**
- Luna sitzt etwas kleiner/kompakter als im Idle-Zustand
- Kopf leicht geneigt, **hoffnungsvoller, freundlicher Blick nach oben/vorne**
- eine Pfote leicht erhoben (als würde sie sanft winken oder etwas erwarten)
- vielleicht ein kleines Herz- oder Sternfunkeln neben ihr
- **niemals traurig, weinend oder vorwurfsvoll** – warm und einladend
- Glow etwas gedämpfter als Idle, lila-dominant

**Gefühl beim Betrachter:** „Sie hat auf mich gewartet – ohne Vorwurf."

## Optionale Neu-Interpretationen (Priorität 2, nur bei Bedarf)

Die bestehenden 5 Zustände sind vorhanden; falls sie neu erstellt werden,
gelten diese Definitionen:

| Datei | Zustand | Pose |
|---|---|---|
| `luna-idle-transparent.png` | Ruhe | ruhig sitzend/schwebend, Hände zusammen, offene freundliche Augen, leichtes Lächeln |
| `luna-lauschen-transparent.png` | Lauschen | Augen geschlossen, Hände am Herzen, schwebend, sanfte Energiebewegung |
| `luna-offenbarung-transparent.png` | Offenbarung | Augen offen, Hände nach außen geöffnet, goldener Lichtstoß, Flügel leicht geöffnet |
| `luna-freude-transparent.png` | Freude | kleiner Sprung, Arme hoch, lachende Mimik, goldene Partikel |
| `luna-schlaf-transparent.png` | Schlaf | zusammengerollt, Augen zu, auf Mondsichel/Wolke, gedämpfter Glow |

## Größeneinsatz in der App (zur Orientierung)

- **Splash:** 55–65 % der Bildschirmhöhe
- **Lauschen:** 40–55 % · **Offenbarung:** 50–65 %
- **Dashboard-Hero:** mind. 35 % der sichtbaren Höhe
- **Avatar:** Kopf/Oberkörper rund beschnitten

## Zusätzlich sinnvoll (Priorität 3)

- `luna-erwacht.png` existiert bereits (Splash, 941×1672) – bei Neuanfertigung:
  Hochformat, Luna schlafend → Augen öffnen sich, Titel „Sternenorakel" integriert.
- Ritual-Illustrationen: goldener Würfel (existiert: `wuerfel.png`),
  Kartenrücken-Design (lila mit Gold-Stern), 3 Runensteine (dunkler Stein, Gold-Gravur).
