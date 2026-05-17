import XCTest

final class SadhanaTests: XCTestCase {
    func testLaunchReadinessTestTargetIsWired() {
        XCTAssertTrue(true)
    }

    func testReviewPromptClientRequestsOnceThenThrottles() {
        let suiteName = "SadhanaTests.\(UUID().uuidString)"
        let defaults = UserDefaults(suiteName: suiteName)!
        defer {
            defaults.removePersistentDomain(forName: suiteName)
        }

        var requestCount = 0
        let client = ReviewPromptsClient(
            defaults: defaults,
            now: { Date(timeIntervalSince1970: 2_000_000_000) },
            throttle: 60 * 60 * 24 * 120,
            requester: {
                requestCount += 1
                return true
            }
        )

        XCTAssertTrue(client.requestIfPeak("sambandhaReached"))
        XCTAssertFalse(client.requestIfPeak("sambandhaReached"))
        XCTAssertEqual(requestCount, 1)
    }

    func testReviewPromptClientDoesNotPersistWhenSystemDeclinesRequest() {
        let suiteName = "SadhanaTests.\(UUID().uuidString)"
        let defaults = UserDefaults(suiteName: suiteName)!
        defer {
            defaults.removePersistentDomain(forName: suiteName)
        }

        let client = ReviewPromptsClient(
            defaults: defaults,
            now: { Date(timeIntervalSince1970: 2_000_000_000) },
            requester: { false }
        )

        XCTAssertFalse(client.requestIfPeak("sambandhaReached"))
        XCTAssertEqual(defaults.double(forKey: ReviewPromptsClient.lastShownKey), 0)
    }
}
