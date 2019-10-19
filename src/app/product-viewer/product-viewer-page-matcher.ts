import { UrlMatchResult, UrlSegment } from "@angular/router";

export function productViewerPageMatcher(segments: UrlSegment[]): UrlMatchResult {
  const params: any = {};

  githubPages404Hack(params);

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

function githubPages404Hack(params) {
  // Github pages 404 hack to load correct model.
  if (sessionStorage && sessionStorage.redirect) {
    const redirect: string = sessionStorage.redirect;
    delete sessionStorage.redirect;

    const matches = redirect.match(/\/model\/([^\s\/]+)\/?([^\s\/]*)\/?/);
    if (matches) {
      if (matches.length > 1) {
        params.name = matches[1];
      }
      if (matches.length > 2) {
        params.name = matches[2];
      }
    }
  }
}
