import React, { useState, useEffect }from 'react'
import { supabase } from '../supabaseClient';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Calendar, Clock, Locate, LocateFixedIcon, LocateIcon, LocationEdit } from 'lucide-react';

export const Events = () => {

    const [event, setEvent] = useState([]);
    
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from("PYTHA_events")
                    .select("*");
    
                if (error) throw error;
                setEvent(data);
            } catch (error) {
                console.error("Error fetching teams:", error.message);
            }
        };
    
        useEffect(() => {
            fetchData();
        }, []);
  return (
   <div className='max-w-7xl mx-auto px-6 py-3 scroll-mt-20 py-16' id='events'>
               <div className='mb-8'>
                   <h2 className="text-4xl font-bold leading-tight text-blue-700 md:text-5xl lg:text-5xl">
                       Our Events
                   </h2>
                   <div className="mt-2 h-1 w-16 rounded-full bg-yellow-400"></div>
               </div>
   
               <Swiper
                   modules={[Autoplay, Pagination, Navigation]}
                   spaceBetween={20}
                   slidesPerView={1}
                   autoplay={{
                       delay: 3500,
                       disableOnInteraction: false,
                   }}
                   pagination={{ clickable: true }}
                   breakpoints={{
                       640: { slidesPerView: 2 },
                       1024: { slidesPerView: 3 },
                       1280: { slidesPerView: 4 },
                   }}
                   className="pb-12"
               >
                   {event.map((tem) => (
                       <SwiperSlide key={tem.id}>
                           <div 
                               className='border border-blue-100 bg-blue-50/60 h-full flex flex-col justify-between shadow-sm' 
                               style={{ borderRadius: "10px 10px 40px 10px" }}
                           >
                               <img 
                                   src={tem.image} 
                                   alt={tem.fullname} 
                                   className='h-50 w-full object-cover' 
                                   style={{ borderRadius: "10px 10px 40px 10px" }}
                               />
                               <div className="mt-3 p-2">
                                   <h2 className='text-xl font-bold capitalize text-yellow-500' style={{letterSpacing:"1px"}}>{tem.title}</h2>
                                   <p className='text-slate-500 font-light italic mt-1.5'>{tem.description}</p>
                                   <p className='flex mt-3 -ms-1.5'>
                                       <span className='my-auto text-xl'>
                                         <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
	                                     <path d="M0 0h16v16H0z" fill="none" />
	                                     <g fill="royalblue">
		                                 <path d="M10.361 10.485C11.354 10.94 12 11.672 12 12.5c0 1.38-1.79 2.5-4 2.5s-4-1.12-4-2.5c0-.828.645-1.56 1.638-2.015l.267.354c.454.593.886 1.16 1.268 1.723a1 1 0 0 0 1.654 0a39 39 0 0 1 1.268-1.723z" />
		                                 <path d="M8 1c2.4 0 4 1.572 4 3.929c0 2.058-1.83 4.117-3.36 6.176A26 26 0 0 0 8 12c-.418-.616-.89-1.232-1.361-1.849C5.309 8.411 4 6.67 4 4.93C4 2.572 5.6 1 8 1m0 1.964c-.53 0-1.039.208-1.414.576A1.95 1.95 0 0 0 6 4.929c0 .52.21 1.02.586 1.388c.375.369.884.576 1.414.576s1.039-.207 1.414-.576a1.94 1.94 0 0 0 0-2.776A2.02 2.02 0 0 0 8 2.964" />
	                                     </g>
                                         </svg>
                                        </span>

                                        <span className='text-sm font-bold' style={{color:"royalblue"}}>
                                         {tem.location}
                                        </span>
                                   </p>
                                   <div className='mt-1.5 -ms-1 pe-1 pb-1'>
                                     <div className='flex justify-between' style={{color:"royalblue"}}>
                                         <p className='flex gap-1'><Clock size={15} className='my-auto'/> <span className='font-bold text-sm my-auto'>{tem.time}</span></p>
                                         <p className='flex gap-1.5'><Calendar size={15} className='my-auto'/> <span className='font-bold text-sm my-auto'>{tem.date}</span></p>
                                     </div>
                                  </div>
                               </div>
                           </div>
                       </SwiperSlide>
                   ))}
               </Swiper>
           </div>
  )
}
