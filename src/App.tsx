import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/static/Home'
import Login from './pages/static/Login/index'
import Register from './pages/static/Register/index'
import Layout from './components/Layout'
import Dashboard from './pages/protected/Dashboard/Dashboard'
import ProtectedRoutes from './components/ProtectedRoutes'
import supabase from './supabase'
import { useState, useEffect } from 'react'
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

        <Route path="/dashboard" element={authenticated ? (
          <ProtectedRoutes authenticated={authenticated}>
            <Dashboard />
          </ProtectedRoutes>
        ) : (
          <Navigate to="/login" replace />
        )} />

      </Routes>
    </Router>

  )
}

export default App
