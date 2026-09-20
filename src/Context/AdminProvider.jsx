import React, {useState, useEffect} from 'react'
import { supabase } from '../supabaseClient';
import { toast } from 'sonner';
import { createContext } from 'react';

export const AdminContext = createContext();

export const AdminProvider = ({children}) => {

    const [adminProfile , setAdminprofile] = useState([]);
    const [admin, setAdmin] = useState(null);

    const fetchData = async()=> {
       try{
          const AdminInfo = JSON.parse(localStorage.getItem("PYTHA_ADMIN"));

          setAdminprofile(AdminInfo);

          const {data:adminData , error:adminError} = await supabase
          .from("PYTHA_admin")
          .select("*")
          .eq("id", AdminInfo.id)
          .maybeSingle();

          if(adminError) throw adminError;
         //  console.log("admin", adminData)
         //  console.log(AdminInfo.id)

          setAdmin(adminData);
       }catch(error){
          console.log(error.message)
       }finally{

       }
    }

    useEffect(()=> {
        fetchData();
    }, [])

  return (
    <AdminContext.Provider
      
      value={{
         admin,
         setAdmin,
         adminProfile,
         setAdminprofile
      }}>
         {children}
      </AdminContext.Provider>
  )
}
