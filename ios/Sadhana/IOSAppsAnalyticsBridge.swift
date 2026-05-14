import Foundation
import UIKit
import StoreKit

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

  private let endpoint = URL(string: "https://telemetry.iosapps.io/v1/events")!
  private let queueLock = NSLock()
  private var buffer: [[String: Any]] = []
  private let appID = "sadhana"
  private let userIDKey = "iosapps.analytics.userID"
  private let optOutKey = "iosapps.analytics.optedOut"
  private let sessionID = UUID().uuidString
  private let flushInterval: TimeInterval = 30
  private let maxBatchSize = 100

  private init() {
    Timer.scheduledTimer(withTimeInterval: flushInterval, repeats: true) { [weak self] _ in
      self?.flush()
    }
  }

  private var isOptedOut: Bool {
    UserDefaults.standard.bool(forKey: optOutKey)
  }

  func setOptOut(_ optedOut: Bool) {
    UserDefaults.standard.set(optedOut, forKey: optOutKey)
    if optedOut {
      queueLock.lock()
      buffer.removeAll()
      queueLock.unlock()
      UserDefaults.standard.removeObject(forKey: userIDKey)
    }
  }

  private var userID: String {
    if let existing = UserDefaults.standard.string(forKey: userIDKey) {
      return existing
    }
    let new = UUID().uuidString
    UserDefaults.standard.set(new, forKey: userIDKey)
    return new
  }

  func track(eventName: String, properties: [String: Any]) {
    guard !isOptedOut else { return }
    #if DEBUG
    // Per ANALYTICS_DESIGN §2, debug builds emit no network traffic.
    return
    #else
    let event: [String: Any] = [
      "event_name": eventName,
      "app_id": appID,
      "user_id": userID,
      "session_id": sessionID,
      "timestamp": Self.iso8601.string(from: Date()),
      "properties": properties,
    ]
    queueLock.lock()
    buffer.append(event)
    let shouldFlush = buffer.count >= maxBatchSize
    queueLock.unlock()
    if shouldFlush { flush() }
    #endif
  }

  func flush() {
    queueLock.lock()
    guard !buffer.isEmpty else { queueLock.unlock(); return }
    let batch = buffer
    buffer.removeAll()
    queueLock.unlock()

    var req = URLRequest(url: endpoint)
    req.httpMethod = "POST"
    req.setValue("application/json", forHTTPHeaderField: "Content-Type")
    req.httpBody = try? JSONSerialization.data(withJSONObject: ["events": batch])

    URLSession.shared.dataTask(with: req) { [weak self] _, response, error in
      let failed = error != nil || ((response as? HTTPURLResponse)?.statusCode ?? 0) >= 400
      if failed, let self = self {
        self.queueLock.lock()
        self.buffer.append(contentsOf: batch)
        self.queueLock.unlock()
      }
    }.resume()
  }

  private static let iso8601: ISO8601DateFormatter = {
    let f = ISO8601DateFormatter()
    f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    return f
  }()
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

// MARK: - Inline review-prompt client (placeholder for IOSAppsReviewPrompts package)

private final class ReviewPromptsClient {
  static let shared = ReviewPromptsClient()

  private let lastShownKey = "iosapps.review.lastShownAt"
  private let throttle: TimeInterval = 60 * 60 * 24 * 120 // 120 days

  func requestIfPeak(_ peak: String) -> Bool {
    let now = Date().timeIntervalSince1970
    let last = UserDefaults.standard.double(forKey: lastShownKey)
    guard now - last >= throttle else { return false }

    guard let scene = UIApplication.shared.connectedScenes
      .compactMap({ $0 as? UIWindowScene })
      .first(where: { $0.activationState == .foregroundActive })
      ?? UIApplication.shared.connectedScenes.compactMap({ $0 as? UIWindowScene }).first
    else {
      return false
    }

    if #available(iOS 14.0, *) {
      SKStoreReviewController.requestReview(in: scene)
    } else {
      SKStoreReviewController.requestReview()
    }
    UserDefaults.standard.set(now, forKey: lastShownKey)
    return true
  }
}
