import type { Lang } from './i18n';
export type Review = { author: string; when: string; text: string; rating?: number; avatar?: string; url?: string };
export type ReviewsPayload = { rating: number; count: number; reviews: Review[]; url: string; writeUrl: string; live: boolean };
/** Google Business Profile name, used for the Maps links until GOOGLE_PLACE_ID is configured. */
export const GOOGLE_BUSINESS_NAME = 'Green and Blue Luxury Suites Airbnb Ενοικιαζόμενα Διαμερίσματα Πειραιάς Καστέλλα';
export const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Green and Blue Luxury Suites Kastella Piraeus')}`;
/**
 * Snapshot of the Google reviews (taken 2026-09-10) shown until the live Places API is configured.
 * Google shows these as excerpts; the owner can edit or reorder them here.
 */
const snapshot: Record<Lang, Review[]> = {
 en: [
  { author: 'Elli Eleftheria', when: 'a month ago', text: 'We rented two apartments to get ready as bride and groom before our wedding and the experience exceeded all our expectations. From the very first moment, Vasso and Lefteris welcomed us with such warmth, as if they had known us for years.' },
  { author: 'Kay Kuhlen', when: 'a year ago', text: 'This is truly a gem among the accommodations I\'ve ever stayed in. Centrally located, furnished to a very high standard, spotlessly clean, impeccably maintained, and decorated with exquisite taste. Super-fast internet, a fantastic bathroom.' },
  { author: 'Dallas Texas', when: 'a year ago', text: 'Located in the hills, having a car is a big advantage. The accommodation includes a queen bed and a sofa bed. The owners are kind and welcoming.' },
 ],
 el: [
  { author: 'Elli Eleftheria', when: 'πριν από έναν μήνα', text: 'Νοικιάσαμε δύο διαμερίσματα για να ετοιμαστούμε ως νύφη και γαμπρός πριν τον γάμο μας και η εμπειρία ξεπέρασε κάθε προσδοκία. Από την πρώτη στιγμή, η Βάσω και ο Λευτέρης μάς υποδέχθηκαν με τόση ζεστασιά, σαν να μας ήξεραν χρόνια.' },
  { author: 'Kay Kuhlen', when: 'πριν από έναν χρόνο', text: 'Ένα πραγματικό διαμάντι ανάμεσα στα καταλύματα όπου έχω μείνει. Κεντρικό, επιπλωμένο σε πολύ υψηλό επίπεδο, πεντακάθαρο, άψογα συντηρημένο και διακοσμημένο με εξαιρετικό γούστο. Πολύ γρήγορο ίντερνετ, υπέροχο μπάνιο.' },
  { author: 'Dallas Texas', when: 'πριν από έναν χρόνο', text: 'Βρίσκεται στον λόφο, οπότε το αυτοκίνητο είναι μεγάλο πλεονέκτημα. Το κατάλυμα έχει διπλό κρεβάτι και καναπέ-κρεβάτι. Οι ιδιοκτήτες είναι ευγενικοί και φιλόξενοι.' },
 ],
};
export function snapshotReviews(lang: Lang): ReviewsPayload {
 return { rating: 4.7, count: 6, reviews: snapshot[lang], url: mapsSearchUrl, writeUrl: mapsSearchUrl, live: false };
}
