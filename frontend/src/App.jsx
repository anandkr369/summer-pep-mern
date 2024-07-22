import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Signup from './components/Signup'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Opportunity from './components/Opportunity'

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='' element={<Opportunity />}/>
          <Route path='/login' element ={<Login />}/>
          <Route path='/signup' element={<Signup />}/>
          <Route path='/dashboard' element={<Dashboard />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
