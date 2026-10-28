self.__MIDDLEWARE_MATCHERS = [
  {
    "regexp": "^\\/yuyu-homepage-preview(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/(\\/?index|\\/?index\\.json|\\/?index(?:\\.rsc|\\.segments\\/.+\\.segment\\.rsc)))?[\\/#\\?]?$",
    "originalSource": "/"
  },
  {
    "regexp": "^\\/yuyu-homepage-preview(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next|api\\/inquiry|.*\\.(?!(?:php|pdf)$)[^./]+$).*))(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$",
    "originalSource": "/((?!_next|api/inquiry|.*\\.(?!(?:php|pdf)$)[^./]+$).*)"
  }
];self.__MIDDLEWARE_MATCHERS_CB && self.__MIDDLEWARE_MATCHERS_CB()