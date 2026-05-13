#!/bin/zsh
set -euo pipefail

echo "Xcode Cloud post-clone: Sadhana"
xcodebuild -version

npm ci
npx expo prebuild --platform ios --clean

mkdir -p ios/StoreKit
cp store-readiness/SadhanaProducts.storekit ios/StoreKit/SadhanaProducts.storekit

cd ios
pod install
