import React from 'react'
import { Navbar } from './Navbar'
import { About } from './About'
import { Programme } from './Programme'
import { Contact } from './Contact'
import { Testimonial } from './Testimonial'
import { Footer } from './Footer'

export const Home = () => {
  return (
    <div id='home' className='w-full'>
        <section id='navbar'>
            <div className='navbar'>
                <Navbar/>
            </div>
        </section><br /><br /><br />

        <section>
            <div className='home flex lg:h-[84vh] h-[100vh] md:h-[88vh]'>
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
                          <button className='bg-green-600 w-45 p-2.5 rounded-xl font-bold hover:shadow hover:shadow-green-500 transition-all'>Get Started</button>
                          <button className='bg-slate-500 w-45 p-2.5 rounded-xl font-bold hover:shadow hover:shadow-slate-500 transition-all'>Contact Us</button>
                       </div>
                    </div>
                </div>
            </div>
        </section><br /><br />

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
