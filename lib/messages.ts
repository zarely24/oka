import type { Lang } from './i18n';
/** User-facing API messages, keyed by code so the routes can answer in the visitor's language. */
const en = {
 invalidDates: 'Choose valid dates.',
 stayRange: (max: number) => `Choose a future stay of 1–${max} nights.`,
 unknownSuite: 'Choose one of our suites.',
 contactDetails: 'Please check your contact details and guest count.',
 guestLimit: (suite: string, n: number) => `${suite} welcomes up to ${n} guests.`,
 taken: 'These dates are no longer available. Please choose another stay.',
 saveFailed: 'We could not save your request. Please try again or call us.',
 checkFailed: 'Availability could not be checked. Please try again.',
 invalidRequest: 'Invalid request.',
};
const el: typeof en = {
 invalidDates: 'Επιλέξτε έγκυρες ημερομηνίες.',
 stayRange: (max: number) => `Επιλέξτε μελλοντική διαμονή 1–${max} νυχτών.`,
 unknownSuite: 'Επιλέξτε μία από τις σουίτες μας.',
 contactDetails: 'Ελέγξτε τα στοιχεία επικοινωνίας και τον αριθμό επισκεπτών.',
 guestLimit: (suite: string, n: number) => `Το ${suite} φιλοξενεί έως ${n} επισκέπτες.`,
 taken: 'Οι ημερομηνίες αυτές δεν είναι πλέον διαθέσιμες. Επιλέξτε άλλη διαμονή.',
 saveFailed: 'Δεν ήταν δυνατή η αποθήκευση του αιτήματος. Δοκιμάστε ξανά ή καλέστε μας.',
 checkFailed: 'Δεν ήταν δυνατός ο έλεγχος διαθεσιμότητας. Δοκιμάστε ξανά.',
 invalidRequest: 'Μη έγκυρο αίτημα.',
};
export const messages: Record<Lang, typeof en> = { en, el };
export type MessageCode = keyof typeof en;
