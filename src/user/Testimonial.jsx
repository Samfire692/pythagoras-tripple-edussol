import React from 'react';

export const Testimonial = () => {
  const testimonials = [
    { name: "Tunde Oladipo", text: "The JAMB coaching was a game changer for me. The structured lessons really helped me improve.", rating: 5 },
    { name: "Sarah Benson", text: "I struggled with my subjects, but the remedial classes made everything so clear. Highly recommended!", rating: 5 },
    { name: "Chinedu Okafor", text: "Pythagoras Tripple Edussol made the admission process so seamless for me. Thank you!", rating: 4 },
  ];

  return (
    <section id='testimonials' className='scroll-mt-20 py-16 bg-white'>
      <div className='max-w-6xl mx-auto px-6'>
        <h2 className='text-3xl md:text-4xl font-bold text-center text-blue-600 mb-12'>Student Testimonials</h2>
        
        <div className='grid md:grid-cols-3 gap-8'>
          {testimonials.map((t, i) => {
            const initials = t.name.split(' ').map(n => n[0]).join('');
            return (
              <div key={i} className='bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm'>
                <div className='flex items-center gap-4 mb-4'>
                  {/* Initial Profile Badge */}
                  <div className='w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg'>
                    {initials}
                  </div>
                  <div>
                    <h4 className='font-bold text-slate-800'>{t.name}</h4>
                    <div className='text-yellow-400 text-sm'>
                      {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                    </div>
                  </div>
                </div>
                <p className='text-slate-600 italic leading-relaxed'>"{t.text}"</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};