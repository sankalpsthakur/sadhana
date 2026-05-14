#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(IOSAppsAnalyticsBridge, NSObject)

RCT_EXTERN_METHOD(track:(NSString *)eventName
                  properties:(NSDictionary *)properties
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setOptOut:(BOOL)optedOut
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end

@interface RCT_EXTERN_MODULE(IOSAppsFlagsBridge, NSObject)

RCT_EXTERN_METHOD(getFlag:(NSString *)key
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end

@interface RCT_EXTERN_MODULE(IOSAppsReviewPromptsBridge, NSObject)

RCT_EXTERN_METHOD(requestIfPeak:(NSString *)peak
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
