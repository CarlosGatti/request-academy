"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type Props = {
  children: ReactNode;
  fallbackTitle?: string;
};

type State = {
  hasError: boolean;
  message?: string;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert tone="danger" title={this.props.fallbackTitle ?? "Something went wrong"}>
          <p className="mb-3">{this.state.message ?? "An unexpected error occurred."}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => this.setState({ hasError: false, message: undefined })}
          >
            Try again
          </Button>
        </Alert>
      );
    }

    return this.props.children;
  }
}
