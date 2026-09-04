import { Button, ConfigProvider } from 'antd'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from './configs/query-client'
import { antdThemeConfig } from './configs/antd-theme'

export default function App() {
  return (
    <ConfigProvider theme={antdThemeConfig}>
      <QueryClientProvider client={queryClient}>
        <div data-testid="app-root">Postify</div>
        <Button type="primary" data-testid="app-button">
          Test Button
        </Button>
      </QueryClientProvider>
    </ConfigProvider>
  )
}
