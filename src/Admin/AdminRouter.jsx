import React, { useState } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { AdminSignup } from './AdminSignup'
import { Adminlogin } from '../Admin/Adminlogin'
import { AdminDashboard } from './AdminDashboard'
import { AdminNavbar } from './AdminNavbar'
import { AdminProfile } from './AdminProfile'
import { Bell, Settings } from 'lucide-react'
import { AdminSetting } from './AdminSetting'
import { AdminManagement } from './AdminManagement'

export const AdminRouter = () => {

  const [navBar, setNavbar]= useState(null);
  
  return (
    <Routes>
        <Route element={
          <>
           <div className='flex'>
                <div className='flex'>
                  <div className={`transition-all duration-500 overflow-hidden ${!navBar ? "hidden" : "flex"}`}>
                    <AdminNavbar/> 
                  </div>

                  <div className='p-2 mt-2'>
                    <button className={`border rounded-md p-0.5 absolute transition-all duration-400 ${navBar ? "left-56" : "left-2"}`} onClick={()=> setNavbar(!navBar)}><span className='rotate-90 block'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	                  <path d="M0 0h24v24H0z" fill="none" />
	                  <path fill="currentColor" d="M12 8a1 1 0 0 0-1 1v11a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1m7-4a1 1 0 0 0-1 1v15a1 1 0 0 0 2 0V5a1 1 0 0 0-1-1M5 12a1 1 0 0 0-1 1v7a1 1 0 0 0 2 0v-7a1 1 0 0 0-1-1" />
                    </svg>
                    </span></button>
                  </div>
                </div>

                <div className='gap-2 w-full'>
                  <div className='flex justify-between'>
                      <div className='flex w-full justify-end me-3 mt-2 h-fit'>
                      {/* <div className='ms-8'>
                        <input type="text" className='shadow shadow-slate-300 mt-1.5 h-9 rounded-lg w-70 p-2' placeholder='Search . . .'/>
                      </div> */}

                      <div className='flex gap-3'>
                        <AdminProfile/>
                      </div>
                     </div>
                  </div>

                  <div className='w-full mt-2 -ms-4'>
                    <Outlet/>
                  </div>
                </div>
           </div>
          </>
        }>
          <Route path='/signup' element={<AdminSignup/>}/>
          <Route path='/admindashboard' element={<AdminDashboard/>}/>
          <Route path='/adminsetting' element={<AdminSetting/>}/>
          <Route path='/adminmanagement' element={<AdminManagement/>}/>
        </Route>

        <Route path='/adminlogin' element={<Adminlogin/>}/>
    </Routes>
  )
}
