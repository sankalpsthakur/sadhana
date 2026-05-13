import Foundation
import StoreKit

@objc(SadhanaStoreKitCommitment)
final class SadhanaStoreKitCommitment: NSObject {
  @objc
  static func requiresMainQueueSetup() -> Bool {
    false
  }

  @objc(purchase:billingPlanType:resolver:rejecter:)
  func purchase(
    _ productID: String,
    billingPlanType: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      do {
        guard #available(iOS 26.4, *) else {
          reject(
            "sadhana_storekit_unsupported_os",
            "Monthly billing for a 12-month commitment requires iOS 26.4 or later.",
            nil
          )
          return
        }

        let products = try await Product.products(for: [productID])
        guard let product = products.first else {
          reject(
            "sadhana_storekit_missing_product",
            "App Store did not return \(productID).",
            nil
          )
          return
        }

        let options = try purchaseOptions(for: product, billingPlanType: billingPlanType)
        let result = try await product.purchase(options: options)

        switch result {
        case .success(let verification):
          let transaction = try checkVerified(verification)
          await transaction.finish()
          resolve([
            "status": "purchased",
            "productId": transaction.productID,
            "transactionId": String(transaction.id)
          ])
        case .userCancelled:
          resolve(["status": "cancelled", "productId": productID])
        case .pending:
          resolve(["status": "pending", "productId": productID])
        @unknown default:
          resolve(["status": "unknown", "productId": productID])
        }
      } catch {
        reject(
          "sadhana_storekit_purchase_failed",
          error.localizedDescription,
          error
        )
      }
    }
  }

  @available(iOS 26.4, *)
  private func purchaseOptions(
    for product: Product,
    billingPlanType: String
  ) throws -> Set<Product.PurchaseOption> {
    guard billingPlanType == "monthly" else {
      return []
    }

    guard product.hasTwelveMonthMonthlyPricingTerms else {
      throw StoreKitCommitmentError.missingMonthlyTwelveMonthTerms(productID: product.id)
    }

    return [.billingPlanType(.monthly)]
  }

  private func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
    switch result {
    case .verified(let safe):
      return safe
    case .unverified(_, let error):
      throw error
    }
  }
}

private enum StoreKitCommitmentError: LocalizedError {
  case missingMonthlyTwelveMonthTerms(productID: String)

  var errorDescription: String? {
    switch self {
    case .missingMonthlyTwelveMonthTerms(let productID):
      return "App Store product \(productID) does not expose monthly pricing terms with a 12-month commitment yet."
    }
  }
}

@available(iOS 26.4, *)
private extension Product {
  var hasTwelveMonthMonthlyPricingTerms: Bool {
    guard let pricingTerms = subscription?.pricingTerms else {
      return false
    }

    return pricingTerms.contains { terms in
      terms.billingPlanType == .monthly &&
      terms.commitmentInfo.period.isTwelveMonths
    }
  }
}

@available(iOS 26.4, *)
private extension Product.SubscriptionPeriod {
  var isTwelveMonths: Bool {
    switch unit {
    case .month:
      return value == 12
    case .year:
      return value == 1
    default:
      return false
    }
  }
}
