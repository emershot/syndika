import React, { ReactNode, ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <AlertCircle className="h-16 w-16 text-destructive/50" />
            </div>
            
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              Algo deu errado
            </h1>
            
            <p className="text-muted-foreground mb-6">
              Desculpe, encontramos um erro inesperado. Por favor, tente novamente.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="bg-muted p-4 rounded-lg text-left text-sm overflow-auto mb-6 max-h-40 text-destructive">
                {this.state.error.toString()}
              </pre>
            )}

            <div className="flex flex-col gap-2">
              <Button onClick={this.handleReset}>
                Ir ao Painel
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Recarregar Página
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
