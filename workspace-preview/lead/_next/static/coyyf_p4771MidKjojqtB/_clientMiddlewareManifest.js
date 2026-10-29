self.__MIDDLEWARE_MATCHERS = [
  {
    "regexp": "^\\/yuyu-homepage-preview/workspace-preview/lead(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next\\/|site\\/api\\/|erp\\/load\\/stage|favicon.ico|.*\\..*).*))(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$",
    "originalSource": "/((?!_next/|site/api/|erp/load/stage|favicon.ico|.*\\..*).*)"
  }
];self.__MIDDLEWARE_MATCHERS_CB && self.__MIDDLEWARE_MATCHERS_CB()