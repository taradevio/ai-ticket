import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.jsx'
import { CustomerService } from './components/CustomerService.jsx';
import { User } from './components/User.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}/>
        <Route path='/tickets' element={<CustomerService />}/>
        <Route path='/ticket-submit' element={<User />}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
