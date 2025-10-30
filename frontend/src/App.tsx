import { useEffect, useMemo, useSyncExternalStore } from 'react'
import './App.css'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'

function useHash() {
  const subscribe = (cb: () => void) => {
    window.addEventListener('hashchange', cb)
    return () => window.removeEventListener('hashchange', cb)
  }
  const getSnapshot = () => window.location.hash || '#/'
  const getServerSnapshot = () => '#/'
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

function App() {
  const hash = useHash()
  const route = useMemo(() => hash.replace(/^#/, ''), [hash])

  useEffect(() => {
    if (!hash) window.location.hash = '#/'
  }, [hash])

  if (route.startsWith('/login')) {
    return <Login />
  }
  if (route.startsWith('/signup')) {
    return <Signup />
  }

  return (
    <div className="min-h-dvh bg-gray-50">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <a href="#/" className="text-lg font-semibold text-gray-900">Fav Movies</a>
        <nav className="flex items-center gap-3">
          <a href="#/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600">Login</a>
          <a href="#/signup" className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-md">Sign up</a>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-12">
        <section className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome to Fav Movies</h1>
          <p className="mt-2 text-gray-600">Use the navigation to login or create an account.</p>
        </section>
      </main>
    </div>
  )
}

export default App
