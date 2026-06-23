import React, { useState } from 'react'

export const Contact = () => {

    const [firstName, setFirstname] = useState("");
    const [surName, setSurname] = useState("");
    const [message , setMessage] = useState("");

    const Submit = ()=>{
        const phoneNumber = "2347079715423";
        const fullname = `${surName} ${firstName}`;
        const messages = `${message}`;
        
        const encode =  encodeURIComponent(`${fullname}\nMessage: ${messages}`)
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=hello my name is ${encode}`;

        window.open(whatsappUrl, "_blank");
    }

  return (
    <div>
        <section id='contact' className='scroll-mt-22'>
            <div className='contact px-2'>
                <div>
                    <h2 className='font-bold text-3xl text-blue-500 text-center'>Contact</h2>
                </div><br />
            <div className='flex lg:flex-row flex-col-reverse gap-3'>
               <div className='w-full lg:w-3xl'>
                 <h2 className='text-2xl font-bold my-2 text-center text-blue-500'>Find Us</h2>
                <iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3962.789323646134!2d3.252454074994266!3d6.673005993322078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwNDAnMjIuOCJOIDPCsDE1JzE4LjEiRQ!5e0!3m2!1sen!2sng!4v1782202127912!5m2!1sen!2sng" height="300" style={{border:"0"}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" className='w-full lg:w-xl mx-auto rounded-2xl'></iframe>
               </div>

               <div className='shadow-sm shadow-slate-500 lg:w-3xl w-full p-4 rounded-2xl'>
                  <h2 className='text-center font-bold text-2xl text-blue-500'>Write A Message</h2><br />

                  <div>
                    <div className='grid gap-3'>
                       <div className='flex gap-2'>
                           <input type="text" className='border h-12 rounded-xl p-3 w-full border-blue-500' placeholder='Surname name' onChange={(e)=> setSurname(e.target.value)}/>
                           <input type="text" className='border h-12 rounded-xl p-3 w-full border-blue-500' placeholder='First name' onChange={(e)=> setFirstname(e.target.value)}/>
                       </div>
                       <textarea name="" id="" className='border w-full h-40 rounded-xl p-3 border-blue-500' placeholder='Write your message' onChange={(e)=> setMessage(e.target.value)}></textarea>
                       <button className='w-full bg-blue-500 p-2.5 text-white rounded-xl' onClick={Submit}>Submit</button>
                    </div>
                  </div>
               </div>
            </div>

            </div>
        </section>
    </div>
  )
}
