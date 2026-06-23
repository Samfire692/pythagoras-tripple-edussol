import React, { useState } from 'react'

export const Navbar = () => {

    const [navMenu , setNavmenu] = useState(false);

    const scrollToSection = (id)=> {
       const element = document.getElementById(id);
       if(element){
        element.scrollIntoView({behavior:"smooth"})
       }
    }
    
  return (
    <>
      <section id='navabar'>
         <div className='navbar bg-blue-500 flex lg:flex-row flex-col justify-around px-3 py-2 fixed w-full z-100'>
            <div className='flex gap-2 justify-between'>
               <div className='flex gap-2 w-md'>
                 <span className='text-white'>
                   <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24">
	               <path d="M0 0h24v24H0z" fill="none" />
	               <path fill="currentColor" d="M12 2L0 9l12 7l10-5.833V17.5h2V9zM3.999 13.49V18a9.99 9.99 0 0 0 8 4A9.99 9.99 0 0 0 20 18v-4.509l-8 4.667z" />
                   </svg>
                 </span>

                 <span className='flex flex-col text-white my-auto'>
                    <span className='text-xl' style={{fontFamily:"sans-serif"}}>Pythagoras</span>
                    <div className='-mt-1 flex gap-1' style={{fontFamily:"sans-serif"}}>
                        <small>Tripple</small>
                        <small>Edussol</small>
                    </div>
                 </span>
               </div>

              <div className='my-auto flex lg:hidden'>
                 <button className='text-white border-white border p-1 rounded-lg' onClick={()=> setNavmenu(!navMenu)}>
                    {!navMenu 
                    ?
                      <span>
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 24">
	                     <path d="M0 0h24v24H0z" fill="none" />
	                     <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5l14 0M5 19l14 0M5 12h14">
		                <animate fill="freeze" attributeName="d" dur="0.4s" values="M5 5l14 14M5 19l14 -14M12 12h0;M5 5l14 0M5 19l14 0M5 12h14" />
	                    </path>
                        </svg>
                      </span>
                    :
                     <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 24">
	                    <path d="M0 0h24v24H0z" fill="none" />
	                    <path fill="none" stroke="currentColor" stroke-dasharray="12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12l7 7M12 12l-7 -7M12 12l-7 7M12 12l7 -7">
	                 	<animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="12;0" />
	                    </path>
                        </svg>
                     </span>
                    }
                 </button>
              </div>
            </div>

            <div className='text-white lg:flex w-md hidden justify-around place-items-center'>
                <button className='hover:border-b h-fit transition-all' onClick={()=> scrollToSection('home')}>Home</button>
                <button className='hover:border-b h-fit transition-all' onClick={()=> scrollToSection('about')}>About</button>
                <button className='hover:border-b h-fit transition-all' onClick={()=> scrollToSection('programme')}>Programme</button>
                <button className='hover:border-b h-fit transition-all' onClick={()=> scrollToSection('testimonial')}>Testimonial</button>
                <button className='hover:border-b h-fit transition-all' onClick={()=> scrollToSection('contact')}>Contacts</button>
            </div>

            {navMenu && (
              <div className='flex lg:hidden justify-around flex-col gap-2 w-full text-white shadow-sm shadow-slate-200 rounded-sm mt-2 p-2 bg-blue-500'>
                <button className='hover:border-b h-fit transition-all w-full p-1.5' onClick={()=> scrollToSection('home')}>Home</button>
                <button className='hover:border-b h-fit transition-all w-full p-1.5' onClick={()=> scrollToSection('about')}>About</button>
                <button className='hover:border-b h-fit transition-all w-full p-1.5' onClick={()=> scrollToSection('programme')}>Programme</button>
                <button className='hover:border-b h-fit transition-all w-full p-1.5' onClick={()=> scrollToSection('testimonial')}>Testimonial</button>
                <button className='hover:border-b h-fit transition-all w-full p-1.5' onClick={()=> scrollToSection('contact')}>Contacts</button>
              </div>
            )}
         </div>
      </section>
    </>
  )
}
