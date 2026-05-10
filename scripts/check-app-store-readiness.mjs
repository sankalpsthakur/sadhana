#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const failures = [];
const warnings = [];
const passes = [];

const SHARE_USAGE =
  'Sadhana reads sleep duration, heart-rate variability, and resting heart rate from Health to personalize daily practice guidance on your device. Sadhana does not write to Health.';

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

if (expo.name === 'Sadhna') pass('Expo app name is Sadhna');
else fail('Expo app name is not Sadhna');

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

if ('NSHealthUpdateUsageDescription' in infoPlist) {
  fail('NSHealthUpdateUsageDescription is present, but Sadhana does not write Health data');
} else {
  pass('Health update usage copy is absent, matching read-only HealthKit permissions');
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
