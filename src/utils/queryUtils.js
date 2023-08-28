export function extractQueryParam(reqQuery) {
  let mangoQuery = {
    selector: {},
  };

  try {
    Object.keys(reqQuery).map((query) => {
      if (query === "page") {
      } else if (query === "limit") {
        if (reqQuery[query] !== "")
          mangoQuery.limit = parseInt(reqQuery[query]);
      } else if (query === "bookMark") {
        if (reqQuery[query] !== "") mangoQuery.bookmark = reqQuery[query];
      } else if (query === "created_at") {
        mangoQuery.selector.date = {};
        Object.keys(reqQuery[query]).map((time) => {
          if (time === "from") {
            mangoQuery.selector.date = {
              ...mangoQuery.selector.date,
              $gte: reqQuery[query].from,
            };
          } else if (time === "to") {
            mangoQuery.selector.date = {
              ...mangoQuery.selector.date,
              $lte: reqQuery[query].to,
            };
          }
        });
      } else {
        mangoQuery.selector[query] = reqQuery[query];
      }
    });
    return JSON.stringify(mangoQuery);
  } catch (err) {
    return {};
  }
}
