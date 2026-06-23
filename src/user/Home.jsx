import React, { useState } from 'react'
import { Navbar } from './Navbar'
import { About } from './About'
import { Programme } from './Programme'
import { Contact } from './Contact'
import { Testimonial } from './Testimonial'
import { Footer } from './Footer'
import Swal from 'sweetalert2'

export const Home = () => {

    const [getStartedmodal , setGetstartedModal] = useState(false);
    const [selectedProgram , setSelectedprogram] = useState("");

    const scrollView = (id) => {
       const element = document.getElementById(id);
       if(element){
        element.scrollIntoView({behavior:'smooth'})
       }
    }

    const submit = ()=>{
        const phoneNumber = "2347079715423";

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=hello, i am intrested in ${selectedProgram}. I would like to know more about your program.`;

        window.open(whatsappUrl , "_blank")
    }

  return (
    <div id='home' className='w-full'>
        <section id='navbar'>
            <div className='navbar'>
                <Navbar/>
            </div>
        </section><br /><br /><br />

        <section>
            <div className='home flex h-[84vh]'>
                <div className='text-white my-auto w-2xl lg:w-3xl md:w-full homes'>
                    <div className='w-sm lg:w-xl md:w-2xl mx-auto px-2 lg:text-start text-center'>
                        <span className='border px-2 py-1 rounded-xl flex mx-auto lg:mx-0 lg:justify-start w-fit gap-2'>
                            <span className='my-auto animate-pulse'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	                        <path d="M0 0h24v24H0z" fill="none" />
	                        <path fill="currentColor" d="M12 2L0 9l12 7l10-5.833V17.5h2V9zM3.999 13.49V18a9.99 9.99 0 0 0 8 4A9.99 9.99 0 0 0 20 18v-4.509l-8 4.667z" /> 
                            </svg>
                           </span>
                            <span>Welcome to Pythagoras Tripple Edussol</span>
                            </span>

                        <h2 className='text-5xl font-bold mt-2'>Your Path to Academic Excellence</h2>
                        <p className='mt-3'>We provide focused coaching for WAEC, JAMB, and NECO, plus expert guidance through the admission process to ensure you secure your spot in your dream institution</p>

                       <div className='flex gap-2 mt-2 justify-center lg:justify-start'>
                          <button className='bg-green-600 w-45 p-2.5 rounded-xl font-bold hover:shadow hover:shadow-green-500 transition-all' onClick={()=> setGetstartedModal(true)}>Get Started</button>
                          <button className='bg-slate-500 w-45 p-2.5 rounded-xl font-bold hover:shadow hover:shadow-slate-500 transition-all' onClick={()=> scrollView("contact")}>Contact Us</button>
                       </div>
                    </div>
                </div>
            </div>

        </section><br /><br />

        {getStartedmodal && (
            <section className='fixed inset-0 flex justify-center h-screen place-items-center p-2'>
            <div className='shadow-sm shadow-slate-500 md:w-xl w-full bg-white p-3 rounded-2xl'>
                <div className='flex justify-between p-1'>
                   <h2 className='text-center text-2xl font-bold text-blue-600'>Choose your interest</h2>
                    <button className='border h-fit p-1.5 rounded-lg' onClick={()=> setGetstartedModal(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
	                    <path d="M0 0h24v24H0z" fill="none" />
	                    <path fill="none" stroke="currentColor" stroke-dasharray="12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12l7 7M12 12l-7 -7M12 12l-7 7M12 12l7 -7">
		                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="12;0" />
	                    </path>
                        </svg> 
                    </button>    
                </div>

              <div className='mt-3'>
                <select name="" id="" className='border h-12 rounded-lg w-full px-1' defaultValue={selectedProgram} onChange={(e)=> setSelectedprogram(e.target.value)}>
                   <option>---Choose your interest---</option>
                   <option value="WAEC Lessons">WAEC Lessons</option>
                   <option value="JAMB Coaching">JAMB Coaching</option>
                   <option value="NECO Preparation">NECO Preparation</option>
                   <option value="Admission Guidance">Admission Guidance</option>
                   <option value="Holiday Lessons">Holiday Lessons</option>
                   <option value="Other">Other</option>
                </select>

                <button className='w-full mt-2 bg-blue-500 p-2.5 text-white rounded-xl' onClick={submit}>Submit</button>
              </div>
            </div>
        </section>
        )}

        <section >
            <About/>
        </section><br /><br />

        <section>
            <Programme/>
        </section><br /><br />

        <section>
            <Testimonial/>
        </section><br /><br />

        <section>
            <Contact/>
        </section><br /><br />

        <section>
            <Footer/>
        </section>
    </div>
  )
}
