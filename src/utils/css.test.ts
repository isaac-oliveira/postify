import { afterEach, expect, test, vi } from 'vitest'
import { css } from './css'

afterEach(() => {
  vi.unstubAllGlobals()
})

function stubCss(values: Record<string, string>) {
  vi.stubGlobal('document', { documentElement: {} })
  vi.stubGlobal('getComputedStyle', () => ({
    getPropertyValue: (name: string) => values[name] ?? '',
  }))
}

test('retorna o valor de uma custom property do root', () => {
  stubCss({ '--c-primary-500': ' #6366F1' })
  expect(css('--c-primary-500')).toBe('#6366F1')
})

test('retorna string vazia para propriedade inexistente', () => {
  stubCss({})
  expect(css('--nao-existe')).toBe('')
})

test('retorna o valor inteiro sem unidade com numeric true', () => {
  stubCss({ '--fs-md': ' 16px' })
  expect(css('--fs-md', true)).toBe(16)
})

test('retorna NaN para propriedade inexistente com numeric true', () => {
  stubCss({})
  expect(css('--nao-existe', true)).toBeNaN()
})
