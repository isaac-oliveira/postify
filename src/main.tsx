import './global.css'

import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { RouterProvider } from 'react-router/dom'

import GlobalErrorBoundary from './app/components/GlobalErrorBoundary'
import { Favicon } from './app/assets/icons'
import { i18n } from './app/configs/i18n'
import { router } from './app/router'

const faviconSelector = 'link[rel~="icon"]'
const faviconRelation = 'icon'
const faviconMimeType = 'image/png'

const configureFavicon = (): void => {
  const existingFavicons = Array.from(
    document.head.querySelectorAll<HTMLLinkElement>(faviconSelector),
  )
  const favicon = existingFavicons[0] ?? document.createElement('link')

  favicon.rel = faviconRelation
  favicon.type = faviconMimeType
  favicon.href = Favicon

  if (existingFavicons.length === 0) {
    document.head.appendChild(favicon)
  }

  for (const duplicate of existingFavicons.slice(1)) {
    duplicate.remove()
  }
}

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Elemento raiz #root não encontrado')
}

configureFavicon()

createRoot(rootElement).render(
  <GlobalErrorBoundary>
    <I18nextProvider i18n={i18n}>
      <RouterProvider router={router} />
    </I18nextProvider>
  </GlobalErrorBoundary>,
)
