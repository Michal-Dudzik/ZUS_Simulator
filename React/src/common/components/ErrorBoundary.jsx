import { Component } from 'react'
import { Button, Result } from 'antd'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled error caught by ErrorBoundary', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false })
    this.props.onReset?.()
  }

  render() {
    const { hasError } = this.state
    const { children, fallback } = this.props

    if (hasError) {
      if (typeof fallback === 'function') {
        return fallback({ resetErrorBoundary: this.handleReset })
      }

      if (fallback) {
        return fallback
      }

      return (
        <Result
          status="error"
          title="Something went wrong"
          subTitle="You can try again or reload the page."
          extra={[
            <Button key="retry" type="primary" onClick={this.handleReset}>
              Try again
            </Button>,
            <Button key="reload" onClick={() => window.location.reload()}>
              Reload page
            </Button>,
          ]}
        />
      )
    }

    return children
  }
}

export default ErrorBoundary
