import { ConfigProvider } from 'antd'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from './configs/query-client'
import { antdThemeConfig } from './configs/antd-theme'
import AppShell from './layouts/AppShell'

export default function App() {
  return (
    <ConfigProvider theme={antdThemeConfig}>
      <QueryClientProvider client={queryClient}>
        <AppShell />
      </QueryClientProvider>
    </ConfigProvider>
  )
}
