import Foundation
import UIKit

/// Bridge between React Native (Sadhana JS) and the iosapps analytics +
/// flags + review-prompt infrastructure described in
/// `FEEDBACK_LOOPS_FRAMEWORK.md`.
///
/// TODO(wave13): replace the inline emission/flag/review logic with
/// `import IOSAppsAnalytics` / `import IOSAppsFlags` / `import IOSAppsReviewPrompts`
/// once those Swift packages are linked into the Sadhana Xcode project.
/// The public surface exposed via React Native is intentionally identical
/// to the eventual package API so the swap is mechanical.

@objc(IOSAppsAnalyticsBridge)
final class IOSAppsAnalyticsBridge: NSObject {

  // MARK: - React Native plumbing

  @objc static func requiresMainQueueSetup() -> Bool { false }

  @objc(track:properties:resolver:rejecter:)
  func track(
    _ eventName: String,
    properties: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    AnalyticsClient.shared.track(
      eventName: eventName,
      properties: properties as? [String: Any] ?? [:]
    )
    resolve(["status": "queued", "event": eventName])
  }

  @objc(setOptOut:resolver:rejecter:)
  func setOptOut(
    _ optedOut: Bool,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    AnalyticsClient.shared.setOptOut(optedOut)
    resolve(["optedOut": optedOut])
  }
}

@objc(IOSAppsFlagsBridge)
final class IOSAppsFlagsBridge: NSObject {

  @objc static func requiresMainQueueSetup() -> Bool { false }

  @objc(getFlag:resolver:rejecter:)
  func getFlag(
    _ key: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    let value = FlagsClient.shared.value(for: key)
    resolve(["key": key, "value": value as Any])
  }
}

@objc(IOSAppsReviewPromptsBridge)
final class IOSAppsReviewPromptsBridge: NSObject {

  @objc static func requiresMainQueueSetup() -> Bool { true }

  /// `peak` is a free-form identifier so JS can drive any peak moment
  /// (e.g. `sambandhaReached`). The native side throttles requests to one per
  /// 120 days, matching Apple's own SKStoreReviewController policy.
  @objc(requestIfPeak:resolver:rejecter:)
  func requestIfPeak(
    _ peak: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      let presented = ReviewPromptsClient.shared.requestIfPeak(peak)
      resolve(["presented": presented, "peak": peak])
    }
  }
}

// MARK: - Inline analytics client (placeholder for IOSAppsAnalytics package)

private final class AnalyticsClient {
  static let shared = AnalyticsClient()

  private let optOutKey = "iosapps.analytics.optedOut"

  private init() {}

  private var isOptedOut: Bool {
    UserDefaults.standard.bool(forKey: optOutKey)
  }

  func setOptOut(_ optedOut: Bool) {
    UserDefaults.standard.set(optedOut, forKey: optOutKey)
  }

  func track(eventName: String, properties: [String: Any]) {
    guard !isOptedOut else { return }
    _ = eventName
    _ = properties
    // Launch privacy gate: source call sites may be wired, but no analytics
    // payload leaves the device until App Store privacy disclosures and a
    // production analytics package are deliberately enabled.
    return
  }
}

// MARK: - Inline flags client (placeholder for IOSAppsFlags package)

private final class FlagsClient {
  static let shared = FlagsClient()

  /// Defaults are conservative. A future revision will fetch overrides from
  /// the iosapps flags service and cache them in UserDefaults.
  private let defaults: [String: Any] = [
    "paywallVariant": "control",
    "kusalaMitraEnabled": false,
    "pathScreenEnabled": true,
    "sanghaCountEnabled": false,
  ]

  func value(for key: String) -> Any? {
    if let override = UserDefaults.standard.object(forKey: "iosapps.flags." + key) {
      return override
    }
    return defaults[key]
  }
}
