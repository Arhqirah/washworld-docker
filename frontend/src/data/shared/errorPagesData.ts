// errorPagesData – tekster og handlinger til fejlsiderne 404, "Under construction" og 500.
// Importeres direkte af de respektive fejlsider så al tekst er samlet ét sted.

export const notFoundPageData = {
  code: "404",
  title: "Oops, that page is gone",
  messageLines: [
    "It looks like the page you were trying to reach",
    "doesn't exist anymore (or maybe the link is",
    "broken).",
  ],
  primaryActionLabel: "Tilbage",
  primaryActionHref: "/login",
} as const;

export const underConstructionPageData = {
  icon: "🚧",
  title: "Under Construction",
  messageLines: [
    "Vi arbejder på denne side.",
    "Kom tilbage senere.",
  ],
  primaryActionLabel: "Tilbage",
  primaryActionHref: "/dashboard",
} as const;

export const unsupportedPageData = {
  code: "500",
  title: "We hit a problem",
  messageLines: [
    "Something went wrong on our side, not yours.",
    "",
    "Try refreshing the page, or come back in a few",
    "minutes.",
  ],
  primaryActionLabel: "Tilbage",
  primaryActionHref: "/login",
} as const;
