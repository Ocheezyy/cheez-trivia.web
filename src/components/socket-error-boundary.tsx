import React, { Component, ErrorInfo } from "react";
import { toast } from "sonner";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SocketErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Socket component error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);

    // Show error toast
    toast.error("Connection error occurred. Please refresh the page.");
  }

  // Attempt to recover the component
  tryAgain = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 rounded-md bg-red-50 border border-red-200">
            <h3 className="text-lg font-semibold text-red-800">
              Something went wrong with the game connection
            </h3>
            <p className="text-sm text-red-600 mt-2">
              {this.state.error?.message || "An unknown error occurred"}
            </p>
            <button
              onClick={this.tryAgain}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping socket-dependent components
export function withSocketErrorBoundary<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithSocketErrorBoundary(props: P) {
    return (
      <SocketErrorBoundary>
        <WrappedComponent {...props} />
      </SocketErrorBoundary>
    );
  };
}
