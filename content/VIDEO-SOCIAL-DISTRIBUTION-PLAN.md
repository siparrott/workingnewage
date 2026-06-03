# Plan — BTS video reels, social snippets & Zernio distribution

Goal: from every blog post, automatically produce **BTS/reel video clips** and
**platform-specific social posts** that link back to the original post, and
publish them through the **Zernio API**. Mirrors the working video workflow in
the other app — final format locked once the **handoff document** lands.

## Why this is a natural fit here
The idea-mode pipeline already captures, per post, exactly the raw material a
reel/social pack needs:
- the **photos** (cover + up to 5, now multi-upload in the editor),
- **OpenAI Vision** scene descriptions + alt text per image,
- **EXIF/camera** details (authenticity B-roll captions),
- the **user context** (location, timing, people, occasion, commentary),
- the finished **article** (title, excerpt, body) + canonical URL.

So we don't start from scratch — we assemble a "content pack" from data we
already store in `idea_data` + the post.

## Architecture (per post → a publishable pack)
```
blog post (+ idea_data)
   ├─ Social Snippet Generator  → captions per channel (IG / FB / LinkedIn),
   │                              angle-driven (hook/story/controversy/nostalgia),
   │                              hashtags, link-back w/ UTM
   ├─ Reel Storyboard Generator → shotlist/script from the post's images +
   │                              context (for the video workflow / handoff format)
   └─ Zernio Connector          → upload media + schedule/publish to channels,
                                  return permalinks, store back on the post
```

## Phases
1. **Social Snippet Generator** (service, reuses `blogIdeaWriter` patterns):
   input = post + idea_data; output = `{ instagram, facebook, linkedin }` captions,
   each opening with one of the proven angles, ending with a CTA + the post URL
   (`?utm_source=<channel>&utm_medium=social&utm_campaign=blog`). 1–2 OpenAI calls.
2. **Reel storyboard generator**: turn the post's images + `context.commentary`
   into a short shotlist/script (hook → 3–5 frames → CTA) in *exactly the format
   the handoff document specifies* (aspect ratio, length, caption/CTA placement,
   branding, music cue fields). Output as structured JSON the video app consumes.
3. **Zernio connector** (`server/services/zernio.ts`): auth, media upload,
   create/schedule post per channel, poll status, write permalinks back to the
   post. *Blocked on the handoff doc.*
4. **Scheduling tie-in**: when a blog post flips `SCHEDULED → PUBLISHED` (the
   existing hourly cron), trigger the pack: generate snippets, hand the storyboard
   to the video workflow, and queue Zernio publication so social goes live *with*
   the post and links back to it.

## Admin UX (idea-mode editor, new tab)
A "Social & Video" tab on a DRAFT/PUBLISHED post: **Generate social pack** →
preview/edit per-channel captions + the reel storyboard → **Send to Zernio**
(now or scheduled). Permalinks shown once published.

## What I need from the handoff document to finalise
- **Zernio API:** base URL, auth (key/OAuth), media-upload endpoint + limits,
  create-post & schedule-post endpoints, supported channels, rate limits,
  webhook/status model.
- **Reel format spec:** aspect ratio(s) (9:16 / 1:1), target length, hook/caption/
  CTA placement, safe areas, branding (logo, fonts, colours), music handling,
  and the exact input schema the video app expects.
- **Account/secrets:** `ZERNIO_API_KEY` (+ any channel IDs) as env vars.

## Reuse / consistency
- Angles + voice come from [WRITING-GUIDELINES.md](WRITING-GUIDELINES.md) — the
  same "13 years of real experience" tone, now in 15-second form.
- Every snippet links back to the canonical post (topical-authority loop +
  measurable referral traffic via UTM).
- Studio positioning still applies (family/baby/maternity = studio).

## Open decision
Whether the video render happens **in the other app** (we hand off a storyboard +
assets and Zernio publishes the finished file) or we add rendering here. Default
assumption until the handoff: **render stays in your proven workflow**; this app
produces the pack + handles Zernio distribution.
