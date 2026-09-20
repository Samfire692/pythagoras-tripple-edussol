import React, { useEffect, useState } from "react";
import { X, LoaderCircle, RefreshCw } from "lucide-react";
import { Navbar } from "./Navbar";
import { About } from "./About";
import { Programme } from "./Programme";
import { Contact } from "./Contact";
import { Testimonial } from "./Testimonial";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { Teams } from "./Teams";
import { Events } from "./Events";
import { supabase } from "../supabaseClient";

const CONTACT_ID = "00000000-0000-0000-0000-000000000001";
const POPUP_ID = "00000000-0000-0000-0000-000000000001";

export const Home = () => {
  const [siteData, setSiteData] = useState({
    team: [],
    events: [],
    contact: null,
    popup: null,
  });

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  const fetchSiteData = async () => {
    setLoading(true);
    setLoadError(false);

    try {
      const [
        teamResponse,
        eventsResponse,
        contactResponse,
        popupResponse,
      ] = await Promise.all([
        supabase
          .from("PYTHA_team")
          .select("*")
          .order("created_at", { ascending: true }),

        supabase
          .from("PYTHA_events")
          .select("*")
          .eq("active", true)
          .order("date", { ascending: true })
          .order("time", { ascending: true }),

        supabase
          .from("PYTHA_contact")
          .select("*")
          .eq("id", CONTACT_ID)
          .maybeSingle(),

        supabase
          .from("PYTHA_popup")
          .select("*")
          .eq("id", POPUP_ID)
          .maybeSingle(),
      ]);

      if (teamResponse.error) throw teamResponse.error;
      if (eventsResponse.error) throw eventsResponse.error;
      if (contactResponse.error) throw contactResponse.error;
      if (popupResponse.error) throw popupResponse.error;

      const loadedData = {
        team: teamResponse.data || [],
        events: eventsResponse.data || [],
        contact: contactResponse.data || null,
        popup: popupResponse.data || null,
      };

      setSiteData(loadedData);

      if (
        loadedData.popup?.active &&
        loadedData.popup?.image
      ) {
        setPopupOpen(true);
      }
    } catch (error) {
      console.error("Landing page data error:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6">
            <h1 className="flex flex-col uppercase leading-none">
              <span className="text-3xl font-bold text-blue-600">
                Pythagoras
              </span>

              <span className="text-sm font-bold tracking-[4px] text-slate-800">
                Triple Edusol
              </span>
            </h1>
          </div>

          <LoaderCircle
            size={38}
            className="animate-spin text-yellow-500"
          />

          <p className="mt-4 text-sm text-slate-500">
            Preparing your experience...
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-blue-700">
            Something went wrong
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            We couldn't load some of the information needed for this page.
            Please try again.
          </p>

          <button
            type="button"
            onClick={fetchSiteData}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="home" className="w-full">

      <section id="navbar">
        <Navbar />
      </section>

      <section>
        <Hero />
      </section>

      <section>
        <About />
      </section>

      <section>
        <Programme />
      </section>

      <section>
        <Teams teams={siteData.team} />
      </section>

      <section>
        <Events events={siteData.events} />
      </section>

      <section>
        <Testimonial />
      </section>

      <section>
        <Contact contact={siteData.contact} />
      </section>

      <section>
        <Footer />
      </section>

      {/* PUBLIC POPUP */}
      {popupOpen && siteData.popup && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">

            <button
              type="button"
              onClick={() => setPopupOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white backdrop-blur-md transition hover:bg-black"
            >
              <X size={20} />
            </button>

            {siteData.popup.image && (
              <img
                src={siteData.popup.image}
                alt="Announcement"
                className="max-h-[65vh] w-full object-cover"
              />
            )}

            {siteData.popup.text && (
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-bold text-blue-700 md:text-2xl">
                  Announcement
                </h2>

                <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                  {siteData.popup.text}
                </p>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};