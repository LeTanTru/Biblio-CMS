export function renderListPageUrl(path: string, queryString: string) {
  if (queryString) {
    return `${path}?${queryString}`;
  }
  return path;
}

export function generatePath(
  template: string,
  params: Record<string, string | number>
) {
  return template.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    if (params[key] === undefined) {
      throw new Error(`Missing parameter "${key}" for path "${template}"`);
    }
    return encodeURIComponent(params[key]);
  });
}
