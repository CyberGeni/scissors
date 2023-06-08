import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/static/Home'
import Login from './pages/static/Login/index'
import Register from './pages/static/Register/index'
import Layout from './components/Layout'
import Dashboard from './pages/protected/Dashboard/Dashboard'
import ProtectedRoutes from './components/ProtectedRoutes'
import supabase from './supabase'
import { useState, useEffect } from 'react'
import { User } from './types/userTypes'

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  
  // Check if user is authenticated to view protected routes
  useEffect(() => {
    const checkAuthentication = async () => {
      const user = await supabase.auth.getUser();
      setAuthenticated(!!user);
    };
    checkAuthentication();
  }, []);

  // fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const session = await supabase.auth.getSession();
      const currentUser = session?.data?.session?.user;

      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <Router>
        <Routes user={user}>

          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<h1>404</h1>} />


          {/* <ProtectedRoutes> */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes authenticated={authenticated}>
                <Dashboard user={user} />
              </ProtectedRoutes>
            }
          />
          {/* </ProtectedRoutes> */}
        </Routes>
      </Router>
    </>
  )
}

export default App
