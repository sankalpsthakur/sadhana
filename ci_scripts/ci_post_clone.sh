#!/bin/zsh
set -euo pipefail

echo "Xcode Cloud post-clone: Sadhana"
xcodebuild -version

npm ci

cd ios
pod install
