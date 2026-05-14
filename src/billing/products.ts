import type { ProductSubscription } from 'expo-iap';

export const SADHANA_MONTHLY_PRODUCT_ID = 'com.sadhana.premium.monthly';
export const SADHANA_ANNUAL_PRODUCT_ID = 'com.sadhana.premium.annual';
export const SADHANA_SANGHA_MONTHLY_PRODUCT_ID =
  'com.sankalpsthakur.sadhana.sangha.monthly';
export const SADHANA_SANGHA_YEARLY_PRODUCT_ID =
  'com.sankalpsthakur.sadhana.sangha.yearly';
export const SADHANA_COUPLE_YEARLY_PRODUCT_ID =
  'com.sankalpsthakur.sadhana.couple.yearly';
export const SADHANA_GIFT_THREE_MONTHS_PRODUCT_ID =
  'com.sankalpsthakur.sadhana.gift.threemonths';

export const SADHANA_SUBSCRIPTION_PRODUCT_IDS = [
  SADHANA_MONTHLY_PRODUCT_ID,
  SADHANA_ANNUAL_PRODUCT_ID,
  SADHANA_SANGHA_MONTHLY_PRODUCT_ID,
  SADHANA_SANGHA_YEARLY_PRODUCT_ID,
  SADHANA_COUPLE_YEARLY_PRODUCT_ID,
] as const;

export const SADHANA_CONSUMABLE_PRODUCT_IDS = [
  SADHANA_GIFT_THREE_MONTHS_PRODUCT_ID,
] as const;

export type SadhanaSubscriptionProductId =
  (typeof SADHANA_SUBSCRIPTION_PRODUCT_IDS)[number];

export type SadhanaConsumableProductId =
  (typeof SADHANA_CONSUMABLE_PRODUCT_IDS)[number];

export type SadhanaTier = 'inner-phases' | 'sangha-pro' | 'couple';

export interface SadhanaTierDescriptor {
  tier: SadhanaTier;
  monthlyProductId?: SadhanaSubscriptionProductId;
  yearlyProductId?: SadhanaSubscriptionProductId;
  monthlyPrice?: string;
  yearlyPrice?: string;
}

export const SADHANA_TIERS: Record<SadhanaTier, SadhanaTierDescriptor> = {
  'inner-phases': {
    tier: 'inner-phases',
    monthlyProductId: SADHANA_MONTHLY_PRODUCT_ID,
    yearlyProductId: SADHANA_ANNUAL_PRODUCT_ID,
    monthlyPrice: '$14.99',
    yearlyPrice: '$59.99',
  },
  'sangha-pro': {
    tier: 'sangha-pro',
    monthlyProductId: SADHANA_SANGHA_MONTHLY_PRODUCT_ID,
    yearlyProductId: SADHANA_SANGHA_YEARLY_PRODUCT_ID,
    monthlyPrice: '$29.00',
    yearlyPrice: '$289.00',
  },
  couple: {
    tier: 'couple',
    yearlyProductId: SADHANA_COUPLE_YEARLY_PRODUCT_ID,
    yearlyPrice: '$129.00',
  },
};

export const SADHANA_GIFT_PRICE = '$29.99';

export type SadhanaPaywallPlanId = 'monthly-12-month' | 'annual';
export type SadhanaBillingPlanType = 'monthly' | 'upFront';

export interface SadhanaPaywallPlan {
  id: SadhanaPaywallPlanId;
  productId: SadhanaSubscriptionProductId;
  billingPlanType: SadhanaBillingPlanType;
  title: string;
  eyebrow: string;
  description: string;
  localBillingLine: string;
  storePriceSuffix: string;
  commitmentLine: string;
  cta: string;
  commitmentMonths?: number;
}

export const SADHANA_PAYWALL_COPY = {
  title: 'Inner Phases Premium',
  trial:
    'App Store confirms final localized price, tax, eligibility, and renewal terms before purchase.',
  restore: 'Restore Purchases',
} as const;

export const SADHANA_MONTHLY_12_MONTH_PLAN: SadhanaPaywallPlan = {
  id: 'monthly-12-month',
  productId: SADHANA_ANNUAL_PRODUCT_ID,
  billingPlanType: 'monthly',
  title: '12-month plan',
  eyebrow: '12-month commitment',
  description: 'Pay month by month while keeping a 12-month Premium commitment.',
  localBillingLine: 'Billed monthly for a 12-month commitment.',
  storePriceSuffix: 'billed monthly',
  commitmentLine: '12 monthly billing periods; App Store shows cancellation and renewal rules before purchase.',
  cta: 'Continue with monthly plan',
  commitmentMonths: 12,
};

export const SADHANA_ANNUAL_PLAN: SadhanaPaywallPlan = {
  id: 'annual',
  productId: SADHANA_ANNUAL_PRODUCT_ID,
  billingPlanType: 'upFront',
  title: 'Annual plan',
  eyebrow: '14-day trial',
  description: 'Try the complete ladder first, then renew annually through the App Store.',
  localBillingLine: '14-day free trial, then billed annually.',
  storePriceSuffix: 'per year after trial',
  commitmentLine: 'Cancel at least 24 hours before the trial or billing period ends.',
  cta: 'Start annual trial',
};

export const SADHANA_PAYWALL_PLANS = [
  SADHANA_MONTHLY_12_MONTH_PLAN,
  SADHANA_ANNUAL_PLAN,
] as const;

export const SADHANA_STOREKIT_26_NATIVE_GAP =
  'expo-iap 4.2.7 does not expose Product.SubscriptionInfo.pricingTerms or Product.PurchaseOption.billingPlanType(_:); Sadhana uses an iOS native bridge for the 12-month plan and falls back to expo-iap for normal subscription products.';

export function getSadhanaPaywallPlanPresentation(
  plan: SadhanaPaywallPlan,
  product?: ProductSubscription
) {
  const storePrice =
    plan.billingPlanType === 'monthly' ? undefined : product?.displayPrice?.trim();

  return {
    billingLine: storePrice
      ? `${storePrice} ${plan.storePriceSuffix}`
      : plan.localBillingLine,
    commitmentLine: plan.commitmentLine,
    priceSource: storePrice ? 'store-product' : 'local-fallback',
  } as const;
}

export function isSadhanaSubscriptionProductId(
  productId: string
): productId is SadhanaSubscriptionProductId {
  return SADHANA_SUBSCRIPTION_PRODUCT_IDS.includes(
    productId as SadhanaSubscriptionProductId
  );
}
