self.__MIDDLEWARE_MATCHERS = [
  {
    "regexp": "^\\/yuyu-homepage-preview(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/(\\/?index|\\/?index\\.json|\\/?index(?:\\.rsc|\\.segments\\/.+\\.segment\\.rsc)))?[\\/#\\?]?$",
    "originalSource": "/"
  },
  {
    "regexp": "^\\/yuyu-homepage-preview(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!admin|api|_next|.*\\.(?!(?:php|pdf)$)[^./]+$).*))(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$",
    "originalSource": "/((?!admin|api|_next|.*\\.(?!(?:php|pdf)$)[^./]+$).*)"
  }
];self.__MIDDLEWARE_MATCHERS_CB && self.__MIDDLEWARE_MATCHERS_CB()