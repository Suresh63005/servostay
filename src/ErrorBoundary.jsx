import React from "react"; 
import './ErrorBoundary.css';  

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by Error Boundary:', error, errorInfo);
    }

    render() {
        const { hasError } = this.state;
        const { children } = this.props;

        if (hasError) {
            return (
                <div className="error-background">
                    <div className="error-container">
                        <img src="/image/action/danger.svg" alt="Error Icon" className="error-icon" />
                        <h2 className="error-title">Something went wrong!</h2>
                        <p className="error-message">We're sorry for the inconvenience. Please refresh the page.</p>
                    </div>
                </div>
            );
        }

        return children;
    }
}

export default ErrorBoundary;
