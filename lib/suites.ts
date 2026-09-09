import { photos, type Photo } from './photos';
import type { Lang } from './i18n';
export type SuiteText = { eyebrow: string; tagline: string; taglineEm: string; beds: string; summary: string; description: string[]; highlights: string[] };
export type Suite = {
 slug: string; name: string; short: string; airbnb: string;
 size: number; guests: number; bedrooms: number; baths: number; rating: string;
 cover: number; grid: number[]; photos: Photo[]; text: Record<Lang, SuiteText>;
};
const suite = (s: Omit<Suite, 'photos' | 'airbnb'> & { id: string }): Suite => ({ ...s, airbnb: `https://www.airbnb.gr/rooms/${s.id}`, photos: photos[s.slug] });
export const suites: Suite[] = [
 suite({ id: '1413675725877220701', slug: 'portside', name: 'The Portside', short: 'Portside', size: 50, guests: 3, bedrooms: 1, baths: 1, rating: '4.78', cover: 1, grid: [0, 8, 2, 13, 15], text: {
  en: { eyebrow: 'CONSIDERED COMFORT. LOCAL CHARACTER.', tagline: 'A place to unpack.', taglineEm: 'A reason to linger.', beds: 'Double bed + sofa bed',
   summary: 'Welcome to The Portside. Natural textures, warm wood and a space that feels entirely your own. Settle into a peaceful corner of Kastella, with the life of Piraeus just beyond your door.',
   description: ['A bright open-plan living area brings together the lounge, dining table and kitchen. The sofa converts into a bed for a third guest, and a 40-inch Smart TV keeps evenings easy.', 'The separate bedroom has a large double bed, its own TV and air conditioning, with large windows that fill the room with light and hillside views.', 'The fully equipped kitchen has a capsule coffee machine, filter coffee maker and everything you need to cook. A washing machine sits beneath the bathroom sink for longer stays.'],
   highlights: ['City skyline view', 'Fast Wi-Fi', 'Dedicated workspace', 'Free parking nearby', 'Smart TV', 'Washer & dryer', 'Air conditioning', 'Self check-in'] },
  el: { eyebrow: 'ΑΝΕΣΗ ΜΕ ΦΡΟΝΤΙΔΑ. ΤΟΠΙΚΟΣ ΧΑΡΑΚΤΗΡΑΣ.', tagline: 'Ένας χώρος να ξεδιπλωθείτε.', taglineEm: 'Ένας λόγος να μείνετε.', beds: 'Διπλό κρεβάτι + καναπές-κρεβάτι',
   summary: 'Καλώς ήρθατε στο The Portside. Φυσικές υφές, ζεστό ξύλο και ένας χώρος που είναι εξ ολοκλήρου δικός σας. Βολευτείτε σε μια ήσυχη γωνιά της Καστέλλας, με τη ζωή του Πειραιά λίγο πιο πέρα από την πόρτα σας.',
   description: ['Ένα φωτεινό ενιαίο σαλόνι ενώνει τον καθιστικό χώρο, το τραπέζι και την κουζίνα. Ο καναπές μετατρέπεται σε κρεβάτι για τρίτο επισκέπτη και μια Smart TV 40 ιντσών κάνει τα βράδια εύκολα.', 'Η ξεχωριστή κρεβατοκάμαρα διαθέτει μεγάλο διπλό κρεβάτι, δική της τηλεόραση και κλιματισμό, με μεγάλα παράθυρα που γεμίζουν το δωμάτιο φως και θέα στον λόφο.', 'Η πλήρως εξοπλισμένη κουζίνα έχει μηχανή καφέ με κάψουλες, καφετιέρα φίλτρου και ό,τι χρειάζεστε για να μαγειρέψετε. Πλυντήριο ρούχων κάτω από τον νιπτήρα του μπάνιου για μεγαλύτερες διαμονές.'],
   highlights: ['Θέα στην πόλη', 'Γρήγορο Wi-Fi', 'Χώρος εργασίας', 'Δωρεάν πάρκινγκ κοντά', 'Smart TV', 'Πλυντήριο & στεγνωτήριο', 'Κλιματισμός', 'Αυτόνομο check-in'] } } }),
 suite({ id: '1413658290919459011', slug: 'saronic-pearl', name: 'Saronic Pearl', short: 'Saronic Pearl', size: 40, guests: 2, bedrooms: 1, baths: 1, rating: '5.0', cover: 2, grid: [0, 1, 2, 6, 15], text: {
  en: { eyebrow: 'A BALCONY OVER THE PORT.', tagline: 'Morning coffee.', taglineEm: 'Harbour views.', beds: 'Double bed',
   summary: 'A brand new suite on the hill of Profitis Ilias, made for two. Bright, quiet and finished with care, with a private balcony that looks straight out over the Port of Piraeus.',
   description: ['The open-plan living space flows into a fully equipped kitchen with a refrigerator, washing machine, capsule and filter coffee makers and all the cookware you need.', 'Large windows lead to the private balcony, where a table and chairs make the perfect spot for coffee at sunrise or a glass of wine as the ferries come in.', 'Built-in wardrobes keep everything tidy, mosquito screens keep the evenings comfortable, and fast Wi-Fi keeps you connected.'],
   highlights: ['Private balcony', 'Port views', 'Fast Wi-Fi', 'Dedicated workspace', 'Free parking nearby', 'Private entrance', 'Air conditioning', 'Self check-in'] },
  el: { eyebrow: 'ΕΝΑ ΜΠΑΛΚΟΝΙ ΠΑΝΩ ΑΠΟ ΤΟ ΛΙΜΑΝΙ.', tagline: 'Πρωινός καφές.', taglineEm: 'Θέα στο λιμάνι.', beds: 'Διπλό κρεβάτι',
   summary: 'Μια ολοκαίνουργια σουίτα στον λόφο του Προφήτη Ηλία, φτιαγμένη για δύο. Φωτεινή, ήσυχη και προσεγμένη, με ιδιωτικό μπαλκόνι που βλέπει κατευθείαν στο λιμάνι του Πειραιά.',
   description: ['Ο ενιαίος χώρος του καθιστικού συνεχίζει σε πλήρως εξοπλισμένη κουζίνα με ψυγείο, πλυντήριο, μηχανή καφέ με κάψουλες, καφετιέρα φίλτρου και όλα τα σκεύη που χρειάζεστε.', 'Μεγάλα παράθυρα οδηγούν στο ιδιωτικό μπαλκόνι, όπου ένα τραπέζι με καρέκλες γίνεται το ιδανικό σημείο για καφέ με την ανατολή ή ένα ποτήρι κρασί καθώς μπαίνουν τα πλοία.', 'Εντοιχισμένες ντουλάπες κρατούν τα πάντα τακτοποιημένα, σίτες στα παράθυρα κάνουν τα βράδια άνετα και το γρήγορο Wi-Fi σάς κρατά συνδεδεμένους.'],
   highlights: ['Ιδιωτικό μπαλκόνι', 'Θέα στο λιμάνι', 'Γρήγορο Wi-Fi', 'Χώρος εργασίας', 'Δωρεάν πάρκινγκ κοντά', 'Ιδιωτική είσοδος', 'Κλιματισμός', 'Αυτόνομο check-in'] } } }),
 suite({ id: '1413687850946790114', slug: 'odyssey', name: 'Odyssey Suite', short: 'Odyssey', size: 40, guests: 3, bedrooms: 1, baths: 1, rating: '4.94', cover: 4, grid: [1, 0, 4, 3, 22], text: {
  en: { eyebrow: 'SEA VIEWS. SLOW EVENINGS.', tagline: 'The port below.', taglineEm: 'The sky above.', beds: 'Double bed + sofa bed',
   summary: 'A cosy sea-view suite with its own wooden entrance and a balcony facing the Port of Piraeus. Designed for comfort, it welcomes couples, friends and small families of up to three.',
   description: ['One bright open-plan space combines the living area, sleeping area and kitchen. The sofa faces the balcony and port views and converts into a bed for a third guest.', 'A comfortable double bed sits nearby, and a compact table doubles as a dressing table and laptop-friendly workspace.', 'Step onto the private balcony, furnished with a table and chairs, and watch the harbour change colour through the day. Fast 300 Mbps Wi-Fi throughout.'],
   highlights: ['Private balcony', 'Sea & port views', '300 Mbps Wi-Fi', 'Dedicated workspace', 'Free street parking', 'Private entrance', 'Air conditioning', 'Self check-in'] },
  el: { eyebrow: 'ΘΕΑ ΘΑΛΑΣΣΑ. ΑΡΓΑ ΒΡΑΔΙΑ.', tagline: 'Το λιμάνι από κάτω.', taglineEm: 'Ο ουρανός από πάνω.', beds: 'Διπλό κρεβάτι + καναπές-κρεβάτι',
   summary: 'Μια ζεστή σουίτα με θέα θάλασσα, δική της ξύλινη είσοδο και μπαλκόνι που κοιτά το λιμάνι του Πειραιά. Σχεδιασμένη για άνεση, φιλοξενεί ζευγάρια, παρέες και μικρές οικογένειες έως τρία άτομα.',
   description: ['Ένας φωτεινός ενιαίος χώρος συνδυάζει καθιστικό, χώρο ύπνου και κουζίνα. Ο καναπές βλέπει προς το μπαλκόνι και το λιμάνι και μετατρέπεται σε κρεβάτι για τρίτο επισκέπτη.', 'Ένα άνετο διπλό κρεβάτι βρίσκεται δίπλα, ενώ ένα μικρό τραπέζι λειτουργεί ως τουαλέτα και ως χώρος εργασίας για laptop.', 'Βγείτε στο ιδιωτικό μπαλκόνι, με τραπέζι και καρέκλες, και δείτε το λιμάνι να αλλάζει χρώματα μέσα στη μέρα. Γρήγορο Wi-Fi 300 Mbps σε όλο τον χώρο.'],
   highlights: ['Ιδιωτικό μπαλκόνι', 'Θέα θάλασσα & λιμάνι', 'Wi-Fi 300 Mbps', 'Χώρος εργασίας', 'Δωρεάν πάρκινγκ στον δρόμο', 'Ιδιωτική είσοδος', 'Κλιματισμός', 'Αυτόνομο check-in'] } } }),
];
export const suiteSlugs = suites.map(s => s.slug);
export function findSuite(slug: string | null | undefined) { return suites.find(s => s.slug === slug); }
export const maxGuests = Math.max(...suites.map(s => s.guests));
