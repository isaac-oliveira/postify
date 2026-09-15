import { version as packageVersion } from '../../../package.json'

const strictSemVerPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/

const readVersion = (value: unknown): string => {
  if (typeof value !== 'string' || !strictSemVerPattern.test(value)) {
    throw new Error('A versão da aplicação deve ser uma string SemVer válida')
  }

  return value
}

const applicationVersion = readVersion(packageVersion)

export const versionManifest = Object.freeze({
  version: applicationVersion,
})
