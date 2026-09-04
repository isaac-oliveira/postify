import { expect, test } from 'vitest'
import { deepFreeze } from './deep-freeze'

test('congela recursivamente e retorna a mesma referência', () => {
  type Value = {
    self?: Value
    nested: {
      enabled: boolean
    }
  }

  const value: Value = {
    nested: {
      enabled: true
    }
  }
  value.self = value

  expect(deepFreeze(value)).toBe(value)
  expect(Object.isFrozen(value)).toBe(true)
  expect(Object.isFrozen(value.nested)).toBe(true)
})
