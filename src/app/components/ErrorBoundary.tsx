import { Component, type ReactNode } from 'react';

// Root error boundary. Without this, any runtime error thrown during render or in
// a lifecycle/effect unmounts the entire React tree in React 18, leaving a blank
// screen with no explanation. Here we catch it and render a readable fallback so
// the preview always shows *something* — and the actual error is visible.
interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: unknown) {
    // Surface to the console for debugging in the preview.
    console.error('[ErrorBoundary] Caught render error:', error, info);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#fdeeeb] flex items-center justify-center mb-5">
          <span className="text-2xl">⚠️</span>
        </div>
        <h1 className="text-lg font-bold text-foreground mb-2">Something went wrong</h1>
        <p className="text-sm text-muted-foreground mb-4 max-w-[320px] leading-relaxed">
          The app hit an unexpected error while rendering. The details are below.
        </p>
        <pre className="w-full max-w-[360px] text-left text-[11px] text-[#c0392b] bg-[#fef6f4] border border-[#f5c6bd] rounded-xl p-3 overflow-auto whitespace-pre-wrap mb-5">
          {error.message}
        </pre>
        <button
          onClick={() => this.setState({ error: null })}
          className="h-11 px-6 rounded-full bg-primary text-sm font-semibold text-foreground hover:bg-primary transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }
}
