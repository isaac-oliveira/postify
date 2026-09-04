import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { RouterProvider } from 'react-router/dom'

import GlobalErrorBoundary from './app/components/GlobalErrorBoundary'
import { i18n } from './app/configs/i18n'
import { router } from './app/router'
import './global.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Elemento raiz #root não encontrado')
}

createRoot(rootElement).render(
  <GlobalErrorBoundary>
    <I18nextProvider i18n={i18n}>
      <RouterProvider router={router} />
    </I18nextProvider>
  </GlobalErrorBoundary>,
)
