import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import './App.css'
import { ToastProvider } from './components/ui/ToastProvider'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import FavoritesTab, { type FavoriteItem } from './components/tabs/FavoritesTab'
import AddFavoriteTab from './components/tabs/AddFavoriteTab'
// import TmdbTab from './components/tabs/TmdbTab'

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
  const [authUser, setAuthUser] = useState<{ id: number; email: string; name: string } | null>(null)
  const [checking, setChecking] = useState(false)
  const [activeTab, setActiveTab] = useState<'favorites' | 'add' | 'tmdb'>('favorites')
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [favLoading, setFavLoading] = useState(false)
  const [favOffset, setFavOffset] = useState(0)
  const [favHasMore, setFavHasMore] = useState(true)
  const favLimit = 10
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const isFetchingRef = useRef(false)
  const favOffsetRef = useRef(0)
  const favHasMoreRef = useRef(true)
  const lastRequestedOffsetRef = useRef<number | null>(null)

  useEffect(() => {
    if (!hash) window.location.hash = '#/'
  }, [hash])

  // Verify token and protect home route
  useEffect(() => {
    const protect = async () => {
      if (!route.startsWith('/')) return
      if (route === '/' || route === '') {
        const token = sessionStorage.getItem('token')
        if (!token) {
          setAuthUser(null)
          window.location.hash = '#/login'
          return
        }
        try {
          setChecking(true)
          const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000'
          const resp = await fetch(`${API_URL}/auth/verify`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          const data = await resp.json().catch(() => ({}))
          if (!resp.ok) {
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('user')
            setAuthUser(null)
            window.location.hash = '#/login'
            return
          }
          if (data?.user) {
            sessionStorage.setItem('user', JSON.stringify(data.user))
            setAuthUser(data.user)
          }
        } finally {
          setChecking(false)
        }
      }
    }
    protect()
  }, [route])

  // Keep refs in sync with state
  useEffect(() => { favOffsetRef.current = favOffset }, [favOffset])
  useEffect(() => { favHasMoreRef.current = favHasMore }, [favHasMore])

  // Loader function guarded by refs to prevent duplicate same-offset requests
  const loadPage = async () => {
    if (activeTab !== 'favorites') return
    if (isFetchingRef.current) return
    if (!favHasMoreRef.current) return
    const token = sessionStorage.getItem('token')
    if (!token) return
    const currentOffset = favOffsetRef.current
    if (lastRequestedOffsetRef.current === currentOffset) return
    try {
      isFetchingRef.current = true
      lastRequestedOffsetRef.current = currentOffset
      setFavLoading(true)
      const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000'
      const params = new URLSearchParams({ limit: String(favLimit), offset: String(currentOffset) })
      const resp = await fetch(`${API_URL}/favorites?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await resp.json().catch(() => ({}))
      if (!resp.ok) return
      const newItems: FavoriteItem[] = Array.isArray(data?.items) ? data.items : []
      setFavorites((prev) => [...prev, ...newItems])
      if (data?.nextOffset == null || newItems.length === 0) {
        setFavHasMore(false)
        favHasMoreRef.current = false
      } else {
        setFavOffset(data.nextOffset)
        favOffsetRef.current = data.nextOffset
      }
    } finally {
      setFavLoading(false)
      isFetchingRef.current = false
    }
  }

  // Reset and initial load when entering favorites tab or auth changes
  useEffect(() => {
    const init = async () => {
      if (activeTab !== 'favorites') return
      setFavorites([])
      setFavOffset(0)
      setFavHasMore(true)
      favOffsetRef.current = 0
      favHasMoreRef.current = true
      lastRequestedOffsetRef.current = null
      await loadPage()
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, authUser])

  // IntersectionObserver to trigger loading more when sentinel is visible
  useEffect(() => {
    if (activeTab !== 'favorites') return
    const el = loadMoreRef.current
    if (!el) return
    const obs = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry.isIntersecting) { loadPage() }
    }, { root: null, rootMargin: '200px', threshold: 0 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [activeTab, favLoading, favHasMore])

  if (route.startsWith('/login')) {
    return (
      <ToastProvider>
        <Login />
      </ToastProvider>
    )
  }
  if (route.startsWith('/signup')) {
    return (
      <ToastProvider>
        <Signup />
      </ToastProvider>
    )
  }

  return (
    <ToastProvider>
      <div className="min-h-dvh bg-gray-50">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <a href="#/" className="text-lg font-semibold text-gray-900">Fav Movies</a>
        <nav className="flex items-center gap-3">
          {authUser ? (
            <>
              <span className="text-sm text-gray-700">{authUser.name}</span>
              <button
                className="text-sm font-medium text-gray-700 hover:text-red-600"
                onClick={() => {
                  sessionStorage.removeItem('token')
                  sessionStorage.removeItem('user')
                  setAuthUser(null)
                  window.location.hash = '#/login'
                }}
              >Logout</button>
            </>
          ) : (
            <>
              <a href="#/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600">Login</a>
              <a href="#/signup" className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-md">Sign up</a>
            </>
          )}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-12">
        {checking ? (
          <section className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-100">Checking session...</section>
        ) : (
          <section className="rounded-xl bg-white p-0 shadow-sm ring-1 ring-gray-100">
            <div className="border-b border-gray-200 px-4 pt-4">
              <nav className="flex gap-2" aria-label="Tabs">
                <button
                  className={`rounded-t-md px-4 py-2 text-sm font-medium ${activeTab === 'favorites' ? 'bg-white text-indigo-600 border-x border-t border-gray-200' : 'text-gray-600 hover:text-indigo-600'}`}
                  onClick={() => setActiveTab('favorites')}
                >My Favorites</button>
                <button
                  className={`rounded-t-md px-4 py-2 text-sm font-medium ${activeTab === 'add' ? 'bg-white text-indigo-600 border-x border-t border-gray-200' : 'text-gray-600 hover:text-indigo-600'}`}
                  onClick={() => setActiveTab('add')}
                >Add Favorite</button>
                
              </nav>
            </div>
            <div className="p-6">
              {activeTab === 'favorites' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Your favorite movies</h2>
                  <FavoritesTab items={favorites} loading={favLoading} />
                  <div ref={loadMoreRef} className="h-8" />
                  <div className="mt-2 text-sm text-gray-500">
                    {favLoading ? 'Loading more…' : favHasMore ? '' : 'No more items'}
                  </div>
                </div>
              )}
              {activeTab === 'add' && (
                <AddFavoriteTab onCreated={() => setActiveTab('favorites')} />
              )}
              {/* {activeTab === 'tmdb' && <TmdbTab />} */}
            </div>
          </section>
        )}
      </main>
      </div>
    </ToastProvider>
  )
}

export default App
