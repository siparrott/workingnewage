# 12-Month SEO Content Plan — New Age Fotografie (Jun 2026 → May 2027)

**Goal:** grow organic traffic and bookings by building four authoritative topic clusters around the money pages, publishing on a steady cadence, and reinforcing the studio-based positioning in every piece.

---

## Strategy baked in

1. **Pillar → cluster model.** Every article belongs to exactly one pillar, links *up* to its pillar page, and the pillar links *down* to it (via [PillarGuides](../client/src/components/SEO/PillarGuides.tsx)). This concentrates topical authority on the money pages.
2. **Studio-based positioning (non-negotiable).** Family, newborn, baby, maternity and kids = **in-studio**. Only **weddings and corporate/business** are shot on location. No article recommends outdoor family locations. See [[business-model-studio-based]].
3. **Search-intent ladder.** Each cluster covers the full funnel: *informational* (guides, "how/what") → *commercial* ("Preise", "vs", "beste") → *transactional* ("buchen", "Termin"). Informational posts feed the commercial/transactional money pages.
4. **AEO / FAQ schema.** Every post ends with a 3–4 question FAQ block (already rendered as FAQPage JSON-LD) to win answer boxes and AI Overviews.
5. **E-E-A-T signals.** Every post carries the lived-experience proof: *13+ years, 300+ shootings, 4,8 ★ on Google* — first-person, studio-specific, never generic.
6. **Seasonality.** The calendar maps each topic to when Vienna actually searches for it (newborn in winter, Bewerbungsfotos at back-to-school, Gutscheine pre-Christmas, weddings spring/summer).
7. **Steady cadence over dumps.** 3 posts/month, ~1 every 10 days, **scheduled** (`status: SCHEDULED`, `scheduledFor`) rather than published all at once — a sustained freshness signal beats a one-time flood.
8. **Internal-link hygiene.** Every post links to its pillar, 1–2 sibling cluster posts, and one conversion page (`/warteliste`, `/preise/`, or `/kontakt`).

---

## The four pillars & their clusters

### Pillar 1 — [Familienfotos Wien](https://www.newagefotografie.com/familienfotos-wien/)
*Largest cluster, already well-seeded.* Sub-topics / cluster pages: [Neugeborenenfotos](https://www.newagefotografie.com/neugeborenenfotos-wien/) · [Babyfotos](https://www.newagefotografie.com/babyfotos-wien/) · [Schwangerschaftsfotos](https://www.newagefotografie.com/schwangerschaftsfotos-wien/) · [Kinderfotografie](https://www.newagefotografie.com/kinder-fotografie-wien/) · [Familien-Fotoshooting](https://www.newagefotografie.com/familien-fotoshooting-wien/)

### Pillar 2 — [Business Portrait Wien](https://www.newagefotografie.com/business-portrait-wien/)
Cluster pages: [Bewerbungsfotos](https://www.newagefotografie.com/bewerbungsfotos-wien/) · [Teamfotos](https://www.newagefotografie.com/teamfotos-wien/) · [Portraitfotografie](https://www.newagefotografie.com/portrait-fotografie-wien/)

### Pillar 3 — [Hochzeitsfotografie Wien](https://www.newagefotografie.com/hochzeitsfotografie-wien/) *(on-location)*
Cluster pages: [Eventfotografie](https://www.newagefotografie.com/eventfotografie-wien/)

### Pillar 4 — [Studio Fotografie Wien](https://www.newagefotografie.com/studio-fotografie-wien/)
*The studio itself, gift vouchers, commercial.* Cluster pages: [Produktfotografie](https://www.newagefotografie.com/produkt-fotografie-wien/) · [Immobilienfotografie](https://www.newagefotografie.com/immobilien-fotografie-wien/) · [Gutscheine](https://www.newagefotografie.com/vouchers/)

### Already live (do not duplicate)
[Locations](https://www.newagefotografie.com/blog/familienfotos-locations-wien) · [Studio vs. Outdoor](https://www.newagefotografie.com/blog/familienfotos-im-studio-vs-outdoor-in-wien-was-passt-zu-euch) · [Preise & Ablauf](https://www.newagefotografie.com/blog/familienfotos-in-wien-preise-ablauf-perfekte-vorbereitung) · [Outfits](https://www.newagefotografie.com/blog/die-besten-outfits-fuer-familienfotos-in-wien) · [Neugeborenenfotos-Tipps](https://www.newagefotografie.com/blog/tipps-fuer-neugeborenenfotos-wien) · [Schwangerschaftsfotos-Ideen](https://www.newagefotografie.com/blog/schwangerschaftsfotos-in-wien-ideen-kleidung-der-beste-zeitpunkt) · [Businessportraits Preise & Kleidung](https://www.newagefotografie.com/blog/businessportraits-in-wien-preise-kleidung-erfolgstipps-f-r-starke-auftritte)

---

## The 12-month calendar (3 posts/month = 36 articles)

Each title links to its target URL (live once published). **P** = pillar.

### Q3 2026 — Summer: weddings peak, family before holidays, voucher seeding

#### June 2026
- **P3** [Hochzeitsfotograf Wien: Ablauf, Kosten & wie ihr den richtigen findet](https://www.newagefotografie.com/blog/hochzeitsfotograf-wien-ablauf-kosten) — *kw: hochzeitsfotograf wien kosten · commercial*
- **P1** [Familienfotos im Sommer: warum das Studio auch bei 30 °C die beste Wahl ist](https://www.newagefotografie.com/blog/familienfotos-im-sommer-wien-studio) — *kw: familienfotos sommer wien · informational*
- **P4** [Fotoshooting verschenken in Wien: der Gutschein-Guide](https://www.newagefotografie.com/blog/fotoshooting-gutschein-wien-verschenken) — *kw: fotoshooting gutschein wien · transactional*

#### July 2026
- **P3** [Was kostet ein Hochzeitsfotograf in Wien? Preise & Pakete erklärt](https://www.newagefotografie.com/blog/was-kostet-hochzeitsfotograf-wien) — *kw: hochzeitsfotograf wien preise · commercial*
- **P1** [Babyfotos in Wien: der beste Zeitpunkt und wie ein Shooting abläuft](https://www.newagefotografie.com/blog/babyfotos-wien-bester-zeitpunkt-ablauf) — *kw: babyfotos wien · informational → /babyfotos-wien/*
- **P2** [Bewerbungsfoto Wien: was ein gutes Foto 2026 ausmacht](https://www.newagefotografie.com/blog/bewerbungsfoto-wien-was-macht-gutes-foto) — *kw: bewerbungsfoto wien · commercial*

#### August 2026
- **P2** [LinkedIn-Foto in Wien: so wirkt ihr professionell (mit Beispielen)](https://www.newagefotografie.com/blog/linkedin-foto-wien-professionell) — *kw: linkedin foto wien · commercial*
- **P1** [Geschwisterfotos im Studio: Tipps für entspannte Bilder mit mehreren Kindern](https://www.newagefotografie.com/blog/geschwisterfotos-wien-studio-tipps) — *kw: geschwisterfotos wien · informational*
- **P4** [Studio-Fotoshooting in Wien: was euch in unserem Tageslichtstudio erwartet](https://www.newagefotografie.com/blog/studio-fotoshooting-wien-ablauf) — *kw: fotostudio wien · informational → /studio-fotografie-wien/*

### Q4 2026 — Autumn/Winter: back-to-work, corporate, Christmas vouchers

#### September 2026
- **P2** [Bewerbungsfotos zum Jobstart: Termin, Outfit & Vorbereitung](https://www.newagefotografie.com/blog/bewerbungsfotos-wien-jobstart-vorbereitung) — *kw: bewerbungsfotos wien · transactional → /bewerbungsfotos-wien/*
- **P2** [Teamfotos für Unternehmen in Wien: einheitlich, modern, on-location](https://www.newagefotografie.com/blog/teamfotos-wien-unternehmen) — *kw: teamfotos wien · commercial → /teamfotos-wien/*
- **P1** [Herbst-Familienfotos: warme Looks & Outfits fürs Studio](https://www.newagefotografie.com/blog/herbst-familienfotos-wien-outfits) — *kw: familienfotos herbst · informational*

#### October 2026
- **P4** [Wandbild oder digitale Galerie? So holt ihr das Beste aus euren Fotos](https://www.newagefotografie.com/blog/wandbild-oder-digitale-galerie-wien) — *kw: fotos drucken lassen wien · commercial*
- **P2** [Headshots für Selbstständige in Wien: ein Foto, das Vertrauen schafft](https://www.newagefotografie.com/blog/headshots-selbststaendige-wien) — *kw: headshots wien · commercial*
- **P1** [Familienfotos mit Baby & Großeltern: das Mehrgenerationen-Shooting](https://www.newagefotografie.com/blog/mehrgenerationen-fotoshooting-wien) — *kw: mehrgenerationenfoto wien · informational*

#### November 2026
- **P4** [Weihnachtsgutschein für ein Fotoshooting: das Geschenk, das bleibt](https://www.newagefotografie.com/blog/weihnachtsgutschein-fotoshooting-wien) — *kw: weihnachtsgutschein fotoshooting · transactional → /vouchers/*
- **P1** [Weihnachtskarten-Fotos in Wien: Familienbilder rechtzeitig zum Fest](https://www.newagefotografie.com/blog/weihnachtskarten-familienfotos-wien) — *kw: weihnachtsfotos familie wien · informational*
- **P2** [Corporate-Fotografie zum Jahresende: Website & Team-Update](https://www.newagefotografie.com/blog/corporate-fotografie-wien-jahresende) — *kw: corporate fotografie wien · commercial*

#### December 2026
- **P4** [Last-Minute-Gutschein: Fotoshooting verschenken noch vor Weihnachten](https://www.newagefotografie.com/blog/last-minute-gutschein-fotoshooting-wien) — *kw: last minute gutschein wien · transactional*
- **P1** [Babys erstes Jahr: Neugeborenen-, Baby- & Meilenstein-Fotos](https://www.newagefotografie.com/blog/babys-erstes-jahr-fotos-wien) — *kw: meilenstein fotos baby · informational → /babyfotos-wien/*
- **P3** [Standesamtliche Hochzeit in Wien fotografieren lassen: kompakt & schön](https://www.newagefotografie.com/blog/standesamt-hochzeit-wien-fotograf) — *kw: standesamt wien fotograf · commercial*

### Q1 2027 — New year: newborns, career restart, couples

#### January 2027
- **P1** [Neugeborenenfotos im Winter: warm, sicher und entspannt im Studio](https://www.newagefotografie.com/blog/neugeborenenfotos-winter-wien) — *kw: neugeborenenfotos wien · informational → /neugeborenenfotos-wien/*
- **P2** [Neues Jahr, neuer Job: Bewerbungsfotos, die auffallen](https://www.newagefotografie.com/blog/bewerbungsfotos-neues-jahr-wien) — *kw: bewerbungsfotos wien · transactional*
- **P1** [Schwangerschaftsfotos in Wien: der ideale Zeitpunkt im Studio](https://www.newagefotografie.com/blog/schwangerschaftsfotos-idealer-zeitpunkt-wien) — *kw: schwangerschaftsfotos wien zeitpunkt · informational → /schwangerschaftsfotos-wien/*

#### February 2027
- **P3** [Pärchenfotos in Wien zum Valentinstag: locker & echt](https://www.newagefotografie.com/blog/paarfotos-wien-valentinstag) — *kw: paarfotos wien · informational*
- **P2** [Bewerbungsfoto-Knigge: Mimik, Haltung & Kleidung](https://www.newagefotografie.com/blog/bewerbungsfoto-knigge-wien) — *kw: bewerbungsfoto tipps · informational*
- **P1** [Kinderfotografie in Wien: natürliche Portraits ohne Stress](https://www.newagefotografie.com/blog/kinderfotografie-wien-natuerlich) — *kw: kinderfotos wien · commercial → /kinder-fotografie-wien/*

#### March 2027
- **P1** [Frühlings-Familienfotos: helle, frische Studio-Looks](https://www.newagefotografie.com/blog/fruehling-familienfotos-wien) — *kw: familienfotos frühling wien · informational*
- **P3** [Hochzeitssaison 2027: warum ihr euren Fotografen jetzt bucht](https://www.newagefotografie.com/blog/hochzeitsfotograf-wien-2027-buchen) — *kw: hochzeitsfotograf 2027 wien · transactional → /hochzeitsfotografie-wien/*
- **P2** [Teamfotos neu gedacht: authentisch statt steif](https://www.newagefotografie.com/blog/teamfotos-wien-authentisch) — *kw: teamfotos wien · commercial*

### Q2 2027 — Spring/early summer: maternity, family, communions, weddings

#### April 2027
- **P1** [Erstkommunion & Firmung in Wien fotografieren: festliche Studio-Portraits](https://www.newagefotografie.com/blog/erstkommunion-fotos-wien) — *kw: erstkommunion fotos wien · commercial*
- **P1** [Maternity-Shooting: Outfits & Ideen für werdende Eltern](https://www.newagefotografie.com/blog/maternity-shooting-outfits-wien) — *kw: babybauch fotoshooting wien · informational → /schwangerschaftsfotos-wien/*
- **P4** [Produktfotografie für kleine Wiener Marken: clean & verkaufsstark](https://www.newagefotografie.com/blog/produktfotografie-wien-kleine-marken) — *kw: produktfotografie wien · commercial → /produkt-fotografie-wien/*

#### May 2027
- **P1** [Muttertag in Wien: Fotoshooting als Geschenk für Mama](https://www.newagefotografie.com/blog/muttertag-fotoshooting-wien) — *kw: muttertag geschenk fotoshooting · transactional*
- **P3** [Eure Hochzeitsreportage in Wien: Ablauf eines ganzen Tages](https://www.newagefotografie.com/blog/hochzeitsreportage-wien-ablauf) — *kw: hochzeitsreportage wien · informational → /eventfotografie-wien/*
- **P1** [Familienfotos: die häufigsten Fragen vor dem Studio-Shooting](https://www.newagefotografie.com/blog/familienfotos-wien-haeufige-fragen) — *kw: familienfotos wien faq · informational → /familienfotos-wien/*

---

## Cluster balance (36 new posts)

| Pillar | New posts | Share |
|---|---|---|
| P1 Familienfotos (+ newborn/baby/maternity/kids) | 16 | 44 % |
| P2 Business Portrait | 9 | 25 % |
| P3 Hochzeit / Event | 6 | 17 % |
| P4 Studio / Vouchers / Commercial | 5 | 14 % |

Weighted toward the family pillar because it has the most search volume and the highest booking intent for a studio.

## Measurement (review monthly in Search Console)

- Impressions & clicks per cluster (filter by URL path).
- Average position for each pillar's head term (`familienfotos wien`, `business portrait wien`, `hochzeitsfotograf wien`, `fotostudio wien`).
- Internal-link coverage: every new post links up to its pillar + 1–2 siblings.
- Conversions: `/warteliste` and voucher page entrances from blog.

## Production & publishing workflow

1. Draft as `content/articles/<slug>.md` (source of truth).
2. Convert to clean `<slug>.html` + `<slug>.json` (meta).
3. `npx tsx -r dotenv/config publish-article.ts <slug>` → upserts to Neon.
4. For future-dated posts, set `publishAt` in the JSON → scheduled, not live immediately.
5. Add the URL to [sitemap.xml](../client/public/sitemap.xml) and the prerender list in [vite.config.ts](../vite.config.ts).
