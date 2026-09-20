import { useState } from 'react'
import './App.css'
import './index.css'
import { Home } from './user/Home'
import { Router } from './user/Router'
import { AdminRouter } from './Admin/AdminRouter'
import { Toaster } from 'sonner'


function App() {

  return (
    <>
         <Toaster position='top-right' richColors/>
         <Router/>
         <AdminRouter/>
    </>
  )
}

export default App
