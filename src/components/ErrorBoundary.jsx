import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary Caught Runtime Error]:', error, errorInfo)
  }

  handleReset = () => {
    localStorage.clear()
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-3xl font-black">
              ⚠️
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-100">應用程式發生預期外例外</h2>
              <p className="text-xs text-slate-400 font-mono break-all bg-slate-950 p-3 rounded-xl">
                {this.state.error?.toString() || 'Uncaught Render Exception'}
              </p>
            </div>
            <button
              onClick={this.handleReset}
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-lg transition active:scale-95"
            >
              🔄 重置暫存狀態並重新載入 App
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
