import { useState, useEffect, useCallback } from 'react'
import FilterBar from './components/FilterBar'
import LogList from './components/LogList'
import { fetchLogs } from './api/logs'
import LogIngestForm from './components/LogIngestForm'
import './App.css'

function App() {
  const [filters, setFilters] = useState({})
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // Debounce message search
  const [debouncedFilters, setDebouncedFilters] = useState(filters)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters)
    }, 400)
    return () => clearTimeout(handler)
  }, [filters])

  const loadLogs = useCallback(async (activeFilters) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchLogs(activeFilters)
      setLogs(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLogs(debouncedFilters)
  }, [debouncedFilters, loadLogs])

  return (
    <div className="app-bg">
      <header className="app-header">
        <span className="brand">🔎 Log Ingestion & Query System</span>
      </header>
      <main className="main-card">
        <LogIngestForm onSuccess={() => loadLogs(debouncedFilters)} />
        <FilterBar filters={filters} onChange={setFilters} />
        {loading && <div>Loading logs...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <LogList logs={logs} />
      </main>
    </div>
  )
}

export default App
