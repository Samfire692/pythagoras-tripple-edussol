import React, { useState } from 'react'
import { EditProfile } from './AdminSettings/EditProfile'
import { AdminSignup } from './AdminSignup'
import { Role } from './AdminSettings/Role'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const AdminSetting = () => {

    const [active, setActive] = useState("editprofile")
    const [open, setOpen] = useState(false);
  return (
    <div className='flex '>
        <div className=' flex h-157 items-center gap-2 px-2'>
            <div className={`transition-all duration-500 overflow-hidden z-10 ${open ? "w-0" : "w-40"}`}>
             <div className={`grid gap-2 w-40 bg-blue-600 p-2.5 rounded-xl text-white mt-3 overflow-hidden`}>
            <button className={`p-1.5 rounded-lg font-bold hover:bg-yellow-500/90 ${active === "editprofile" ? "bg-yellow-500/90" : ""}`} onClick={()=> setActive("editprofile")}>Edit Profile</button>

            <button className={`p-1.5 rounded-lg font-bold hover:bg-yellow-500/90 ${active === "adduser" ? "bg-yellow-500/90" : ""}`} onClick={()=> setActive("adduser")}>Add Users</button>
            </div>
            </div>

            <div className='shadow shadow-slate-500 rounded-sm p-1 bg-blue-600 cursor-pointer z-10' onClick={()=> setOpen(!open)}>
                <ChevronLeft size={25} className={`text-white transition-all duration-500 ${!open ? "" : "rotate-180"}`}/>
            </div>
        </div>

        <div className='mt-2 absolute w-full px-2'>
           {active === "editprofile" && (
              <EditProfile/>
           )}

           {active === "adduser" && (
              <AdminSignup/>
           )}
        </div>
    </div>
  )
}
