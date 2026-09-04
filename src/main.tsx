import { createRoot } from 'react-dom/client'

function App() {
  return <div data-testid="app-root">Postify</div>
}

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Elemento raiz #root não encontrado')
}

createRoot(rootElement).render(<App />)
