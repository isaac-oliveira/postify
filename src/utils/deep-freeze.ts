export function deepFreeze<T extends object>(value: T): T {
  const seen = new WeakSet<object>()

  function freeze(current: object): void {
    if (seen.has(current) || Object.isFrozen(current)) {
      return
    }

    seen.add(current)

    Object.values(current).forEach(child => {
      if (typeof child === 'object' && child !== null) {
        freeze(child)
      }
    })

    Object.freeze(current)
  }

  freeze(value)
  return value
}
