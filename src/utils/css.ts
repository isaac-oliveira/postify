export function css(name: string): string
export function css(name: string, numeric: true): number
export function css(name: string, numeric?: true): string | number {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return numeric ? parseInt(value, 10) : value
}
