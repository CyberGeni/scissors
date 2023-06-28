import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/static/Home'
import Login from './pages/static/Login/index'
import Register from './pages/static/Register/index'
import Layout from './components/Layout'
import DashboardLayout from './pages/protected/Dashboard'
import Dashboard from './pages/protected/Dashboard/Dashboard'
import ProtectedRoutes from './components/ProtectedRoutes'
import supabase from './supabase'
import { useState, useEffect } from 'react'
import Plans from './pages/protected/Dashboard/Plans'
import Settings from './pages/protected/Dashboard/Settings'
const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  // Check if user is authenticated to view protected routes
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data) {
        setAuthenticated(true)
      } else {
        setAuthenticated(false)
      }
    })();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* internal route */}
        <Route path="/dashboard" element={authenticated ? (
          <ProtectedRoutes authenticated={authenticated}>
            <DashboardLayout />
          </ProtectedRoutes>
        ) : (
          null
        )}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard/plans" element={<Plans />} />
          <Route path="/dashboard/settings" element={<Settings />} />
        </Route>
        {/* <Route path="/plans" element={authenticated ? (
          <ProtectedRoutes authenticated={authenticated}>
            <Plans />
          </ProtectedRoutes>
        ) : (
          <Navigate to="/login" replace />
        )}>
          <Route index element={<Dashboard />} />
        </Route> */}
      </Routes>
    </Router>

  )
}

export default App
