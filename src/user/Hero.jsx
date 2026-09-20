import React, { useState } from "react";
import { ArrowRight, GraduationCap, X } from "lucide-react";
import heroImg from "../assets/heropic2.jfif";
import { toast } from "sonner";

export const Hero = () => {
  const [getStartedModal, setGetStartedModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("");

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");

    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const submit = () => {
    if (
      !selectedProgram ||
      selectedProgram === "---Choose your interest---"
    ) {
      toast.error("Please choose your interest");
      return;
    }

    toast.success(`Interest selected: ${selectedProgram}`);
    setGetStartedModal(false);
    setSelectedProgram("");
  };

  return (
    <>
      <section className="h-screen bg-black text-white">
        <img
          src={heroImg}
          alt="Pythagoras Triple Edusol"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45"></div>
        <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/35 to-transparent"></div>

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-24 md:px-10 lg:px-16">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md">
              <GraduationCap size={17} />
              <span>Pythagoras Triple Edusol</span>
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Your path to
              <span className="block text-yellow-400">
                academic excellence.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
              Focused coaching for WAEC, JAMB, and NECO, alongside expert
              admission guidance to help you move confidently toward your
              academic goals.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setGetStartedModal(true)}
                className="group flex items-center justify-center gap-3 rounded-full bg-white px-7 py-3.5 font-semibold text-slate-900 transition-all duration-300 hover:bg-yellow-400"
              >
                Get Started
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <button
                type="button"
                onClick={scrollToContact}
                className="rounded-full border border-white/40 bg-white/5 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-slate-900"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 z-10 px-6 md:px-10 lg:px-16">
          <div className="mx-auto flex max-w-7xl items-end justify-between border-t border-white/20 pt-5">
            <p className="text-xs uppercase tracking-[0.25em] text-white/50">
              WAEC · JAMB · NECO · Admissions
            </p>

            <p className="hidden text-sm text-white/50 md:block">
              Learn. Prepare. Advance.
            </p>
          </div>
        </div>
      </section>

      {getStartedModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 text-slate-900 shadow-2xl md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-600">
                  Choose your interest
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Tell us what you are looking for.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setGetStartedModal(false)}
                className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-6">
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">---Choose your interest---</option>
                <option value="WAEC Lessons">WAEC Lessons</option>
                <option value="JAMB Coaching">JAMB Coaching</option>
                <option value="NECO Preparation">
                  NECO Preparation
                </option>
                <option value="Admission Guidance">
                  Admission Guidance
                </option>
                <option value="Holiday Lessons">
                  Holiday Lessons
                </option>
                <option value="Other">Other</option>
              </select>

              <button
                type="button"
                onClick={submit}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Continue
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};