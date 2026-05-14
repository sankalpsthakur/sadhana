import {
  fetchProducts,
  getActiveSubscriptions,
  getAvailablePurchases,
  initConnection,
  requestPurchase,
  restorePurchases,
  type ActiveSubscription,
  type ProductSubscription,
  type Purchase,
  type RequestPurchaseResult,
} from 'expo-iap';
import { NativeModules, Platform } from 'react-native';
import {
  SADHANA_ANNUAL_PRODUCT_ID,
  SADHANA_SUBSCRIPTION_PRODUCT_IDS,
  type SadhanaBillingPlanType,
  type SadhanaSubscriptionProductId,
  isSadhanaSubscriptionProductId,
} from './products';

export type SadhanaEntitlementSource =
  | 'active-subscription'
  | 'available-purchase'
  | 'none';

export interface SadhanaEntitlementSnapshot {
  active: boolean;
  source: SadhanaEntitlementSource;
  productId: SadhanaSubscriptionProductId | null;
  checkedAt: string;
}

type NativeCommitmentPurchaseResult = {
  status: 'purchased' | 'pending' | 'cancelled' | 'unknown';
  productId: string;
  transactionId?: string;
};

type NativeStoreKitCommitmentModule = {
  purchase(
    productId: string,
    billingPlanType: 'monthly'
  ): Promise<NativeCommitmentPurchaseResult>;
};

const nativeCommitmentStore = NativeModules.SadhanaStoreKitCommitment as
  | NativeStoreKitCommitmentModule
  | undefined;

function supportsNativeStore() {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

async function ensureStoreConnection() {
  if (!supportsNativeStore()) {
    throw new Error('StoreKit/IAP is only available in native iOS or Android builds.');
  }

  await initConnection();
}

function toEntitlementSnapshot(
  source: SadhanaEntitlementSource,
  productId: string | null
): SadhanaEntitlementSnapshot {
  return {
    active: source !== 'none',
    source,
    productId:
      productId && isSadhanaSubscriptionProductId(productId) ? productId : null,
    checkedAt: new Date().toISOString(),
  };
}

export async function loadSadhanaSubscriptionProducts() {
  await ensureStoreConnection();
  const products = await fetchProducts({
    skus: [...SADHANA_SUBSCRIPTION_PRODUCT_IDS],
    type: 'subs',
  });

  const filteredProducts = (products ?? []).filter((product): product is ProductSubscription =>
    SADHANA_SUBSCRIPTION_PRODUCT_IDS.includes(
      product.id as SadhanaSubscriptionProductId
    )
  );

  if (filteredProducts.length === 0) {
    throw new Error(
      `App Store Connect returned no Inner Phases subscription products for: ${SADHANA_SUBSCRIPTION_PRODUCT_IDS.join(', ')}. Verify these exact product IDs exist for this app in App Store Connect.`
    );
  }

  return filteredProducts;
}

export async function purchaseSadhanaSubscription(
  productId: SadhanaSubscriptionProductId,
  billingPlanType: SadhanaBillingPlanType = 'upFront'
): Promise<RequestPurchaseResult | NativeCommitmentPurchaseResult> {
  await ensureStoreConnection();

  if (
    Platform.OS === 'ios' &&
    productId === SADHANA_ANNUAL_PRODUCT_ID &&
    billingPlanType === 'monthly'
  ) {
    if (!nativeCommitmentStore) {
      throw new Error(
        'Monthly billing for the 12-month plan requires the native StoreKit commitment bridge.'
      );
    }

    return nativeCommitmentStore.purchase(productId, 'monthly');
  }

  return requestPurchase({
    type: 'subs',
    request: {
      apple: { sku: productId },
      google: { skus: [productId] },
    },
  });
}

export async function refreshSadhanaEntitlement() {
  await ensureStoreConnection();

  const activeSubscriptions = (await getActiveSubscriptions([
    ...SADHANA_SUBSCRIPTION_PRODUCT_IDS,
  ])) as ActiveSubscription[];
  const activeSubscription = activeSubscriptions.find(
    (subscription) =>
      subscription.isActive &&
      isSadhanaSubscriptionProductId(subscription.productId)
  );

  if (activeSubscription) {
    return toEntitlementSnapshot(
      'active-subscription',
      activeSubscription.productId
    );
  }

  const availablePurchases = (await getAvailablePurchases({
    onlyIncludeActiveItemsIOS: true,
  })) as Purchase[];
  const availableSubscription = availablePurchases.find((purchase) =>
    isSadhanaSubscriptionProductId(purchase.productId)
  );

  if (availableSubscription) {
    return toEntitlementSnapshot(
      'available-purchase',
      availableSubscription.productId
    );
  }

  return toEntitlementSnapshot('none', null);
}

/**
 * Purchase a non-renewing or consumable in-app product (e.g. the Yatra
 * quarterly cohort, the Sthiti hardcover journal). Non-renewing subscriptions
 * on iOS are treated as `inapp` by StoreKit, not `subs`.
 */
export async function purchaseSadhanaInAppProduct(productId: string) {
  await ensureStoreConnection();
  return requestPurchase({
    type: 'inapp',
    request: {
      apple: { sku: productId },
      google: { skus: [productId] },
    },
  });
}

export async function restoreSadhanaPurchases() {
  await ensureStoreConnection();
  await restorePurchases();

  return refreshSadhanaEntitlement();
}
