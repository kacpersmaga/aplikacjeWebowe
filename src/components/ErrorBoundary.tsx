import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-bg-sidebar border border-danger/30 rounded-2xl p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-danger/10 border border-danger/20 rounded-2xl flex items-center justify-center mx-auto text-2xl">
              ⚠️
            </div>
            <h2 className="font-display font-bold text-xl text-text-main">Coś poszło nie tak</h2>
            <p className="text-sm text-text-muted">
              Wystąpił nieoczekiwany błąd. Odśwież stronę, aby spróbować ponownie.
            </p>
            {this.state.error && (
              <pre className="text-left text-xs text-danger/70 bg-danger/5 border border-danger/10 rounded-lg p-3 overflow-auto max-h-32 font-mono">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-all"
            >
              Odśwież stronę
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
