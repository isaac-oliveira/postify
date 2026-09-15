import { Logo } from '../assets/icons'
import { version } from '../configs/version'

export default function AppShell() {
  return (
    <main className="app-shell" data-testid="app-root">
      <div className="app-shell__content">
        <img
          className="app-shell__logo"
          src={Logo}
          alt="Logotipo Postify"
        />
        <p className="app-shell__version">Versão {version}</p>
      </div>
    </main>
  )
}
