import React from 'react'
import aboutPic from '../assets/girl with laptop.png'

export const About = () => {
  return (
    <div className=''>
        <section id='about' className='scroll-mt-22'>
           <div className='about'>
              <div>
                 <h2 className='text-center font-bold text-3xl md:text-4xl text-blue-600'>About Us</h2>
              </div><br />

              <div className='flex lg:flex-row md:flex-row flex-col justify-evenly px-3'>
                 <div className='md:w-lg my-auto'>
                    <p className='flex flex-col'><span className='font-bold text-4xl text-blue-600'>At Pythagoras Tripple Edussol,</span>
                    <span className='mt-2'>We are dedicated to helping students excel in WAEC, JAMB, NECO, and other examinations through focused guidance and quality teaching.</span>
                    </p>

                    <div className='p-4 rounded-3xl border-l-6 border-blue-600 shadow-sm shadow-slate-500 mt-3'>
                       <div className='font-bold gap-1 text-blue-600'>
                         <h2 className='text-3xl' style={{fontFamily:"sans-serif"}}>10+</h2>
                         <span className='my-auto'>Years of Academic Support</span>
                       </div>
                         <small>Experienced tutors providing personalized guidance and proven strategies for examination success.</small>
                    </div>

                    <div className='p-4 rounded-3xl border-l-6 border-blue-600 shadow-sm shadow-slate-500 mt-3'>
                       <div className='font-bold gap-1 text-blue-600'>
                         <h2 className='text-3xl'>95%</h2>
                         <span className='my-auto'>Student Success Rate</span>
                       </div>
                         <small>Our structured lessons and regular assessments help students improve performance and achieve better examination results.</small>
                    </div>

                 </div>

                 <div className='lg:mx-0 mx-auto p-3'>
                    <img src={aboutPic} width={450} className='h-100 object-contain rounded-full overflow-hidden' alt="" />
                 </div>
              </div>
           </div>
        </section>
    </div>
  )
}
