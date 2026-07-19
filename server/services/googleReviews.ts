// Live Google reviews via the Places API (New).
//
// Config:
//   GOOGLE_PLACES_API_KEY   — server-side key, API-restricted to Places API (New)
//   GOOGLE_PLACES_PLACE_ID  — optional; defaults to the New Age Fotografie place
//
// Results are cached in-process for CACHE_TTL_MS so we make at most a couple of
// Places calls per hour regardless of site traffic. Every failure path returns
// the last good cache (or null) so the public site always renders.

const PLACE_DETAILS_URL = 'https://places.googleapis.com/v1/places';
const DEFAULT_PLACE_ID = 'ChIJe0ixLcgHbUcR9YJWIq0GuO4'; // New Age Fotografie, Wehrgasse 11A, 1050 Wien
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export interface GoogleReview {
  author: string;
  rating: number;
  text: string;
  when: string; // "8 months ago"
}

export interface GoogleReviewsData {
  rating: number;        // e.g. 4.8
  count: number;         // total userRatingCount, e.g. 306
  mapsUri: string;       // link to the Google listing
  reviews: GoogleReview[];
}

export function isGoogleReviewsConfigured(): boolean {
  return !!process.env.GOOGLE_PLACES_API_KEY;
}

function getPlaceId(): string {
  return (process.env.GOOGLE_PLACES_PLACE_ID || DEFAULT_PLACE_ID).trim();
}

let cache: { at: number; data: GoogleReviewsData | null } | null = null;

/**
 * Fetch (and cache) the studio's Google rating, review count and latest review
 * texts. Returns null when unconfigured or on a hard failure with no cache.
 */
export async function getGoogleReviews(force = false): Promise<GoogleReviewsData | null> {
  if (!isGoogleReviewsConfigured()) return null;

  const now = Date.now();
  if (!force && cache && now - cache.at < CACHE_TTL_MS) return cache.data;

  try {
    const key = process.env.GOOGLE_PLACES_API_KEY as string;
    const fieldMask = [
      'rating',
      'userRatingCount',
      'googleMapsUri',
      'reviews.rating',
      'reviews.text',
      'reviews.originalText',
      'reviews.authorAttribution.displayName',
      'reviews.relativePublishTimeDescription',
    ].join(',');

    const res = await fetch(`${PLACE_DETAILS_URL}/${encodeURIComponent(getPlaceId())}?languageCode=en`, {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': fieldMask,
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.warn(`[googleReviews] Places API ${res.status}: ${body.slice(0, 300)}`);
      return cache?.data ?? null; // serve stale on error
    }

    const json: any = await res.json();
    const reviews: GoogleReview[] = Array.isArray(json.reviews)
      ? json.reviews
          .map((r: any) => ({
            author: r?.authorAttribution?.displayName || 'Google user',
            rating: typeof r?.rating === 'number' ? r.rating : 5,
            text: (r?.text?.text || r?.originalText?.text || '').trim(),
            when: r?.relativePublishTimeDescription || '',
          }))
          .filter((r: GoogleReview) => r.text)
      : [];

    const data: GoogleReviewsData = {
      rating: typeof json.rating === 'number' ? json.rating : 0,
      count: typeof json.userRatingCount === 'number' ? json.userRatingCount : 0,
      mapsUri: json.googleMapsUri || '',
      reviews,
    };

    cache = { at: now, data };
    return data;
  } catch (err: any) {
    console.warn('[googleReviews] fetch failed:', err?.message || err);
    return cache?.data ?? null; // serve stale on error
  }
}
