import React, { act, useState } from 'react'
import { AdminEvent } from './AdminEvent'
import { AdminPopup } from './AdminPopup';
import { Role } from './AdminSettings/Role';
import { Link } from 'react-router-dom';
import { AdminLink } from './AdminLink';

export const AdminManagement = () => {

    const [active, setActive] = useState("events");
  return (
   <div className='ms-3'>
      
     <div className='bg-blue-600 text-white p-2 flex gap-3 rounded-xl md:w-fit w-full justify-evenly'>
       <button className={`p-1.5 border-l border-r rounded-lg ${active === "events" ? "bg-yellow-500" : ""}`} onClick={()=> setActive("events")}>Add Event</button>
       <button className={`p-1.5 border-l border-r rounded-lg ${active === "popup" ? "bg-yellow-500" : ""}`} onClick={()=> setActive("popup")}>Add Popup</button>
       <button className={`p-1.5 border-l border-r rounded-lg ${active === "role" ? "bg-yellow-500" : ""}`} onClick={()=> setActive("role")}>Teams</button>
       <button className={`p-1.5 border-l border-r rounded-lg ${active === "link" ? "bg-yellow-500" : ""}`} onClick={()=> setActive("link")}>Links</button>
     </div>

      <div className='p-2'>
        {active === "events" &&(
            <AdminEvent/>
        )}

        {active === "popup" &&(
            <AdminPopup/>
        )}

        {active === "role" && (
              <Role/>
        )}

        {active === "link" &&(
          <AdminLink/>
        )}
      </div>
   </div>
  )
}
