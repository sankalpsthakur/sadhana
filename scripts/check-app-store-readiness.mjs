#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const failures = [];
const warnings = [];
const passes = [];

const SHARE_USAGE =
  'Inner Phases reads sleep duration, heart-rate variability, and resting heart rate from Health to personalize daily practice guidance on your device. Inner Phases does not write to Health.';

function pass(message) {
  passes.push(message);
}

function warn(message) {
  warnings.push(message);
}

function fail(message) {
  failures.push(message);
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(root, relativePath), 'utf8'));
}

function readText(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

function hasTransparency(buffer) {
  let offset = 8;
  while (offset + 12 <= buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    if (type === 'IHDR') {
      const colorType = buffer[offset + 17];
      if (colorType === 4 || colorType === 6) return true;
    }
    if (type === 'tRNS') return true;
    offset += 12 + length;
  }
  return false;
}

function readPng(relativePath) {
  const buffer = readFileSync(join(root, relativePath));
  const signature = buffer.subarray(0, 8).toString('hex');
  if (signature !== '89504e470d0a1a0a') {
    throw new Error(`${relativePath} is not a PNG`);
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    hasTransparency: hasTransparency(buffer),
  };
}

function expectPng(relativePath, expectedWidth, expectedHeight, options = {}) {
  if (!existsSync(join(root, relativePath))) {
    fail(`${relativePath} is missing`);
    return;
  }
  const image = readPng(relativePath);
  if (image.width !== expectedWidth || image.height !== expectedHeight) {
    fail(`${relativePath} is ${image.width}x${image.height}; expected ${expectedWidth}x${expectedHeight}`);
    return;
  }
  if (options.noTransparency && image.hasTransparency) {
    fail(`${relativePath} has transparency; App Store iOS app icons must be opaque`);
    return;
  }
  pass(`${relativePath} is ${expectedWidth}x${expectedHeight}${options.noTransparency ? ' and opaque' : ''}`);
}

const appJson = readJson('app.json');
const packageJson = readJson('package.json');
const expo = appJson.expo ?? {};
const ios = expo.ios ?? {};
const infoPlist = ios.infoPlist ?? {};
const dependencies = {
  ...(packageJson.dependencies ?? {}),
  ...(packageJson.devDependencies ?? {}),
};

if (expo.name === 'Inner Phases') pass('Expo app name is Inner Phases');
else fail('Expo app name is not Inner Phases');

if (expo.orientation === 'portrait') pass('Orientation is locked to portrait');
else fail('Orientation is not locked to portrait');

if (ios.bundleIdentifier === 'com.sankalpsthakur.sadhana') pass('iOS bundle identifier is set');
else fail('iOS bundle identifier is missing or unexpected');

if (ios.entitlements?.['com.apple.developer.healthkit'] === true) {
  pass('HealthKit entitlement is declared in app.json');
} else {
  fail('HealthKit entitlement is not declared in app.json');
}

if (infoPlist.NSHealthShareUsageDescription === SHARE_USAGE) {
  pass('HealthKit read usage copy is exact and reviewer-safe');
} else {
  fail('NSHealthShareUsageDescription does not match the approved local read-only copy');
}

if (infoPlist.ITSAppUsesNonExemptEncryption === true) {
  pass('Export compliance declares non-exempt standard encryption in app.json');
} else {
  fail('ITSAppUsesNonExemptEncryption must be true because the app implements AES-256-GCM');
}

if (infoPlist.SECURE_ENVELOPE_ALGORITHM === 'AES-256-GCM' && infoPlist.SECURE_ENVELOPE_VERSION === 1) {
  pass('Secure envelope metadata declares AES-256-GCM v1');
} else {
  fail('Secure envelope metadata is missing AES-256-GCM v1');
}

if ('NSHealthUpdateUsageDescription' in infoPlist) {
  fail('NSHealthUpdateUsageDescription is present, but Sadhana does not write Health data');
} else {
  pass('Health update usage copy is absent, matching read-only HealthKit permissions');
}

if (dependencies['expo-secure-store']) {
  pass('expo-secure-store is installed for native encrypted persistence');
} else {
  fail('expo-secure-store is missing; native app persistence is not using Expo secure storage');
}

if ((expo.plugins ?? []).some((plugin) => plugin === 'expo-secure-store' || plugin?.[0] === 'expo-secure-store')) {
  pass('expo-secure-store config plugin is declared');
} else {
  fail('expo-secure-store config plugin is not declared in app.json');
}

const nativePersistStorage = readText('src/store/persistStorage.native.ts');
const secureEnvelope = readText('src/crypto/secureEnvelope.ts');
if (
  dependencies['node-forge'] &&
  secureEnvelope.includes("forge.cipher.createCipher('AES-GCM'") &&
  secureEnvelope.includes("forge.cipher.createDecipher('AES-GCM'")
) {
  pass('App implements standard AES-GCM secure envelope crypto through node-forge');
} else {
  fail('AES-GCM secure envelope implementation is missing');
}

if (
  nativePersistStorage.includes("from 'expo-secure-store'") &&
  nativePersistStorage.includes('SecureStore.getItemAsync') &&
  nativePersistStorage.includes('SecureStore.setItemAsync') &&
  nativePersistStorage.includes('SecureStore.deleteItemAsync')
) {
  pass('Native persisted store uses Expo SecureStore get/set/delete APIs');
} else {
  fail('Native persisted store is not wired to Expo SecureStore get/set/delete APIs');
}

const provider = readText('src/health/provider.ios.ts');
const requiredReads = ['SleepAnalysis', 'HeartRateVariability', 'RestingHeartRate'];
for (const readType of requiredReads) {
  if (provider.includes(`Permissions.${readType}`)) pass(`iOS Health provider reads ${readType}`);
  else fail(`iOS Health provider is missing ${readType}`);
}
if (/write:\s*\[\s*\]/m.test(provider)) {
  pass('iOS Health provider requests no write permissions');
} else {
  fail('iOS Health provider requests write permissions');
}

if (existsSync(join(root, 'scripts/google-health-api.mjs')) && existsSync(join(root, 'tools/google-health/google-health-api.http'))) {
  pass('Google Health API developer CLI and REST codelab workspace are present');
} else {
  warn('Google Health API developer CLI/codelab workspace is absent; Android local Health Connect still remains the app path');
}

expectPng('assets/icon.png', 1024, 1024, { noTransparency: true });
expectPng('assets/adaptive-icon.png', 1024, 1024);
expectPng('assets/splash-icon.png', 1024, 1024);
expectPng('assets/favicon.png', 48, 48);

const iosInfoPlistPath = join(root, 'ios/Sadhana/Info.plist');
const iosEntitlementsPath = join(root, 'ios/Sadhana/Sadhana.entitlements');
const iosPrivacyPath = join(root, 'ios/Sadhana/PrivacyInfo.xcprivacy');
const generatedIconPath = 'ios/Sadhana/Images.xcassets/AppIcon.appiconset/App-Icon-1024x1024@1x.png';

if (existsSync(iosInfoPlistPath)) {
  const generatedInfoPlist = readText('ios/Sadhana/Info.plist');
  if (generatedInfoPlist.includes(SHARE_USAGE)) {
    pass('Generated iOS Info.plist matches HealthKit usage copy');
  } else {
    fail('Generated iOS Info.plist does not match HealthKit usage copy; rerun prebuild before native build');
  }
  if (generatedInfoPlist.includes('NSHealthUpdateUsageDescription')) {
    fail('Generated iOS Info.plist still contains Health write usage copy');
  } else {
    pass('Generated iOS Info.plist has no Health write usage copy');
  }
  if (
    generatedInfoPlist.includes('<key>ITSAppUsesNonExemptEncryption</key>') &&
    generatedInfoPlist.includes('<true/>') &&
    generatedInfoPlist.includes('AES-256-GCM')
  ) {
    pass('Generated iOS Info.plist declares non-exempt AES-256-GCM encryption');
  } else {
    fail('Generated iOS Info.plist is missing non-exempt AES-256-GCM encryption metadata');
  }
} else {
  warn('Generated ios/Sadhana/Info.plist is absent; run Expo prebuild before native verification');
}

if (existsSync(iosEntitlementsPath)) {
  const entitlements = readText('ios/Sadhana/Sadhana.entitlements');
  if (entitlements.includes('com.apple.developer.healthkit') && entitlements.includes('<true/>')) {
    pass('Generated iOS entitlements include HealthKit');
  } else {
    fail('Generated iOS entitlements do not include HealthKit');
  }
} else {
  warn('Generated ios/Sadhana/Sadhana.entitlements is absent; run Expo prebuild before native verification');
}

if (existsSync(join(root, generatedIconPath))) {
  expectPng(generatedIconPath, 1024, 1024, { noTransparency: true });
} else {
  warn('Generated iOS AppIcon asset is absent; run Expo prebuild before native verification');
}

if (existsSync(iosPrivacyPath)) {
  const privacyManifest = readText('ios/Sadhana/PrivacyInfo.xcprivacy');
  if (privacyManifest.includes('NSPrivacyTracking') && privacyManifest.includes('<false/>')) {
    pass('Generated app privacy manifest declares tracking=false');
  } else {
    warn('Generated app privacy manifest needs manual review');
  }
} else {
  warn('Generated app PrivacyInfo.xcprivacy is absent; verify after prebuild');
}

const screenshotDirs = [
  'store-readiness/screenshots',
  'assets/screenshots',
  '../ios-readiness-artifacts/app-store-drafts-2026-05-11/upload/sadhana-iphone-65',
];
const screenshots = screenshotDirs.flatMap((dir) => {
  const absolute = join(root, dir);
  if (!existsSync(absolute)) return [];
  return readdirSync(absolute).filter((name) => /\.(png|jpg|jpeg)$/i.test(name)).map((name) => `${dir}/${name}`);
});
if (screenshots.length > 0) {
  pass(`Found ${screenshots.length} local screenshot asset(s)`);
} else {
  fail('No local App Store screenshot assets found; production readiness requires real screenshot sets');
}

const monetizationPackages = ['react-native-iap', 'expo-iap', 'react-native-purchases'];
const installedMonetizationPackage = monetizationPackages.find((name) => dependencies[name]);
if (installedMonetizationPackage) {
  pass(`Monetization package is installed: ${installedMonetizationPackage}`);
} else {
  fail('No StoreKit/IAP package is installed; paid Sadhana readiness needs StoreKit-backed subscription handling');
}

const monetizationSourcePatterns = [
  /StoreKit/i,
  /react-native-iap/i,
  /RevenueCat/i,
  /react-native-purchases/i,
  /subscriptionProduct/i,
  /restorePurchases/i,
];
const monetizationFiles = [
  'src',
].flatMap((dir) => {
  const absolute = join(root, dir);
  if (!existsSync(absolute)) return [];
  const files = [];
  const stack = [absolute];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) stack.push(path);
      else if (/\.(ts|tsx|js|jsx|md|json)$/i.test(entry.name)) files.push(path);
    }
  }
  return files;
});
const hasMonetizationSource = monetizationFiles.some((file) => {
  const text = readFileSync(file, 'utf8');
  return monetizationSourcePatterns.some((pattern) => pattern.test(text));
});
if (hasMonetizationSource) {
  pass('Subscription/paywall source references are present');
} else {
  fail('No subscription/paywall/restore source path found; premium and 14-day trial claims are not implemented');
}

const billingProducts = readText('src/billing/products.ts');
if (
  billingProducts.includes("id: 'monthly-12-month'") &&
  billingProducts.includes("productId: SADHANA_ANNUAL_PRODUCT_ID") &&
  billingProducts.includes("billingPlanType: 'monthly'") &&
  billingProducts.includes('commitmentMonths: 12')
) {
  pass('Monthly-with-12-month commitment plan is declared in billing config');
} else {
  fail('Monthly-with-12-month commitment plan is missing from billing config');
}

const onboardingSource = readText('src/components/onboarding/OnboardingSequence.tsx');
if (
  onboardingSource.includes("useState<SadhanaPaywallPlanId>(") &&
  onboardingSource.includes("'monthly-12-month'") &&
  onboardingSource.includes('loadSadhanaSubscriptionProducts') &&
  onboardingSource.includes('getSadhanaPaywallPlanPresentation') &&
  onboardingSource.includes('selectedPlan.productId') &&
  onboardingSource.includes('selectedPlan.billingPlanType')
) {
  pass('Final onboarding paywall defaults to and purchases the selected plan');
} else {
  fail('Final onboarding paywall is not wired to the monthly commitment plan selector');
}

const storeKitConfig = readText('store-readiness/SadhanaProducts.storekit');
if (
  storeKitConfig.includes('com.sadhana.premium.annual') &&
  storeKitConfig.includes('12-Month Plan') &&
  storeKitConfig.includes('12-month Premium commitment')
) {
  pass('Local StoreKit config labels the annual product as the 12-month commitment plan');
} else {
  fail('Local StoreKit config does not label the annual 12-month commitment product');
}

const readinessReport = readText('store-readiness/APP_STORE_READINESS.md');
if (
  readinessReport.includes('Product.SubscriptionInfo.pricingTerms') &&
  readinessReport.includes('Product.PurchaseOption.billingPlanType') &&
  readinessReport.includes('SadhanaStoreKitCommitment')
) {
  pass('Readiness artifact documents the StoreKit native bridge');
} else {
  fail('Readiness artifact does not document the StoreKit native bridge');
}

const expoIapTypesPath = join(root, 'node_modules/expo-iap/build/types.d.ts');
if (existsSync(expoIapTypesPath)) {
  const expoIapTypes = readFileSync(expoIapTypesPath, 'utf8');
  if (/billingPlanType|pricingTerms/.test(expoIapTypes)) {
    warn('expo-iap types now mention billingPlanType/pricingTerms; recheck whether the native StoreKit 26.4 gap can be closed');
  } else {
    warn('expo-iap types do not expose billingPlanType/pricingTerms; Sadhana relies on the local native bridge for monthly commitment purchases');
  }
}

console.log('App Store readiness check');
console.log('');
for (const message of passes) console.log(`PASS ${message}`);
for (const message of warnings) console.log(`WARN ${message}`);
for (const message of failures) console.log(`FAIL ${message}`);

if (failures.length > 0) {
  console.log('');
  console.log(`${failures.length} blocking readiness check(s) failed.`);
  process.exit(1);
}

console.log('');
console.log(`Ready checks passed with ${warnings.length} warning(s).`);
