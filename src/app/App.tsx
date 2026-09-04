import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from './configs/query-client'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div data-testid="app-root">Postify</div>
    </QueryClientProvider>
  )
}
