import React from "react";
import aboutPic from "../assets/girl with laptop.png";

export const About = () => {
  return (
    <section
      id="about"
      className="scroll-mt-22 overflow-hidden bg-white py-8"
    >
      <div className="mx-auto max-w-8xl px-6 md:px-10 lg:px-16">

        <div className="mb-5 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-yellow-500">
            Who we are
          </p>

          <h2 className="text-4xl font-bold leading-tight text-blue-700 md:text-5xl lg:text-5xl">
            About Us
          </h2>

          <div className="mt-2 h-1 w-16 rounded-full bg-yellow-400"></div>
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">

          {/* TEXT */}
          <div>
            <p className="text-lg leading-8 text-slate-600 md:text-xl">
              <span className="font-bold text-blue-700">
                At Pythagoras Triple Edusol,
              </span>{" "}
              we are dedicated to helping students excel in WAEC, JAMB, NECO,
              and other examinations through focused guidance and quality
              teaching.
            </p>

            <p className="mt-5 max-w-xl leading-7 text-slate-500">
              Through focused lessons, personalized guidance, and proven
              examination strategies, we help students build confidence,
              strengthen their understanding, and prepare for their next
              academic step.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">

              {/* STAT 1 */}
              <div className="group rounded-2xl border border-blue-100 bg-blue-50/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100">
                <div className="flex items-end gap-2">
                  <h3 className="text-4xl font-bold text-blue-700">
                    25+
                  </h3>

                  <span className="pb-1 text-sm font-semibold text-blue-600">
                    Years
                  </span>
                </div>

                <p className="mt-2 font-semibold text-slate-700">
                  Academic Support
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Experienced tutors providing personalized guidance and
                  proven strategies for examination success.
                </p>
              </div>

              {/* STAT 2 */}
              <div className="group rounded-2xl border border-yellow-100 bg-yellow-50/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-100">
                <div className="flex items-end gap-2">
                  <h3 className="text-4xl font-bold text-blue-700">
                    95%
                  </h3>
                </div>

                <p className="mt-2 font-semibold text-slate-700">
                  Student Success Rate
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Structured lessons and regular assessments help students
                  improve performance and achieve better examination results.
                </p>
              </div>

            </div>
          </div>

          {/* IMAGE */}
          <div className="relative mx-auto w-full max-w-xl">

            <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-yellow-400/70 blur-2xl"></div>

            <div className="absolute -bottom-5 -left-5 h-40 w-40 rounded-full bg-blue-600/20 blur-3xl"></div>

            <div className="relative overflow-hidden rounded-[2rem] p-3 shadow-2xl shadow-blue-100">
              <div className="overflow-hidden rounded-[1.5rem] bg-white">
                <img
                  src={aboutPic}
                  alt="Student studying with a laptop"
                  className="h-[430px] w-full object-cover object-center md:h-[520px]"
                />
              </div>

              <div className="absolute bottom-7 left-7 rounded-2xl bg-white px-5 py-4 shadow-xl">
                <p className="text-xs font-bold uppercase tracking-widest text-yellow-500">
                  Pythagoras Triple Edusol
                </p>

                <p className="mt-1 font-bold text-blue-700">
                  Learn. Prepare. Advance.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};