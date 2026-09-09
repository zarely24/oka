import { photos, type Photo } from './photos';
export type Suite = {
 slug: string; name: string; short: string; tagline: string; taglineEm: string; eyebrow: string; airbnb: string;
 size: number; guests: number; bedrooms: number; beds: string; baths: number; rating: string;
 summary: string; description: string[]; highlights: string[]; cover: number; grid: number[]; photos: Photo[];
};
const suite = (s: Omit<Suite, 'photos' | 'airbnb'> & { id: string }): Suite => ({ ...s, airbnb: `https://www.airbnb.gr/rooms/${s.id}`, photos: photos[s.slug] });
export const suites: Suite[] = [
 suite({ id: '1413675725877220701', slug: 'portside', name: 'The Portside', short: 'Portside', eyebrow: 'CONSIDERED COMFORT. LOCAL CHARACTER.', tagline: 'A place to unpack.', taglineEm: 'A reason to linger.', size: 50, guests: 3, bedrooms: 1, beds: 'Double bed + sofa bed', baths: 1, rating: '4.78',
  summary: 'Welcome to The Portside. Natural textures, warm wood and a space that feels entirely your own. Settle into a peaceful corner of Kastella, with the life of Piraeus just beyond your door.',
  description: ['A bright open-plan living area brings together the lounge, dining table and kitchen. The sofa converts into a bed for a third guest, and a 40-inch Smart TV keeps evenings easy.', 'The separate bedroom has a large double bed, its own TV and air conditioning, with large windows that fill the room with light and hillside views.', 'The fully equipped kitchen has a capsule coffee machine, filter coffee maker and everything you need to cook. A washing machine sits beneath the bathroom sink for longer stays.'],
  highlights: ['City skyline view', 'Fast Wi-Fi', 'Dedicated workspace', 'Free parking nearby', 'Smart TV', 'Washer & dryer', 'Air conditioning', 'Self check-in'],
  cover: 1, grid: [0, 8, 2, 13, 15] }),
 suite({ id: '1413658290919459011', slug: 'saronic-pearl', name: 'Saronic Pearl', short: 'Saronic Pearl', eyebrow: 'A BALCONY OVER THE PORT.', tagline: 'Morning coffee.', taglineEm: 'Harbour views.', size: 40, guests: 2, bedrooms: 1, beds: 'Double bed', baths: 1, rating: '5.0',
  summary: 'A brand new suite on the hill of Profitis Ilias, made for two. Bright, quiet and finished with care, with a private balcony that looks straight out over the Port of Piraeus.',
  description: ['The open-plan living space flows into a fully equipped kitchen with a refrigerator, washing machine, capsule and filter coffee makers and all the cookware you need.', 'Large windows lead to the private balcony, where a table and chairs make the perfect spot for coffee at sunrise or a glass of wine as the ferries come in.', 'Built-in wardrobes keep everything tidy, mosquito screens keep the evenings comfortable, and fast Wi-Fi keeps you connected.'],
  highlights: ['Private balcony', 'Port views', 'Fast Wi-Fi', 'Dedicated workspace', 'Free parking nearby', 'Private entrance', 'Air conditioning', 'Self check-in'],
  cover: 2, grid: [0, 1, 2, 6, 15] }),
 suite({ id: '1413687850946790114', slug: 'odyssey', name: 'Odyssey Suite', short: 'Odyssey', eyebrow: 'SEA VIEWS. SLOW EVENINGS.', tagline: 'The port below.', taglineEm: 'The sky above.', size: 40, guests: 3, bedrooms: 1, beds: 'Double bed + sofa bed', baths: 1, rating: '4.94',
  summary: 'A cosy sea-view suite with its own wooden entrance and a balcony facing the Port of Piraeus. Designed for comfort, it welcomes couples, friends and small families of up to three.',
  description: ['One bright open-plan space combines the living area, sleeping area and kitchen. The sofa faces the balcony and port views and converts into a bed for a third guest.', 'A comfortable double bed sits nearby, and a compact table doubles as a dressing table and laptop-friendly workspace.', 'Step onto the private balcony, furnished with a table and chairs, and watch the harbour change colour through the day. Fast 300 Mbps Wi-Fi throughout.'],
  highlights: ['Private balcony', 'Sea & port views', '300 Mbps Wi-Fi', 'Dedicated workspace', 'Free street parking', 'Private entrance', 'Air conditioning', 'Self check-in'],
  cover: 4, grid: [1, 0, 4, 3, 22] }),
];
export const suiteSlugs = suites.map(s => s.slug);
export function findSuite(slug: string | null | undefined) { return suites.find(s => s.slug === slug); }
export const maxGuests = Math.max(...suites.map(s => s.guests));
