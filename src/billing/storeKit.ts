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
import { Platform } from 'react-native';
import {
  SADHANA_SUBSCRIPTION_PRODUCT_IDS,
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

  return (products ?? []).filter((product): product is ProductSubscription =>
    SADHANA_SUBSCRIPTION_PRODUCT_IDS.includes(
      product.id as SadhanaSubscriptionProductId
    )
  );
}

export async function purchaseSadhanaSubscription(
  productId: SadhanaSubscriptionProductId
): Promise<RequestPurchaseResult> {
  await ensureStoreConnection();

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

export async function restoreSadhanaPurchases() {
  await ensureStoreConnection();
  await restorePurchases();

  return refreshSadhanaEntitlement();
}
