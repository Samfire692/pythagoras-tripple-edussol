import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { Home } from './Home'

export const Router = () => {
  return (
     <Routes>
        <Route element={<Outlet/>}>
         <Route path='/' element={<Home/>}/>
        </Route>
     </Routes>
  )
}
