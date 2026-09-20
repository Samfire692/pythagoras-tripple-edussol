import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export const Teams = () => {
    const [teams, setTeams] = useState([]);

    const fetchData = async () => {
        try {
            const { data, error } = await supabase
                .from("PYTHA_team")
                .select("*");

            if (error) throw error;
            setTeams(data);
        } catch (error) {
            console.error("Error fetching teams:", error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='max-w-7xl mx-auto px-6 py-16 scroll-mt-16' id='team'>
            <div className='mb-8'>
                <h2 className="text-4xl font-bold leading-tight text-blue-700 md:text-5xl lg:text-5xl">
                    Our Teams
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
                {teams.map((tem) => (
                    <SwiperSlide key={tem.id}>
                        <div 
                            className=' border border-blue-100 bg-blue-50/60 p-3 h-full flex flex-col justify-between shadow-sm' 
                            style={{ borderRadius: "10px 10px 40px 10px" }}
                        >
                            <img 
                                src={tem.img} 
                                alt={tem.fullname} 
                                className='h-50 w-full object-cover' 
                                style={{ borderRadius: "10px 10px 40px 10px" }}
                            />
                            <div className="mt-3">
                                <p className='capitalize text-lg font-bold'>{tem.fullname}</p>
                                <span className='text-sm text-gray-600 line-clamp-3'>{tem.bio}</span>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};