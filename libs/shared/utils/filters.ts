import * as qs from "qs";

function parseFilters(filters?: string) {
  if (!filters) {
    return "";
  }

  const filtersParsed = qs.parse(
    (filters as string).replace("?", "").replace(/\|([^&]*)&?/g, "&")
  );

  return decodeURIComponent(qs.stringify(filtersParsed)).replace(
    /\|([^&]*)&?/g,
    "&"
  );
}

export { parseFilters };
