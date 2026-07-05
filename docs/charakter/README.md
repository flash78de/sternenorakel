# Luna – Charakter-Referenz

Referenzmaterial für KI-Video-Tools (Kling, Seedance) und künftige Grafiken.
Nichts hiervon wird in der App ausgeliefert – die App nutzt die PNGs in `public/uploads/`.

## Dateien

| Datei | Zweck |
| --- | --- |
| `luna-referenz.png` | Komplettes Character-Sheet (Ansichten, Headshots, Expressions, Posen, Details, Farbpalette) |
| `luna-ansicht-front.png` | Frontansicht, freigestellt fürs Referenzbild |
| `luna-ansicht-dreiviertel.png` | 3/4-Ansicht |
| `luna-ansicht-seite.png` | Seitenansicht |
| `luna-ansicht-ruecken.png` | Rückansicht |

## Tipps für Kling / Seedance

- **Einzelansichten statt Sheet hochladen** – Video-Modelle übernehmen sonst Layout-Elemente (Rahmen, Beschriftung) ins Bild. Für die meisten Shots reicht die 3/4-Ansicht als Referenz; Front + Seite zusätzlich, wenn das Tool mehrere Referenzbilder erlaubt (z. B. Kling Elements).
- **Prompt-Bausteine** direkt aus den Detail-Callouts des Sheets: „small purple fox-like fairy creature, four gossamer wings with gold-vein detail, golden star on each ear tip, golden crescent moon on forehead, fluffy tail with star-shaped tuft, cream chest, big violet eyes, plush fur with subtle star speckles, warm gold glow, soft dreamy lighting“.
- **Farbpalette** (aus dem Sheet): Cosmic Purple, Soft Violet, Lavender, Cream, Warm Gold, Deep Gold, Eye Violet, Starlight Glow.
- Für Deckungsgleichheit mit dem App-Look ggf. ein PNG aus `public/uploads/` (z. B. `luna-idle-transparent.png`) als zweite Referenz mitgeben.

## Noch offen

- Bewegungs-Referenz (schwebend von der Seite) und eine Pose mit Requisite (Luna berührt eine Karte/einen Stern) wären für Tageskarten-Reels ideal.
- Umgebungs-Referenz (Lunas Nachthimmel-Welt), damit der Hintergrund über mehrere Clips konsistent bleibt.
- Tippfehler im Sheet: Callout „Forehead Crescent“ → „Golden **cerscent** moon“ (statt „crescent“). Vor öffentlicher Verwendung des Sheets fixen.
