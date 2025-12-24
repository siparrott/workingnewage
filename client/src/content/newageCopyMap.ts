// newageCopyMap.ts
// Content map for service pages with SEO metadata and markdown copy
// H1 headings in markdown will be converted to H2 by MarkdownCopySlot

export interface ServicePageCopy {
  title: string;
  metaDescription: string;
  h1: string;
  markdown: string;
}

export const newageCopyMap: Record<string, ServicePageCopy> = {
  'bewerbungsfotos-wien': {
    title: 'Bewerbungsfotos & LinkedIn Fotos in Wien | New Age Fotografie',
    metaDescription: 'Professionelle Bewerbungsfotos & LinkedIn Portraits in Wien. Weiches Studio-Licht, freundliche Anleitung, schnelle Lieferung. Jetzt Termin buchen!',
    h1: 'Bewerbungsfotos & LinkedIn Fotos in Wien',
    markdown: `## Was ihr erwarten könnt
- **Freundliche Anleitung** statt Unsicherheit vor der Kamera
- **Weiches, professionelles Licht** (Octa‑Softboxen) für natürliche Hauttöne
- **Persönlichkeit im Bild:** Bringt gern persönliche Dinge mit: Spielzeug, Hobbys, Instrumente, Lieblingsbuch – das macht eure Bilder einzigartig.
- **Flexibel mit Menschen & Tieren:** Haustiere sind willkommen – gebt uns kurz vorher Bescheid, dann planen wir eine kleine „Pet-Pause" ein.

## Pakete & Optionen
| Paket | Ideal für | Inklusive |
|---|---|---|
| **Classic** | 1–2 Motive | Shooting (ca. 60 Min.) · Auswahl · professionelle Retusche · digitale Lieferung |
| **Plus** | mehrere Looks / Nutzung für Website + LinkedIn | mehr Motive · Varianten (quer/hoch) · konsistenter Look |
| **Team Add-on** | Mitarbeiter-Set | wiederholbares Setup · einheitliche Bildsprache · effiziente Reihenfolge |

## Look & Wirkung
Für Bewerbungs- und LinkedIn-Fotos geht es um Klarheit: Kompetenz, Nahbarkeit, Professionalität. Wir fotografieren Varianten:
- freundlich & offen (ideal für LinkedIn)
- klassisch-seriös (Bewerbung/HR)
- modern & dynamisch (Startups/Creative)

## Ablauf – so läuft euer Shooting
1. **Kurzbriefing:** wer kommt, welche Kombinationen sind wichtig, welche Stimmung wollt ihr?
2. **Ankommen & Outfit-Check:** wir stimmen Farben ab und geben Mini‑Tipps.
3. **Shooting mit Anleitung:** Gesamtmotiv, Teilgruppen, Einzelportraits – locker geführt.
4. **Auswahl:** Wenn es zeitlich passt, zeigen wir häufig noch am selben Tag eine Auswahl (IPS). Wenn es der letzte Termin ist, kommt die Auswahl bequem online.
5. **Retusche & Lieferung:** Die fertigen Bilder liefern wir immer über eine private, passwortgeschützte Online-Galerie aus der Cloud.

## Mini‑FAQ
**Wie lange dauert das Shooting?**
Meist ca. 60 Minuten – mit genug Zeit für die wichtigsten Motive.

**Dürfen Haustiere mit?**
Ja. Kurz vorher Bescheid geben, dann planen wir entspannt.

**Wann bekommen wir die Bilder?**
Auswahl je nach Terminlage schnell; final nach Retusche bequem über die Cloud.`
  },

  'business-portrait-wien': {
    title: 'Business Portraits in Wien | New Age Fotografie',
    metaDescription: 'Professionelle Business Portraits in Wien. Ruhig, professionell, auf den Punkt – mit Bildern, die Vertrauen aufbauen. Jetzt Termin buchen!',
    h1: 'Business Portraits in Wien',
    markdown: `## Was ihr erwarten könnt
- **Freundliche Anleitung** statt Unsicherheit vor der Kamera
- **Weiches, professionelles Licht** (Octa‑Softboxen) für natürliche Hauttöne
- **Persönlichkeit im Bild:** Bringen Sie gern 2–3 Outfits mit (Business/Smart Casual) und – wenn relevant – Arbeitsmaterial (Laptop, Headset, Werkzeug, Produktmuster).
- **Flexibel mit Menschen & Tieren:** Haustiere sind willkommen – gebt uns kurz vorher Bescheid, dann planen wir eine kleine „Pet-Pause" ein.

## Pakete & Optionen
| Paket | Ideal für | Inklusive |
|---|---|---|
| **Classic** | 1–2 Motive | Shooting (ca. 60 Min.) · Auswahl · professionelle Retusche · digitale Lieferung |
| **Plus** | mehrere Looks / Nutzung für Website + LinkedIn | mehr Motive · Varianten (quer/hoch) · konsistenter Look |
| **Team Add-on** | Mitarbeiter-Set | wiederholbares Setup · einheitliche Bildsprache · effiziente Reihenfolge |

## Ablauf – so läuft es bei uns
1. **Kurzbriefing:** Ziel, Einsatz (Website/LinkedIn/Print), gewünschter Stil.
2. **Ankommen & Outfit-Check:** Farben, Stoffe, Kragen, Details – wir optimieren schnell.
3. **Shooting mit Anleitung:** klare Posen, kleine Mikro-Bewegungen, natürliche Mimik.
4. **Auswahl:** Wenn es zeitlich passt, zeigen wir häufig noch am selben Tag eine Auswahl (IPS). Wenn es der letzte Termin ist, kommt die Auswahl bequem online.
5. **Retusche & Lieferung:** Die fertigen Bilder liefern wir immer über eine private, passwortgeschützte Online-Galerie aus der Cloud.

## Mini‑FAQ
**Wie lange dauert ein Shooting?**
In der Regel ca. 60 Minuten – effizient geplant.

**Bietet ihr Make-up an?**
Nein. Bitte vorbereitet kommen. Unser Licht ist sehr schmeichelnd.

**Wann bekomme ich die Bilder?**
Je nach Paket/Retusche – Auswahl meist schnell, final nach Retusche über die Cloud.`
  },

  'neugeborenenfotos-wien': {
    title: 'Neugeborenenfotos in Wien | New Age Fotografie',
    metaDescription: 'Neugeborenenfotos in Wien – sanft, sicher, natürlich. Weiches Studio-Licht für die ersten Lebenstage. Professionelle Babyfotografie. Jetzt Termin buchen!',
    h1: 'Neugeborenenfotos in Wien',
    markdown: `## Was ihr erwarten könnt
- **Freundliche Anleitung** statt Unsicherheit vor der Kamera
- **Weiches, professionelles Licht** (Octa‑Softboxen) für natürliche Hauttöne
- **Persönlichkeit im Bild:** Bringt gern persönliche Dinge mit: Spielzeug, Hobbys, Instrumente, Lieblingsbuch – das macht eure Bilder einzigartig.
- **Flexibel mit Menschen & Tieren:** Haustiere sind willkommen – gebt uns kurz vorher Bescheid, dann planen wir eine kleine „Pet-Pause" ein.

## Pakete & Optionen
| Paket | Ideal für | Inklusive |
|---|---|---|
| **Basic** | ein Hauptmotiv | Shooting (ca. 60 Min.) · Auswahlgalerie · 1 retuschiertes Bild digital |
| **Premium** | mehrere Lieblingsmotive | mehr retuschierte Bilder · Varianten · optionale Print/Leinwand-Add-ons |
| **Deluxe** | „Alles drin" | größere Auswahl · mehr Retusche · ideal für Familien/Meilensteine |

## Was ihr mitbringen solltet
- Wickeltasche wie gewohnt (Windeln, Tücher, Schnuller/Fläschchen)
- 1–2 neutrale Bodies/Decken, wenn ihr mögt
- Ein kleines persönliches Item (z. B. Kuscheltier)

Wasser, Kaffee & Tee sind da – auf Wunsch auch Bier oder Prosecco. Make-up bieten wir nicht an – bitte kommt, wenn möglich, bereits mit Hair & Make-up. Unser Licht wirkt aber ohnehin sehr schmeichelnd.

## Sicherheit & Umgang mit Neugeborenen
Bei Neugeborenen ist das Wichtigste: **Sicherheit vor allem**. Wir arbeiten ruhig, warm und ohne Hektik. Posen entstehen bei uns nicht „mit Druck", sondern mit Geduld, kleinen Handgriffen und Pausen.
- Wir planen Zeit für Stillen/Fläschchen, Wickeln und Beruhigen ein.
- Wir fotografieren sanft und natürlich – kein Zwang, keine riskanten Positionen.
- Wenn euer Baby schläft: wunderbar. Wenn nicht: auch perfekt – wache Bilder sind oft die ehrlichsten.

## Ablauf – so läuft euer Shooting
1. **Kurzbriefing:** wer kommt, welche Kombinationen sind wichtig, welche Stimmung wollt ihr?
2. **Ankommen & Outfit-Check:** wir stimmen Farben ab und geben Mini‑Tipps.
3. **Shooting mit Anleitung:** Gesamtmotiv, Teilgruppen, Einzelportraits – locker geführt.
4. **Auswahl:** Wenn es zeitlich passt, zeigen wir häufig noch am selben Tag eine Auswahl (IPS). Wenn es der letzte Termin ist, kommt die Auswahl bequem online.
5. **Retusche & Lieferung:** Die fertigen Bilder liefern wir immer über eine private, passwortgeschützte Online-Galerie aus der Cloud.

## Mini‑FAQ
**Wie lange dauert das Shooting?**
Meist ca. 60 Minuten – mit genug Zeit für die wichtigsten Motive.

**Dürfen Haustiere mit?**
Ja. Kurz vorher Bescheid geben, dann planen wir entspannt.

**Wann bekommen wir die Bilder?**
Auswahl je nach Terminlage schnell; final nach Retusche bequem über die Cloud.`
  },

  'eventfotografie-wien': {
    title: 'Eventfotografie in Wien | New Age Fotografie',
    metaDescription: 'Eventfotografie in Wien – präsent sein, ohne zu stören. Dokumentarisch und mit Blick für starke Portraits. Firmenfeiern, Konferenzen, PR-Events.',
    h1: 'Eventfotografie in Wien',
    markdown: `## Was ihr erwarten könnt
- **Freundliche Anleitung** statt Unsicherheit vor der Kamera
- **Weiches, professionelles Licht** (Octa‑Softboxen) für natürliche Hauttöne
- **Persönlichkeit im Bild:** Bringt gern persönliche Dinge mit: Spielzeug, Hobbys, Instrumente, Lieblingsbuch – das macht eure Bilder einzigartig.
- **Flexibel mit Menschen & Tieren:** Haustiere sind willkommen – gebt uns kurz vorher Bescheid, dann planen wir eine kleine „Pet-Pause" ein.

## Pakete & Optionen
| Paket | Ideal für | Inklusive |
|---|---|---|
| **Basic** | ein Hauptmotiv | Shooting (ca. 60 Min.) · Auswahlgalerie · 1 retuschiertes Bild digital |
| **Premium** | mehrere Lieblingsmotive | mehr retuschierte Bilder · Varianten · optionale Print/Leinwand-Add-ons |
| **Deluxe** | „Alles drin" | größere Auswahl · mehr Retusche · ideal für Familien/Meilensteine |

## Eventfotografie – präsent sein, ohne zu stören
Wir arbeiten unaufdringlich, dokumentarisch und trotzdem mit Blick für starke Portraits. Ideal für:
- Firmenfeiern & Awards
- Konferenzen & Vorträge
- Eröffnungen & PR-Events

## Ablauf – so läuft euer Shooting
1. **Kurzbriefing:** wer kommt, welche Kombinationen sind wichtig, welche Stimmung wollt ihr?
2. **Ankommen & Outfit-Check:** wir stimmen Farben ab und geben Mini‑Tipps.
3. **Shooting mit Anleitung:** Gesamtmotiv, Teilgruppen, Einzelportraits – locker geführt.
4. **Auswahl:** Wenn es zeitlich passt, zeigen wir häufig noch am selben Tag eine Auswahl (IPS). Wenn es der letzte Termin ist, kommt die Auswahl bequem online.
5. **Retusche & Lieferung:** Die fertigen Bilder liefern wir immer über eine private, passwortgeschützte Online-Galerie aus der Cloud.

## Mini‑FAQ
**Wie lange dauert das Shooting?**
Meist ca. 60 Minuten – mit genug Zeit für die wichtigsten Motive.

**Dürfen Haustiere mit?**
Ja. Kurz vorher Bescheid geben, dann planen wir entspannt.

**Wann bekommen wir die Bilder?**
Auswahl je nach Terminlage schnell; final nach Retusche bequem über die Cloud.`
  },

  'hochzeitsfotografie-wien': {
    title: 'Hochzeitsfotografie in Wien | New Age Fotografie',
    metaDescription: 'Hochzeitsfotografie in Wien – echte Momente, ungestellt aber geführt. Paarportraits, Gruppen, Familienbilder. Professionelle Hochzeitsfotos.',
    h1: 'Hochzeitsfotografie in Wien',
    markdown: `## Was ihr erwarten könnt
- **Freundliche Anleitung** statt Unsicherheit vor der Kamera
- **Weiches, professionelles Licht** (Octa‑Softboxen) für natürliche Hauttöne
- **Persönlichkeit im Bild:** Bringt gern persönliche Dinge mit: Spielzeug, Hobbys, Instrumente, Lieblingsbuch – das macht eure Bilder einzigartig.
- **Flexibel mit Menschen & Tieren:** Haustiere sind willkommen – gebt uns kurz vorher Bescheid, dann planen wir eine kleine „Pet-Pause" ein.

## Pakete & Optionen
| Paket | Ideal für | Inklusive |
|---|---|---|
| **Basic** | ein Hauptmotiv | Shooting (ca. 60 Min.) · Auswahlgalerie · 1 retuschiertes Bild digital |
| **Premium** | mehrere Lieblingsmotive | mehr retuschierte Bilder · Varianten · optionale Print/Leinwand-Add-ons |
| **Deluxe** | „Alles drin" | größere Auswahl · mehr Retusche · ideal für Familien/Meilensteine |

## Hochzeiten – ungestellt, aber geführt
Wir lieben echte Momente – und wir geben genau dann Anleitung, wenn ihr sie braucht (Paarportraits, Gruppen, Familienbilder).
Wasser, Kaffee & Tee sind da – auf Wunsch auch Bier oder Prosecco. Die fertigen Bilder liefern wir immer über eine private, passwortgeschützte Online-Galerie aus der Cloud.

## Ablauf – so läuft euer Shooting
1. **Kurzbriefing:** wer kommt, welche Kombinationen sind wichtig, welche Stimmung wollt ihr?
2. **Ankommen & Outfit-Check:** wir stimmen Farben ab und geben Mini‑Tipps.
3. **Shooting mit Anleitung:** Gesamtmotiv, Teilgruppen, Einzelportraits – locker geführt.
4. **Auswahl:** Wenn es zeitlich passt, zeigen wir häufig noch am selben Tag eine Auswahl (IPS). Wenn es der letzte Termin ist, kommt die Auswahl bequem online.
5. **Retusche & Lieferung:** Die fertigen Bilder liefern wir immer über eine private, passwortgeschützte Online-Galerie aus der Cloud.

## Mini‑FAQ
**Wie lange dauert das Shooting?**
Meist ca. 60 Minuten – mit genug Zeit für die wichtigsten Motive.

**Dürfen Haustiere mit?**
Ja. Kurz vorher Bescheid geben, dann planen wir entspannt.

**Wann bekommen wir die Bilder?**
Auswahl je nach Terminlage schnell; final nach Retusche bequem über die Cloud.`
  },

  'immobilien-fotografie-wien': {
    title: 'Immobilienfotografie in Wien | New Age Fotografie',
    metaDescription: 'Immobilienfotografie in Wien – Licht, Raumgefühl, saubere Perspektiven. Professionelle Immobilienfotos für Makler und Eigentümer. Jetzt anfragen!',
    h1: 'Immobilienfotografie in Wien',
    markdown: `## Was ihr erwarten könnt
- **Freundliche Anleitung** statt Unsicherheit vor der Kamera
- **Weiches, professionelles Licht** (Octa‑Softboxen) für natürliche Hauttöne
- **Persönlichkeit im Bild:** Bringt gern persönliche Dinge mit: Spielzeug, Hobbys, Instrumente, Lieblingsbuch – das macht eure Bilder einzigartig.
- **Flexibel mit Menschen & Tieren:** Haustiere sind willkommen – gebt uns kurz vorher Bescheid, dann planen wir eine kleine „Pet-Pause" ein.

## Pakete & Optionen
| Paket | Ideal für | Inklusive |
|---|---|---|
| **Basic** | ein Hauptmotiv | Shooting (ca. 60 Min.) · Auswahlgalerie · 1 retuschiertes Bild digital |
| **Premium** | mehrere Lieblingsmotive | mehr retuschierte Bilder · Varianten · optionale Print/Leinwand-Add-ons |
| **Deluxe** | „Alles drin" | größere Auswahl · mehr Retusche · ideal für Familien/Meilensteine |

## Immobilienfotografie – was zählt wirklich
Immobilien verkaufen über Vertrauen. Gute Bilder zeigen:
- Licht, Raumgefühl, Linienführung
- saubere Perspektiven ohne „schiefe Wände"
- Details, die Wertigkeit kommunizieren

Wir liefern strukturiert, damit Makler:innen und Eigentümer:innen sofort publizieren können.

## Ablauf – so läuft euer Shooting
1. **Kurzbriefing:** wer kommt, welche Kombinationen sind wichtig, welche Stimmung wollt ihr?
2. **Ankommen & Outfit-Check:** wir stimmen Farben ab und geben Mini‑Tipps.
3. **Shooting mit Anleitung:** Gesamtmotiv, Teilgruppen, Einzelportraits – locker geführt.
4. **Auswahl:** Wenn es zeitlich passt, zeigen wir häufig noch am selben Tag eine Auswahl (IPS). Wenn es der letzte Termin ist, kommt die Auswahl bequem online.
5. **Retusche & Lieferung:** Die fertigen Bilder liefern wir immer über eine private, passwortgeschützte Online-Galerie aus der Cloud.

## Mini‑FAQ
**Wie lange dauert das Shooting?**
Meist ca. 60 Minuten – mit genug Zeit für die wichtigsten Motive.

**Dürfen Haustiere mit?**
Ja. Kurz vorher Bescheid geben, dann planen wir entspannt.

**Wann bekommen wir die Bilder?**
Auswahl je nach Terminlage schnell; final nach Retusche bequem über die Cloud.`
  },

  'portrait-fotografie-wien': {
    title: 'Portraitfotografie in Wien | New Age Fotografie',
    metaDescription: 'Portraitfotografie in Wien – Persönlichkeit statt Pose. Ehrliche Portraits mit weichem Studio-Licht. Professionelle Portraitfotos. Jetzt Termin buchen!',
    h1: 'Portraitfotografie in Wien',
    markdown: `## Was ihr erwarten könnt
- **Freundliche Anleitung** statt Unsicherheit vor der Kamera
- **Weiches, professionelles Licht** (Octa‑Softboxen) für natürliche Hauttöne
- **Persönlichkeit im Bild:** Bringt gern persönliche Dinge mit: Spielzeug, Hobbys, Instrumente, Lieblingsbuch – das macht eure Bilder einzigartig.
- **Flexibel mit Menschen & Tieren:** Haustiere sind willkommen – gebt uns kurz vorher Bescheid, dann planen wir eine kleine „Pet-Pause" ein.

## Pakete & Optionen
| Paket | Ideal für | Inklusive |
|---|---|---|
| **Basic** | ein Hauptmotiv | Shooting (ca. 60 Min.) · Auswahlgalerie · 1 retuschiertes Bild digital |
| **Premium** | mehrere Lieblingsmotive | mehr retuschierte Bilder · Varianten · optionale Print/Leinwand-Add-ons |
| **Deluxe** | „Alles drin" | größere Auswahl · mehr Retusche · ideal für Familien/Meilensteine |

## Portraitfotografie – Persönlichkeit statt Pose
Ein gutes Portrait ist nicht „perfekt". Es ist ehrlich. Wir arbeiten mit kleinen Anweisungen und Micro‑Bewegungen, damit Ausdruck entsteht – nicht ein gezwungenes Lächeln.

## Ablauf – so läuft euer Shooting
1. **Kurzbriefing:** wer kommt, welche Kombinationen sind wichtig, welche Stimmung wollt ihr?
2. **Ankommen & Outfit-Check:** wir stimmen Farben ab und geben Mini‑Tipps.
3. **Shooting mit Anleitung:** Gesamtmotiv, Teilgruppen, Einzelportraits – locker geführt.
4. **Auswahl:** Wenn es zeitlich passt, zeigen wir häufig noch am selben Tag eine Auswahl (IPS). Wenn es der letzte Termin ist, kommt die Auswahl bequem online.
5. **Retusche & Lieferung:** Die fertigen Bilder liefern wir immer über eine private, passwortgeschützte Online-Galerie aus der Cloud.

## Mini‑FAQ
**Wie lange dauert das Shooting?**
Meist ca. 60 Minuten – mit genug Zeit für die wichtigsten Motive.

**Dürfen Haustiere mit?**
Ja. Kurz vorher Bescheid geben, dann planen wir entspannt.

**Wann bekommen wir die Bilder?**
Auswahl je nach Terminlage schnell; final nach Retusche bequem über die Cloud.`
  },

  'produkt-fotografie-wien': {
    title: 'Produktfotografie in Wien | New Age Fotografie',
    metaDescription: 'Produktfotografie in Wien – professionelle Produktbilder für E-Commerce, Kataloge und Marketing. Saubere Freisteller und Lifestyle-Shots.',
    h1: 'Produktfotografie in Wien',
    markdown: `## Was ihr erwarten könnt
- **Freundliche Anleitung** statt Unsicherheit vor der Kamera
- **Weiches, professionelles Licht** (Octa‑Softboxen) für natürliche Hauttöne
- **Persönlichkeit im Bild:** Bringt gern persönliche Dinge mit: Spielzeug, Hobbys, Instrumente, Lieblingsbuch – das macht eure Bilder einzigartig.
- **Flexibel mit Menschen & Tieren:** Haustiere sind willkommen – gebt uns kurz vorher Bescheid, dann planen wir eine kleine „Pet-Pause" ein.

## Pakete & Optionen
| Paket | Ideal für | Inklusive |
|---|---|---|
| **Basic** | ein Hauptmotiv | Shooting (ca. 60 Min.) · Auswahlgalerie · 1 retuschiertes Bild digital |
| **Premium** | mehrere Lieblingsmotive | mehr retuschierte Bilder · Varianten · optionale Print/Leinwand-Add-ons |
| **Deluxe** | „Alles drin" | größere Auswahl · mehr Retusche · ideal für Familien/Meilensteine |

## Produktfotografie – Qualität, die verkauft
Gute Produktbilder zeigen mehr als nur das Produkt. Sie zeigen Wert, Qualität und Anwendung. Wir liefern:
- Saubere Freisteller für E-Commerce
- Lifestyle-Shots für Social Media
- Detail-Aufnahmen für Kataloge

## Ablauf – so läuft euer Shooting
1. **Kurzbriefing:** wer kommt, welche Kombinationen sind wichtig, welche Stimmung wollt ihr?
2. **Ankommen & Outfit-Check:** wir stimmen Farben ab und geben Mini‑Tipps.
3. **Shooting mit Anleitung:** Gesamtmotiv, Teilgruppen, Einzelportraits – locker geführt.
4. **Auswahl:** Wenn es zeitlich passt, zeigen wir häufig noch am selben Tag eine Auswahl (IPS). Wenn es der letzte Termin ist, kommt die Auswahl bequem online.
5. **Retusche & Lieferung:** Die fertigen Bilder liefern wir immer über eine private, passwortgeschützte Online-Galerie aus der Cloud.

## Mini‑FAQ
**Wie lange dauert das Shooting?**
Meist ca. 60 Minuten – mit genug Zeit für die wichtigsten Motive.

**Dürfen Haustiere mit?**
Ja. Kurz vorher Bescheid geben, dann planen wir entspannt.

**Wann bekommen wir die Bilder?**
Auswahl je nach Terminlage schnell; final nach Retusche bequem über die Cloud.`
  },

  'babyfotos-wien': {
    title: 'Babyfotos (3–12 Monate) in Wien | New Age Fotografie',
    metaDescription: 'Babyfotos in Wien für Babys von 3–12 Monaten. Sitzen, Krabbeln, Lachen – wir fangen die Magie ein. Spielerisch und sicher. Jetzt Termin buchen!',
    h1: 'Babyfotos (3–12 Monate) in Wien',
    markdown: `## Was ihr erwarten könnt
- **Freundliche Anleitung** statt Unsicherheit vor der Kamera
- **Weiches, professionelles Licht** (Octa‑Softboxen) für natürliche Hauttöne
- **Persönlichkeit im Bild:** Bringt gern persönliche Dinge mit: Spielzeug, Hobbys, Instrumente, Lieblingsbuch – das macht eure Bilder einzigartig.
- **Flexibel mit Menschen & Tieren:** Haustiere sind willkommen – gebt uns kurz vorher Bescheid, dann planen wir eine kleine „Pet-Pause" ein.

## Pakete & Optionen
| Paket | Ideal für | Inklusive |
|---|---|---|
| **Basic** | ein Hauptmotiv | Shooting (ca. 60 Min.) · Auswahlgalerie · 1 retuschiertes Bild digital |
| **Premium** | mehrere Lieblingsmotive | mehr retuschierte Bilder · Varianten · optionale Print/Leinwand-Add-ons |
| **Deluxe** | „Alles drin" | größere Auswahl · mehr Retusche · ideal für Familien/Meilensteine |

## Babyfotos 3–12 Monate – worauf wir achten
In diesem Alter passiert Magie: Sitzen, Krabbeln, Lachen, erste Persönlichkeiten. Wir planen das Shooting spielerisch:
- kurze Sets, schnelle Wechsel, viele Pausen
- ein sicheres Setup im Studio
- gern mit Lieblingsspielzeug oder Musik

Bringt gern persönliche Dinge mit: Spielzeug, Hobbys, Instrumente, Lieblingsbuch – das macht eure Bilder einzigartig. Haustiere sind willkommen – gebt uns kurz vorher Bescheid, dann planen wir eine kleine „Pet-Pause" ein.

## Ablauf – so läuft euer Shooting
1. **Kurzbriefing:** wer kommt, welche Kombinationen sind wichtig, welche Stimmung wollt ihr?
2. **Ankommen & Outfit-Check:** wir stimmen Farben ab und geben Mini‑Tipps.
3. **Shooting mit Anleitung:** Gesamtmotiv, Teilgruppen, Einzelportraits – locker geführt.
4. **Auswahl:** Wenn es zeitlich passt, zeigen wir häufig noch am selben Tag eine Auswahl (IPS). Wenn es der letzte Termin ist, kommt die Auswahl bequem online.
5. **Retusche & Lieferung:** Die fertigen Bilder liefern wir immer über eine private, passwortgeschützte Online-Galerie aus der Cloud.

## Mini‑FAQ
**Wie lange dauert das Shooting?**
Meist ca. 60 Minuten – mit genug Zeit für die wichtigsten Motive.

**Dürfen Haustiere mit?**
Ja. Kurz vorher Bescheid geben, dann planen wir entspannt.

**Wann bekommen wir die Bilder?**
Auswahl je nach Terminlage schnell; final nach Retusche bequem über die Cloud.`
  },

  'teamfotos-wien': {
    title: 'Team- & Mitarbeiterfotos in Wien | New Age Fotografie',
    metaDescription: 'Team- & Mitarbeiterfotos in Wien – einheitlicher Look fürs ganze Team. Wiederholbares Setup für konsistente Bildsprache. Jetzt Termin buchen!',
    h1: 'Team- & Mitarbeiterfotos in Wien',
    markdown: `## Was ihr erwarten könnt
- **Freundliche Anleitung** statt Unsicherheit vor der Kamera
- **Weiches, professionelles Licht** (Octa‑Softboxen) für natürliche Hauttöne
- **Persönlichkeit im Bild:** Bringt gern persönliche Dinge mit: Spielzeug, Hobbys, Instrumente, Lieblingsbuch – das macht eure Bilder einzigartig.
- **Flexibel mit Menschen & Tieren:** Haustiere sind willkommen – gebt uns kurz vorher Bescheid, dann planen wir eine kleine „Pet-Pause" ein.

## Pakete & Optionen
| Paket | Ideal für | Inklusive |
|---|---|---|
| **Classic** | 1–2 Motive | Shooting (ca. 60 Min.) · Auswahl · professionelle Retusche · digitale Lieferung |
| **Plus** | mehrere Looks / Nutzung für Website + LinkedIn | mehr Motive · Varianten (quer/hoch) · konsistenter Look |
| **Team Add-on** | Mitarbeiter-Set | wiederholbares Setup · einheitliche Bildsprache · effiziente Reihenfolge |

## Einheitlicher Look fürs Team
Wir setzen ein wiederholbares Licht-Setup, damit:
- alle Mitarbeiter:innen im gleichen Stil fotografiert sind
- neue Teammitglieder später nahtlos ergänzt werden können
- Website, Pitchdecks und LinkedIn konsistent wirken

## Ablauf – so läuft euer Shooting
1. **Kurzbriefing:** wer kommt, welche Kombinationen sind wichtig, welche Stimmung wollt ihr?
2. **Ankommen & Outfit-Check:** wir stimmen Farben ab und geben Mini‑Tipps.
3. **Shooting mit Anleitung:** Gesamtmotiv, Teilgruppen, Einzelportraits – locker geführt.
4. **Auswahl:** Wenn es zeitlich passt, zeigen wir häufig noch am selben Tag eine Auswahl (IPS). Wenn es der letzte Termin ist, kommt die Auswahl bequem online.
5. **Retusche & Lieferung:** Die fertigen Bilder liefern wir immer über eine private, passwortgeschützte Online-Galerie aus der Cloud.

## Mini‑FAQ
**Wie lange dauert das Shooting?**
Meist ca. 60 Minuten – mit genug Zeit für die wichtigsten Motive.

**Dürfen Haustiere mit?**
Ja. Kurz vorher Bescheid geben, dann planen wir entspannt.

**Wann bekommen wir die Bilder?**
Auswahl je nach Terminlage schnell; final nach Retusche bequem über die Cloud.`
  },

  'schwangerschaftsfotos-wien': {
    title: 'Schwangerschaftsfotos in Wien | New Age Fotografie',
    metaDescription: 'Schwangerschaftsfotos in Wien – Babybauch-Shooting im Studio. Weiches Licht, entspannte Atmosphäre. Ideal Woche 28–34. Jetzt Termin buchen!',
    h1: 'Schwangerschaftsfotos in Wien',
    markdown: `## Was ihr erwarten könnt
- **Freundliche Anleitung** statt Unsicherheit vor der Kamera
- **Weiches, professionelles Licht** (Octa‑Softboxen) für natürliche Hauttöne
- **Persönlichkeit im Bild:** Bringt gern persönliche Dinge mit: Spielzeug, Hobbys, Instrumente, Lieblingsbuch – das macht eure Bilder einzigartig.
- **Flexibel mit Menschen & Tieren:** Haustiere sind willkommen – gebt uns kurz vorher Bescheid, dann planen wir eine kleine „Pet-Pause" ein.

## Pakete & Optionen
| Paket | Ideal für | Inklusive |
|---|---|---|
| **Basic** | ein Hauptmotiv | Shooting (ca. 60 Min.) · Auswahlgalerie · 1 retuschiertes Bild digital |
| **Premium** | mehrere Lieblingsmotive | mehr retuschierte Bilder · Varianten · optionale Print/Leinwand-Add-ons |
| **Deluxe** | „Alles drin" | größere Auswahl · mehr Retusche · ideal für Familien/Meilensteine |

## Schwangerschaftsfotos – Timing & Styling
Der beste Zeitraum ist oft zwischen **Woche 28–34** (Bauch schön rund, Energie meist stabil). Bringt gern:
- 2–3 Outfits (eng, fließend, elegant)
- Ultraschallbild, kleines Accessoire, Babyschuhe (wenn ihr mögt)

Make-up bieten wir nicht an – bitte kommt, wenn möglich, bereits mit Hair & Make-up. Unser Licht wirkt aber ohnehin sehr schmeichelnd. Wasser, Kaffee & Tee sind da – auf Wunsch auch Bier oder Prosecco.

## Ablauf – so läuft euer Shooting
1. **Kurzbriefing:** wer kommt, welche Kombinationen sind wichtig, welche Stimmung wollt ihr?
2. **Ankommen & Outfit-Check:** wir stimmen Farben ab und geben Mini‑Tipps.
3. **Shooting mit Anleitung:** Gesamtmotiv, Teilgruppen, Einzelportraits – locker geführt.
4. **Auswahl:** Wenn es zeitlich passt, zeigen wir häufig noch am selben Tag eine Auswahl (IPS). Wenn es der letzte Termin ist, kommt die Auswahl bequem online.
5. **Retusche & Lieferung:** Die fertigen Bilder liefern wir immer über eine private, passwortgeschützte Online-Galerie aus der Cloud.

## Mini‑FAQ
**Wie lange dauert das Shooting?**
Meist ca. 60 Minuten – mit genug Zeit für die wichtigsten Motive.

**Dürfen Haustiere mit?**
Ja. Kurz vorher Bescheid geben, dann planen wir entspannt.

**Wann bekommen wir die Bilder?**
Auswahl je nach Terminlage schnell; final nach Retusche bequem über die Cloud.`
  },

  'studio-fotografie-wien': {
    title: 'Studio-Fotografie in Wien | New Age Fotografie',
    metaDescription: 'Studio-Fotografie in Wien – volle Kontrolle über Licht und Look. Zeitlose Portraits, Familien, Business. Professionelles Fotostudio. Jetzt Termin buchen!',
    h1: 'Studio-Fotografie in Wien',
    markdown: `## Was ihr erwarten könnt
- **Freundliche Anleitung** statt Unsicherheit vor der Kamera
- **Weiches, professionelles Licht** (Octa‑Softboxen) für natürliche Hauttöne
- **Persönlichkeit im Bild:** Bringt gern persönliche Dinge mit: Spielzeug, Hobbys, Instrumente, Lieblingsbuch – das macht eure Bilder einzigartig.
- **Flexibel mit Menschen & Tieren:** Haustiere sind willkommen – gebt uns kurz vorher Bescheid, dann planen wir eine kleine „Pet-Pause" ein.

## Pakete & Optionen
| Paket | Ideal für | Inklusive |
|---|---|---|
| **Basic** | ein Hauptmotiv | Shooting (ca. 60 Min.) · Auswahlgalerie · 1 retuschiertes Bild digital |
| **Premium** | mehrere Lieblingsmotive | mehr retuschierte Bilder · Varianten · optionale Print/Leinwand-Add-ons |
| **Deluxe** | „Alles drin" | größere Auswahl · mehr Retusche · ideal für Familien/Meilensteine |

## Studio-Fotografie – volle Kontrolle über Licht und Look
Im Studio steuern wir Licht, Schatten und Hintergrund präzise. Das ist perfekt für:
- zeitlose Portraits
- Kinder & Familien
- Business-Looks mit Wiedererkennungswert

Make-up bieten wir nicht an – bitte kommt, wenn möglich, bereits mit Hair & Make-up. Unser Licht wirkt aber ohnehin sehr schmeichelnd. Bringt gern persönliche Dinge mit: Spielzeug, Hobbys, Instrumente, Lieblingsbuch – das macht eure Bilder einzigartig. Haustiere sind willkommen – gebt uns kurz vorher Bescheid, dann planen wir eine kleine „Pet-Pause" ein.

## Ablauf – so läuft euer Shooting
1. **Kurzbriefing:** wer kommt, welche Kombinationen sind wichtig, welche Stimmung wollt ihr?
2. **Ankommen & Outfit-Check:** wir stimmen Farben ab und geben Mini‑Tipps.
3. **Shooting mit Anleitung:** Gesamtmotiv, Teilgruppen, Einzelportraits – locker geführt.
4. **Auswahl:** Wenn es zeitlich passt, zeigen wir häufig noch am selben Tag eine Auswahl (IPS). Wenn es der letzte Termin ist, kommt die Auswahl bequem online.
5. **Retusche & Lieferung:** Die fertigen Bilder liefern wir immer über eine private, passwortgeschützte Online-Galerie aus der Cloud.

## Mini‑FAQ
**Wie lange dauert das Shooting?**
Meist ca. 60 Minuten – mit genug Zeit für die wichtigsten Motive.

**Dürfen Haustiere mit?**
Ja. Kurz vorher Bescheid geben, dann planen wir entspannt.

**Wann bekommen wir die Bilder?**
Auswahl je nach Terminlage schnell; final nach Retusche bequem über die Cloud.`
  }
};

// Helper to get copy by slug
export function getServicePageCopy(slug: string): ServicePageCopy | undefined {
  return newageCopyMap[slug];
}
