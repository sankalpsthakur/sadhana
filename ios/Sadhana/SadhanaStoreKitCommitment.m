#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(SadhanaStoreKitCommitment, NSObject)

RCT_EXTERN_METHOD(purchase:(NSString *)productID
                  billingPlanType:(NSString *)billingPlanType
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
