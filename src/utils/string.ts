export function splitLimit(str: string, separator: string, limit: number): string[] {
  const split = str.split(separator)

  if (split.length < limit) {
    return split
  }

  return [...split.slice(0, limit - 1), split.slice(limit - 1).join(separator)]
}

export function ucFirst(str: string): string {
  return str.substring(0, 1).toUpperCase() + str.substring(1)
}
