import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../Context/AdminProvider'
import offlinePic from '../assets/admin profile pic.jfif'
import { supabase } from '../supabaseClient';
import { toast } from 'sonner';

export const AdminProfile = () => {

    const {admin, setAdmin} = useContext(AdminContext);
    const [logAdmin, setLogadmin] = useState([]);
    const [open, setOpen] = useState(false)

    const fetchData = async()=>{
      try{
        const {data, error} = await supabase
        .from("PYTHA_admin")
        .select("*")
        .eq("id", admin.id)
        .maybeSingle();

        if(error) throw error;
        setLogadmin(data);
        // console.log("logged in",data);
      }catch(error){
         toast.error(error.message);
      }finally{

      }
    }

    useEffect(()=> {
        if(admin?.id){
            fetchData();
        }
    }, [admin]);
  return (
    <div className='z-10'>
      <div onClick={()=> setOpen(!open)} className='cursor-pointer'>
        <img src={logAdmin?.img || offlinePic} alt="" className={`w-10 h-10 rounded-full mt-1 shadow shadow-slate-300 transition-all duration-500 object-cover ${!open ? "-rotate-360" : ""}`}/>
      </div>

      <div className={`overflow-y-scroll bg-white absolute right-0 transition-all duration-500 ${!open ? "h-0" : "h-[92vh]"}`}>
         <div className='shadow shadow-slate-300 w-80  me-2 rounded-xl mt-2'>
         {/* <h2 className='text-center font-bold text-2xl'>Admin Profile</h2> */}
           <div className='bg-blue-600/70 rounded-t-xl profile-cover'>
                <img src={logAdmin?.img || offlinePic} alt="" className='w-30 h-30 rounded-full mx-3 absolute mt-25 shadow-xl z-10 object-cover'/>
           </div>

           <div className='relative p-2.5 grid gap-2'>
             <div className={`shadow shadow-slate-400 p-2 flex justify-center items-center rounded-2xl mb-2 ${logAdmin?.bio ? "" : "text-sm h-20 text-slate-400"}`}>
               {logAdmin.bio || "No Bio"}
             </div>

             <div className='grid'>
               <label htmlFor="" className='text-sm font-bold uppercase text-slate-400/70 mb-1'>Full Name</label>
               <span className='shadow shadow-slate-200 rounded-lg p-2 text-slate-500'>{logAdmin?.fullname || "Null"}</span>
             </div>

             <div className='grid'>
               <label htmlFor="" className='text-sm font-bold uppercase text-slate-400/70 mb-1'>Email</label>
               <span className='shadow shadow-slate-200 rounded-lg p-2 text-slate-500'>{logAdmin?.email || "Null"}</span>
             </div>

             <div className='grid'>
               <label htmlFor="" className='text-sm font-bold uppercase text-slate-400/70 mb-1'>Phone Number</label>
               <span className='shadow shadow-slate-200 rounded-lg p-2 text-slate-500'>{logAdmin?.phonenumber || "Null"}</span>
             </div>

             <div className='grid'>
               <label htmlFor="" className='text-sm font-bold uppercase text-slate-400/70 mb-1'>Role</label>
               <span className='shadow shadow-slate-200 rounded-lg p-2 text-slate-500'>{logAdmin?.fullname || "Null"}</span>
             </div>

             <div className='mt-2'>
                <button className='p-2 bg-blue-600/70 text-white font-bold rounded-lg w-full'>Edit Profile</button>
             </div>
           </div>
         </div>
      </div>
    </div>
  )
}
