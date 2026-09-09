import { env } from 'cloudflare:workers';
import { langOf } from '@/lib/booking';
import { snapshotReviews, type Review, type ReviewsPayload } from '@/lib/reviews';
import type { Lang } from '@/lib/i18n';
type PlaceResponse = { rating?: number; userRatingCount?: number; googleMapsUri?: string; reviews?: { rating?: number; relativePublishTimeDescription?: string; text?: { text?: string }; originalText?: { text?: string }; authorAttribution?: { displayName?: string; photoUri?: string; uri?: string } }[] };
const TTL = 6 * 60 * 60 * 1000;
const cache = new Map<Lang, { at: number; data: ReviewsPayload }>();
/**
 * GET /api/reviews?lang=en|el → Google rating, review count and the latest reviews.
 * Uses the Places API (New) when GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID are set, cached for six hours; otherwise the snapshot in lib/reviews.ts.
 */
export async function GET(r: Request) {
 const lang = langOf(new URL(r.url).searchParams.get('lang'));
 const { GOOGLE_PLACES_API_KEY: key, GOOGLE_PLACE_ID: placeId } = env as unknown as { GOOGLE_PLACES_API_KEY?: string; GOOGLE_PLACE_ID?: string };
 const headers = { 'Cache-Control': 'public, max-age=3600' };
 const fallback = snapshotReviews(lang);
 if (!key || !placeId) return Response.json(fallback, { headers });
 fallback.url = `https://www.google.com/maps/place/?q=place_id:${placeId}`;
 fallback.writeUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;
 const hit = cache.get(lang);
 if (hit && Date.now() - hit.at < TTL) return Response.json(hit.data, { headers });
 try {
  const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=${lang}`, { headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews' } });
  if (!res.ok) throw new Error(`Places API ${res.status}`);
  const place = await res.json() as PlaceResponse;
  const reviews: Review[] = (place.reviews || []).filter(v => v.text?.text).map(v => ({ author: v.authorAttribution?.displayName || 'Google user', avatar: v.authorAttribution?.photoUri, url: v.authorAttribution?.uri, when: v.relativePublishTimeDescription || '', text: v.text!.text!, rating: v.rating }));
  const data: ReviewsPayload = { rating: place.rating ?? fallback.rating, count: place.userRatingCount ?? fallback.count, reviews: reviews.length ? reviews : fallback.reviews, url: place.googleMapsUri || fallback.url, writeUrl: fallback.writeUrl, live: true };
  cache.set(lang, { at: Date.now(), data });
  return Response.json(data, { headers });
 } catch (e) { console.error('reviews', e); return Response.json(fallback, { headers }); }
}
