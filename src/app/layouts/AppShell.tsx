import { identityAssets } from '../assets/icons'
import { versionManifest } from '../configs/version'

export default function AppShell() {
  return (
    <main className="app-shell" data-testid="app-root">
      <div className="app-shell__content">
        <img
          className="app-shell__logo"
          src={identityAssets.logo.file}
          alt="Logotipo Postify"
        />
        <p className="app-shell__version">Versão {versionManifest.version}</p>
      </div>
    </main>
  )
}
