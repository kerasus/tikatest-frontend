export function createPrefixedT (t: (key: string) => string) {
  return (key: string) => t(key)
}
