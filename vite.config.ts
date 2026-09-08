import { readFileSync, realpathSync } from 'node:fs'
import path from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

const svgReactImport = /\.svg\?react$/
const svgFileSuffix = /[?#].*$/
const unsafeSvgContent = [
  /<script\b/i,
  /<foreignObject\b/i,
  /\bon[a-z][\w:-]*\s*=/i,
  /javascript\s*:/i,
  /(?:href|xlink:href|src)\s*=\s*(['"])(?!\s*(?:#|\1\s*$))[^'"]+\1/i,
  /url\(\s*(['"]?)(?!#)[^)]*\1\s*\)/i,
]

const svgSafety = () => {
  let approvedAssetRoot = ''

  return {
    name: 'postify-svg-safety',
    enforce: 'pre' as const,
    configResolved(config: { root: string }) {
      approvedAssetRoot = realpathSync(path.resolve(config.root, 'src/app/assets'))
    },
    load(id: string) {
      if (!svgReactImport.test(id)) {
        return null
      }

      const filePath = path.resolve(id.replace(svgFileSuffix, ''))
      const realFilePath = realpathSync(filePath)
      const approvedPrefix = `${approvedAssetRoot}${path.sep}`

      if (!realFilePath.startsWith(approvedPrefix)) {
        throw new Error(`SVG import is outside approved local assets: ${filePath}`)
      }

      const source = readFileSync(realFilePath, 'utf8')

      if (unsafeSvgContent.some((pattern) => pattern.test(source))) {
        throw new Error(`Unsafe SVG content is not allowed: ${filePath}`)
      }

      return null
    },
  }
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    svgSafety(),
    svgr({ include: /[/\\]src[/\\]app[/\\]assets[/\\].*\.svg\?react$/ }),
  ],
})
