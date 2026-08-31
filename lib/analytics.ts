export const ANALYTICS_EVENTS = [
  "page_view",
  "analysis_started",
  "analysis_completed",
  "analysis_failed",
  "mode_selected",
  "example_clicked",
  "copy_fix_clicked",
  "copy_report_clicked",
  "share_clicked",
  "screenshot_uploaded",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;

  void import("@vercel/analytics").then(({ track }) => {
    track(event);
  }).catch(() => {
    // Analytics must never break the product.
  });
}
