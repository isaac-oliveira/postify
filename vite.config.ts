import { readFileSync, realpathSync } from 'node:fs'
import path from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

const svgReactAssetImport = /[/\\]src[/\\]app[/\\]assets[/\\].*\.svg\?(?:react|import&react)$/
const svgFileSuffix = /[?#].*$/
const unsafeSvgContent = [
  /<script\b/i,
  /<foreignObject\b/i,
  /\bon[a-z][\w:-]*\s*=/i,
  /javascript\s*:/i,
  /@import\b/i,
  /(?:href|xlink:href|src)\s*=\s*(['"])(?!\s*(?:#|\1\s*$))[^'"]+\1/i,
  /url\(\s*(['"]?)(?!#)[^)]*\1\s*\)/i,
]

const strictSemVerPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const readJson = (filePath: string): unknown =>
  JSON.parse(readFileSync(filePath, 'utf8')) as unknown

const readVersion = (value: unknown, source: string): string => {
  if (!isRecord(value) || typeof value.version !== 'string' || !strictSemVerPattern.test(value.version)) {
    throw new Error(`${source} must contain a valid SemVer version`)
  }

  return value.version
}

const versionConsistency = () => ({
  name: 'postify-version-consistency',
  enforce: 'pre' as const,
  configResolved(config: { root: string }) {
    const packageManifest = readJson(path.resolve(config.root, 'package.json'))
    const lockManifest = readJson(path.resolve(config.root, 'package-lock.json'))
    const packageVersion = readVersion(packageManifest, 'package.json')
    const lockfileVersion = readVersion(lockManifest, 'package-lock.json')
    const lockPackages = isRecord(lockManifest) ? lockManifest.packages : undefined
    const lockRoot = isRecord(lockPackages) ? lockPackages[''] : undefined
    const lockRootVersion = readVersion(lockRoot, 'package-lock.json packages[""]')

    if (packageVersion !== lockfileVersion || packageVersion !== lockRootVersion) {
      throw new Error('package.json and package-lock.json versions must match')
    }
  },
})

const svgSafety = () => {
  let approvedAssetRoot = ''

  return {
    name: 'postify-svg-safety',
    enforce: 'pre' as const,
    configResolved(config: { root: string }) {
      approvedAssetRoot = realpathSync(path.resolve(config.root, 'src/app/assets'))
    },
    load(id: string) {
      if (!svgReactAssetImport.test(id)) {
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
    versionConsistency(),
    tailwindcss(),
    react(),
    svgSafety(),
    svgr({ include: svgReactAssetImport }),
  ],
})
