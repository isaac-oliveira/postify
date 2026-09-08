import faviconFile from '../../../../docs/assets/favicon.png?url'
import iconFile from '../../../../docs/assets/icon.png?url'
import logoFile from '../../../../docs/assets/logo.png?url'

type AssetDimensions = Readonly<{
  width: number
  height: number
}>

type IdentityAsset = Readonly<{
  file: string
  dimensions: AssetDimensions
  colorModel: 'RGBA'
  mimeType: 'image/png'
  purpose: 'wordmark' | 'icon' | 'favicon'
}>

export const identityAssets = {
  logo: {
    file: logoFile,
    dimensions: {
      width: 1835,
      height: 701,
    },
    colorModel: 'RGBA',
    mimeType: 'image/png',
    purpose: 'wordmark',
  },
  icon: {
    file: iconFile,
    dimensions: {
      width: 1024,
      height: 1024,
    },
    colorModel: 'RGBA',
    mimeType: 'image/png',
    purpose: 'icon',
  },
  favicon: {
    file: faviconFile,
    dimensions: {
      width: 1024,
      height: 1024,
    },
    colorModel: 'RGBA',
    mimeType: 'image/png',
    purpose: 'favicon',
  },
} as const satisfies Readonly<
  Record<'logo' | 'icon' | 'favicon', IdentityAsset>
>
