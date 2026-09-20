import React, { useState, useContext } from 'react'
import backgroundPic from  '../assets/pexels-miami302-16257100.jpg'
import { Eye, EyeClosed } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from "../Context/AdminProvider";

export const Adminlogin = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAdmin } = useContext(AdminContext);

  const Login = async(e)=> {
    e.preventDefault();
    setLoading(true);

    try{
      const {data:authData, error:authError} = await supabase.auth.signInWithPassword({
        email:email,
        password:password
      })
       if(authError) throw authError;
      
       const PythaadminProfile = {
         id:authData.user.id
       }

       const {data:dbData, error:dbError} = await supabase
       .from("PYTHA_admin")
       .select("*")
       .eq("id", PythaadminProfile?.id)
       .maybeSingle()

       if (!dbData) {
       await supabase.auth.signOut();
       throw new Error("Admin account not found.");
       }

       setAdmin(dbData);

       localStorage.setItem("PYTHA_ADMIN", JSON.stringify(dbData));

      toast.success("Login Successfully");

      navigate("/adminmanagement");

    }catch(error){
      toast.error(error.message);
    }finally{
      setLoading(false);
    }
  }

    const [showPassword, setShowpassword] = useState(null);
  return (
    <div className=''>
       <div><img src={backgroundPic} alt="" className='h-screen w-full blur-xs absolute' loading='lazy'/></div>

       <div className=''>
         <div className='absolute inset-0 lg:w-[80vw] md:w-[88vw] md:h-[60vh] lg:h-[80vh] m-auto flex md:border-4 border-white rounded-xl'>
            <img src={backgroundPic} alt="" className='md:w-[88vw] md:h-[59vh] lg:h-[79vh] object-cover lg:rounded-xl'/>

            <div className='absolute flex justify-end md:gap-4 lg:gap-8 w-full bg-black/10'>
                <div className='md:h-[60vh] lg:h-[80vh] w-0.5 bg-white/50 rotate-10 md:block hidden'></div>
                <div className='text-white p-8 md:h-[60vh] lg:h-[80vh] h-screen lg:w-lg md:w-sm w-full flex justify-center items-center'>
                 <form action="" className='md:w-xs w-full' onSubmit={Login}>
                    <h2 className='text-4xl text-center font-bold' style={{fontFamily:"sans-serif", letterSpacing:"2px"}}>Welcome Back</h2>

                    <div className='grid mt-5 gap-1'>
                        <label htmlFor="" className='font-bold text-lg'>Email</label>
                        <input type="email" className='border h-12 w-full rounded-lg required p-2.5' placeholder='name@gmail.com' onChange={(e)=> setEmail(e.target.value)} required/>
                    </div>

                    <div className='grid mt-3 gap-1'>
                        <label htmlFor="" className='font-bold text-lg'>Password</label>
                        <div className='flex justify-end items-center'>
                              <input type={showPassword ? "text" : "password"} className='border h-12 w-full rounded-lg required p-2.5' placeholder='* * * * * *' onChange={(e)=> setPassword(e.target.value)} required/>
                            <div className=' absolute me-2 mt-2'>
                              <button type='button' className='h-fit' onClick={()=> setShowpassword(!showPassword)} >{showPassword ? <Eye/> : <EyeClosed/> }</button>
                            </div>
                        </div>
                    </div>

                    <div className='mt-3'>
                        <button className='bg-yellow-400/30 w-full p-2 rounded-lg font-bold text-lg' disabled={loading}>{loading ? "Loading . . ." : "Login"}</button>
                    </div>
                 </form>
            </div>
            </div>
         </div>
       </div>
    </div>
  )
}
