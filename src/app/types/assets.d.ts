/// <reference types="vite/client" />

declare module '*.svg?react' {
  import type { FC, SVGProps } from 'react'

  const component: FC<SVGProps<SVGSVGElement>>
  export default component
}

declare module '*.svg?url' {
  const source: string
  export default source
}

declare module '*.png?url' {
  const source: string
  export default source
}
