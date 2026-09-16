import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

export const i18n = i18next.createInstance()

i18n.use(initReactI18next).init({
  fallbackLng: 'pt-BR',
  initImmediate: false,
  lng: 'pt-BR',
  resources: {},
  returnNull: false,
  supportedLngs: ['pt-BR'],
})
