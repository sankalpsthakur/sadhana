// Yatra cohort + Sthiti journal product identifiers.
//
// The Yatra cohort is sold as a non-renewing subscription per the App Store
// Connect product type guidance: each quarterly cohort is a discrete twelve-week
// container with a defined start and end, not an auto-renewing membership.
//
// The Sthiti journal is a one-off consumable purchase that ships a physical
// hardcover practice journal. The shipping address form is collected after the
// StoreKit transaction completes; the IAP guards the offer and the physical
// fulfilment is handled by a print-on-demand partner (see fulfilment notes).

export const SADHANA_YATRA_QUARTERLY_PRODUCT_ID =
  'com.sankalpsthakur.sadhana.yatra.quarterly';

export const SADHANA_STHITI_JOURNAL_PRODUCT_ID =
  'com.sankalpsthakur.sadhana.journal.sthiti';

export const SADHANA_YATRA_PRODUCT_IDS = [
  SADHANA_YATRA_QUARTERLY_PRODUCT_ID,
] as const;

export const SADHANA_JOURNAL_PRODUCT_IDS = [
  SADHANA_STHITI_JOURNAL_PRODUCT_ID,
] as const;

export type SadhanaYatraProductId =
  (typeof SADHANA_YATRA_PRODUCT_IDS)[number];

export type SadhanaJournalProductId =
  (typeof SADHANA_JOURNAL_PRODUCT_IDS)[number];

export const SADHANA_YATRA_COPY = {
  priceDisplay: '$149',
  durationLine: 'Twelve weeks. Quarterly. With a cohort leader.',
  whatYouReceive: [
    'Weekly theme and reading, delivered each Monday.',
    'A small group of practitioners walking the same arc.',
    'Two live calls with the cohort leader during the season.',
    'Closing ceremony at the twelve-week mark.',
  ],
} as const;

export const SADHANA_STHITI_JOURNAL_COPY = {
  priceDisplay: '$39',
  hero: 'Yours when Sthiti is established.',
  description:
    'A hardcover practice journal, lay-flat binding, dot-grid pages, ribbon marker. Made to outlast the season that earned it.',
  fulfilment:
    'Shipped to the address you provide. Allow two to three weeks from the moment your ninetieth seal is recorded.',
} as const;
