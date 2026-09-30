// Feature flags — gate unfinished or optional features; never ship untested code without a flag
export const features = {
  documentVerification: false,
  chatbot:              false,
  smsChannel:           false,
  kioskMode:            false,
  capacitorBuild:       false,
  aiDuplicateCheck:     true,
  offlineQueue:         true,
  i18n:                 true,
} as const;

export type FeatureFlag = keyof typeof features;

export function isEnabled(flag: FeatureFlag): boolean {
  return features[flag];
}
