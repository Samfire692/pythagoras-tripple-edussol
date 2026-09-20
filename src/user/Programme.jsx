import React from 'react';

export const Programme = () => {
  const programmes = [
    { title: 'WAEC Preparation', desc: 'Comprehensive preparation for WAEC success.', icon: 'M9 11h2v2H9zm0-4h2v2H9zm4 4h2v2h-2zm0-4h2v2h-2zm12 2h-3V5h1V3H5v2h1v4H3c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V10c0-.55-.45-1-1-1M4 11h2v8H4zm6 4v4H8V5h8v14h-2v-4zm10 4h-2v-8h2z' },
    { title: 'JAMB Intensive', desc: 'Focused coaching for higher JAMB scores.', icon: 'M14 9.9V8.2q.825-.35 1.688-.525T17.5 7.5q.65 0 1.275.1T20 7.85v1.6q-.6-.225-1.213-.337T17.5 9q-.95 0-1.825.238T14 9.9m0 5.5v-1.7q.825-.35 1.688-.525T17.5 13q.65 0 1.275.1t1.225.25v1.6q-.6-.225-1.213-.338T17.5 14.5q-.95 0-1.825.225T14 15.4m0-2.75v-1.7q.825-.35 1.688-.525t1.812-.175q.65 0 1.275.1T20 10.6v1.6q-.6-.225-1.213-.338T17.5 11.75q-.95 0-1.825.238T14 12.65m-1 4.4q1.1-.525 2.213-.788T17.5 16q.9 0 1.763.15T21 16.6V6.7q-.825-.35-1.713-.525T17.5 6q-1.175 0-2.325.3T13 7.2zM12 20q-1.2-.95-2.6-1.475T6.5 18q-1.05 0-2.062.275T2.5 19.05q-.525.275-1.012-.025T1 18.15V6.1q0-.275.138-.525T1.55 5.2q1.175-.575 2.413-.888T6.5 4q1.45 0 2.838.375T12 5.5q1.275-.75 2.663-1.125T17.5 4q1.3 0 2.538.313t2.412.887q.275.125.413.375T23 6.1v12.05q0 .575-.487.875t-1.013.025q-.925-.5-1.937-.775T17.5 18q-1.5 0-2.9.525T12 20' },
    { title: 'NECO Revision', desc: 'Structured revision to boost performance.', icon: 'M21 10V9l-6-6H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h6v-1.87l8.39-8.39c.44-.44 1-.68 1.61-.74m-7-5.5l5.5 5.5H14zm8.85 9.69l-.98.98l-2.04-2.04l.98-.98c.19-.2.52-.2.72 0l1.32 1.32c.2.2.2.53 0 .72m-3.72-.36l2.04 2.04L15.04 22H13v-2.04z' },
    { title: 'Admission Support', desc: 'Expert guidance for school and exams.', icon: 'M15.775 18.525Q16 18.3 16 18t-.225-.525t-.525-.225t-.525.225T14.5 18t.225.525t.525.225t.525-.225m2.75 0q.225-.225.225-.525t-.225-.525T18 17.25t-.525.225t-.225.525t.225.525t.525.225t.525-.225m2.75 0Q21.5 18.3 21.5 18t-.225-.525t-.525-.225t-.525.225T20 18t.225.525t.525.225t.525-.225M18 23q-2.075 0-3.537-1.463T13 18t1.463-3.537T18 13t3.538 1.463T23 18t-1.463 3.538T18 23M7 9h10V7H7zm4.675 12H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v6.7q-.725-.35-1.463-.525T18 11q-.275 0-.513.012t-.487.063V11H7v2h6.125q-.45.425-.812.925T11.675 15H7v2h4.075q-.05.25-.062.488T11 18q0 .825.15 1.538T11.675 21' },
    { title: 'Weekend Tutorials', desc: 'Flexible weekend classes for students.', icon: 'M2 19c0 1.7 1.3 3 3 3h14c1.7 0 3-1.3 3-3v-8H2zM19 4h-2V3c0-.6-.4-1-1-1s-1 .4-1 1v1H9V3c0-.6-.4-1-1-1s-1 .4-1 1v1H5C3.3 4 2 5.3 2 7v2h20V7c0-1.7-1.3-3-3-3' },
    { title: 'SSCE Remedial', desc: 'Extra support to strengthen weak subjects.', icon: 'M12 20q-1.2-.95-2.6-1.475T6.5 18q-1.05 0-2.062.275T2.5 19.05q-.525.275-1.012-.025T1 18.15V6.1q0-.275.138-.525T1.55 5.2q1.15-.6 2.4-.9T6.5 4q1.45 0 2.838.375T12 5.5v12.1q1.275-.8 2.675-1.2T17.5 16q.9 0 1.763.15T21 16.6v-12q.375.125.738.263t.712.337q.275.125.413.375T23 6.1v12.05q0 .575-.487.875t-1.013.025q-.925-.5-1.937-.775T17.5 18q-1.5 0-2.9.525T12 20m2-5V5.5l5-5v10z' },
  ];

  return (
    <section id='programme' className='scroll-mt-20 py-16 bg-slate-50'>
      <div className='max-w-7xl mx-auto px-6'>
       <div className='mb-5'>
           <h2 className="text-4xl font-bold leading-tight text-blue-700 md:text-5xl lg:text-5xl">
            Programme
          </h2>

          <div className="mt-2 h-1 w-16 rounded-full bg-yellow-400"></div>
       </div>
        
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {programmes.map((item, index) => (
            <div key={index} className='bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex gap-4'>
              <div className='text-blue-600 bg-blue-50 p-3 rounded-xl h-fit'>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d={item.icon} /></svg>
              </div>
              <div>
                <h3 className='font-bold text-lg text-slate-800'>{item.title}</h3>
                <p className='text-slate-600 text-sm mt-1'>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};