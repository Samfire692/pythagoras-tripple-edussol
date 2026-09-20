import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const AdminSignup = () => {

    const [email, setEmail] = useState("");
    const [phoneNumber, setPhonenumber] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const Submit = async(e)=>{
      e.preventDefault();
      setLoading(true);

      function generatePassword(length = 10){
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

      const array = new Uint32Array(length);
      crypto.getRandomValues(array);

      return Array.from(array, x => chars[x % chars.length]).join("");
      }

      const password = generatePassword();

      try{
        // const {data:authData, error:authError} = await supabase.auth.signUp({
        //    email:email,
        //    password:password
        // });

        // if(authError) throw authError;

        // toast.success("working")
    
          const {data:authData, error:authError} = await supabase.auth.signUp({
            email:email || null,
            password:password,
          })

          if(authError) throw authError;

          const {data:dbData, error:dbError} = await supabase
          .from("PYTHA_admin")
          .insert({
            id:authData.user.id,
            email:email
          })

          if (dbError) throw dbError;
          toast.success("Uploaded Succesfully");
          Swal.fire({
            title:"Notice!",
            text:`Your password is ${password}`,
            confirmButtonText:"Ok",
            allowEscapeKey:false,
            allowOutsideClick:false,
          })
          navigate("/adminlogin");
        
      }catch(error){
          toast.error(error.message);
      }finally{
        setLoading(false);
      }
    }

  return (
    <div className='flex justify-center items-center h-[70vh] p-2 w-full'>
       <form action="" className='md:w-lg w-full p-3' onSubmit={Submit}>
          <h2 className='text-4xl font-extrabold text-center text-blue-600/70' style={{fontFamily:"sans-serif"}}>Admin Signup</h2>

          <div className='grid mt-4'>
             <input type="email" className='border border-slate-200 outline-blue-600 h-11 rounded-md p-2' placeholder='name@gmail.com' onChange={(e)=> setEmail(e.target.value)}/>
          </div>

          <button className={`w-full text-white mt-4 p-2 rounded-md ${email ? "bg-blue-600" : "bg-blue-300/70 cursor-not-allowed"}`} disabled={!email}>{loading ? "Loading . . ." : "Submit"}</button>
       </form>
    </div>
  )
}
