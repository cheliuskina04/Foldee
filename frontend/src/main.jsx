import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './Styles/index.css'
import App from './App.jsx'
import Register from './register.jsx'  
import Login from './login.jsx';
import Home from './home.jsx'
import JoinProject from './components/JoinProject.jsx'
import Features from './features.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/join-project/:projectId" element={<JoinProject />} />
        <Route path="/features" element={<Features />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
