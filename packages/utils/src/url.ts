export function toUrlPath(path: string) {
  // replace all non alphanumerics characters with hyphen
  // then replace all sequential hyphens with single hyphen
  // then remove leading and trailing hyphens
  return (
    path
      .toLowerCase()
      // replace all non alphanumeric characters with hyphen
      .replace(/[^a-z0-9]+/g, "-")
      // remove leading and trailing hyphens
      .replace(/^-+|-+$/g, "")
  );
}
