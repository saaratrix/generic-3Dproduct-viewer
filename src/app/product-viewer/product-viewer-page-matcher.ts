import { UrlMatchResult, UrlSegment } from "@angular/router";

export function productViewerPageMatcher(segments: UrlSegment[]): UrlMatchResult {
  const params: any = {};

  if (segments.length > 0 && segments[0].path === "model") {
    if (segments.length > 1) {
      params.name = segments[1];
    }
    if (segments.length > 2) {
      params.subname = segments[2];
    }
  }
  return {
    consumed: segments,
    posParams: params,
  };
}
