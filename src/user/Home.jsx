import React, { useState } from 'react'
import { Navbar } from './Navbar'
import { About } from './About'
import { Programme } from './Programme'
import { Contact } from './Contact'
import { Testimonial } from './Testimonial'
import { Footer } from './Footer'
import Swal from 'sweetalert2'
import { User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Hero } from './Hero'
import { Teams } from './Teams'
import { Events } from './Events'

export const Home = () => {

    const [getStartedmodal , setGetstartedModal] = useState(false);
    const [selectedProgram , setSelectedprogram] = useState("");
    const navigate = useNavigate();

    const scrollView = (id) => {
       const element = document.getElementById(id);
       if(element){
        element.scrollIntoView({behavior:'smooth'})
       }
    }

    const submit = ()=>{
        const phoneNumber = "2348058393633";

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=hello, i am intrested in ${selectedProgram}. I would like to know more about your program.`;

        window.open(whatsappUrl , "_blank")
    }

  return (
    <div id='home' className='w-full'>
        <section id='navbar'>
            <div className='navbar'>
                <Navbar/>
            </div>
        </section>

        <section>
            <Hero/>
        </section>

        <section >
            <About/>
        </section>

        <section>
            <Programme/>
        </section>

        <section>
            <Teams/>
        </section>

        <section>
            <Events/>
        </section>

        <section>
            <Testimonial/>
        </section>

        <section>
            <Contact/>
        </section>

        {/* <div className='fixed bottom-5 right-5 bg-blue-400 text-white w-10 h-10 flex justify-center items-center rounded-full' onClick={navigate("/adminlogin")}>
            <User/>
        </div> */}

        <section>
            <Footer/>
        </section>
    </div>
    
  )
}
