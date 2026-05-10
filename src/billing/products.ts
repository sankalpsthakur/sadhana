export const SADHANA_SUBSCRIPTION_PRODUCT_IDS = [
  'com.sadhana.premium.monthly',
  'com.sadhana.premium.annual',
] as const;

export type SadhanaSubscriptionProductId =
  (typeof SADHANA_SUBSCRIPTION_PRODUCT_IDS)[number];

export const SADHANA_PAYWALL_COPY = {
  title: 'Sadhana Premium',
  trial: '14-day free trial, then App Store subscription pricing applies.',
  restore: 'Restore Purchases',
} as const;

export function isSadhanaSubscriptionProductId(
  productId: string
): productId is SadhanaSubscriptionProductId {
  return SADHANA_SUBSCRIPTION_PRODUCT_IDS.includes(
    productId as SadhanaSubscriptionProductId
  );
}
