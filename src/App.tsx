import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/static/Home'
import Login from './pages/static/Login'
import Register from './pages/static/Register'
import Layout from './components/Layout'
import Dashboard from './pages/protected/Dashboard/Dashboard'
// import ProtectedRoutes from './components/ProtectedRoutes'

const App: React.FC = () => {

  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* <ProtectedRoutes> */}
          <Route path="/dashboard" element={<Dashboard />} />
        {/* </ProtectedRoutes> */}

        <Route path="*" element={<h1>404</h1>} />
      </Routes>
     </Router>
    </>
  )
}

export default App
