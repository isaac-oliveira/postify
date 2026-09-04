import { createRoot } from 'react-dom/client'

function App() {
  return <div data-testid="app-root">Postify</div>
}

createRoot(document.getElementById('root')).render(<App />)
