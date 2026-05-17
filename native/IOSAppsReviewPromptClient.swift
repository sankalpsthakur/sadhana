import Foundation
import StoreKit
import UIKit

final class ReviewPromptsClient {
  static let shared = ReviewPromptsClient()
  static let lastShownKey = "iosapps.review.lastShownAt"

  private let defaults: UserDefaults
  private let now: () -> Date
  private let throttle: TimeInterval
  private let requester: () -> Bool

  init(
    defaults: UserDefaults = .standard,
    now: @escaping () -> Date = Date.init,
    throttle: TimeInterval = 60 * 60 * 24 * 120,
    requester: @escaping () -> Bool = ReviewPromptsClient.requestStoreReview
  ) {
    self.defaults = defaults
    self.now = now
    self.throttle = throttle
    self.requester = requester
  }

  func requestIfPeak(_ peak: String) -> Bool {
    _ = peak
    let timestamp = now().timeIntervalSince1970
    let lastShownAt = defaults.double(forKey: Self.lastShownKey)
    guard timestamp - lastShownAt >= throttle else { return false }
    guard requester() else { return false }

    defaults.set(timestamp, forKey: Self.lastShownKey)
    return true
  }

  private static func requestStoreReview() -> Bool {
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
    return true
  }
}
