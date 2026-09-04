import { Component, type ReactNode } from 'react'

type GlobalErrorBoundaryProps = {
  children: ReactNode
}

type GlobalErrorBoundaryState = {
  hasError: boolean
}

export default class GlobalErrorBoundary extends Component<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  state: GlobalErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): GlobalErrorBoundaryState {
    return { hasError: true }
  }

  componentDidMount(): void {
    window.addEventListener('error', this.handleGlobalError)
    window.addEventListener('unhandledrejection', this.handleGlobalError)
  }

  componentWillUnmount(): void {
    window.removeEventListener('error', this.handleGlobalError)
    window.removeEventListener('unhandledrejection', this.handleGlobalError)
  }

  private handleGlobalError = (event: Event): void => {
    event.preventDefault()
    this.setState({ hasError: true })
  }

  private renderFallback(): ReactNode {
    return (
      <main role="alert" aria-labelledby="global-error-title">
        <h1 id="global-error-title">Algo deu errado</h1>
        <p>Recarregue a página e tente novamente.</p>
      </main>
    )
  }

  render(): ReactNode {
    return this.state.hasError ? this.renderFallback() : this.props.children
  }
}
