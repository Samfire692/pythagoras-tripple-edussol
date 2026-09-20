import React, { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
} from "lucide-react";
import { supabase } from "../supabaseClient";

const CONTACT_ID = "00000000-0000-0000-0000-000000000001";

export const Footer = () => {
  const [contact, setContact] = useState(null);

  const fetchContact = async () => {
    const { data, error } = await supabase
      .from("PYTHA_contact")
      .select("*")
      .eq("id", CONTACT_ID)
      .maybeSingle();

    if (error) {
      console.error("Footer contact error:", error.message);
      return;
    }

    setContact(data);
  };

  useEffect(() => {
    fetchContact();
  }, []);

  const phones = [
    contact?.phone1,
    contact?.phone2,
    contact?.phone3,
  ].filter(Boolean);

  const formatWhatsAppNumber = (number) => {
    if (!number) return "";

    let cleaned = number.replace(/\D/g, "");

    if (cleaned.startsWith("0")) {
      cleaned = `234${cleaned.slice(1)}`;
    }

    return cleaned;
  };

  return (
    <footer className="mt-20 bg-slate-950 text-white">

      <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 lg:px-16">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">

          {/* BRAND */}
          <div className="space-y-5">

            <h3 className="text-2xl font-bold text-blue-400">
              Pythagoras Triple Edusol
            </h3>

            <p className="max-w-md text-sm leading-7 text-slate-400">
              Building strong academic foundations and helping students
              prepare confidently for WAEC, JAMB, NECO, and their next
              academic step.
            </p>

            {contact?.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 text-sm text-slate-300 transition hover:text-yellow-400"
              >
                <Mail size={17} className="text-blue-400" />
                {contact.email}
              </a>
            )}

          </div>

          {/* QUICK LINKS */}
          <div className="text-center">

            <h4 className="mb-5 text-lg font-bold">
              Quick Links
            </h4>

            <ul className="space-y-3 text-sm text-slate-400">

              <li>
                <a
                  href="#home"
                  className="transition hover:text-yellow-400"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="#about"
                  className="transition hover:text-yellow-400"
                >
                  About Us
                </a>
              </li>

              <li>
                <a
                  href="#programme"
                  className="transition hover:text-yellow-400"
                >
                  Our Programmes
                </a>
              </li>

              <li>
                <a
                  href="#team"
                  className="transition hover:text-yellow-400"
                >
                  Our Team
                </a>
              </li>

              <li>
                <a
                  href="#contact"
                  className="transition hover:text-yellow-400"
                >
                  Contact
                </a>
              </li>

            </ul>

          </div>

          {/* CONTACT */}
          <div className="grid items-center justify-items-center">

            <h4 className="mb-5 text-lg font-bold">
              Get in Touch
            </h4>

            <div className="space-y-5 text-sm text-slate-400">

              {/* ADDRESS */}
              {(contact?.address1 || contact?.address2) && (
                <div className="space-y-3">

                  {contact?.address1 && (
                    <div className="flex gap-3">
                      <MapPin
                        size={18}
                        className="mt-0.5 shrink-0 text-blue-400"
                      />

                      <p>{contact.address1}</p>
                    </div>
                  )}

                  {contact?.address2 && (
                    <div className="flex gap-3">
                      <MapPin
                        size={18}
                        className="mt-0.5 shrink-0 text-blue-400"
                      />

                      <p>{contact.address2}</p>
                    </div>
                  )}

                </div>
              )}

              {/* PHONES */}
              {phones.length > 0 && (
                <div className="space-y-2">

                  <p className="flex items-center gap-2 font-semibold text-slate-300">
                    <Phone size={17} className="text-blue-400" />
                    Phone
                  </p>

                  {phones.map((phone, index) => (
                    <a
                      key={`${phone}-${index}`}
                      href={`tel:${phone}`}
                      className="ml-6 block transition hover:text-yellow-400"
                    >
                      {phone}
                    </a>
                  ))}

                </div>
              )}

              {/* WHATSAPP */}
              {contact?.whatsapp && (
                <a
                  href={`https://wa.me/${formatWhatsAppNumber(
                    contact.whatsapp
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  <MessageCircle size={18} />
                  Chat on WhatsApp
                </a>
              )}

            </div>

          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="mt-14 border-t border-slate-800 pt-7 text-center text-xs text-slate-500">
          © 2026 Pythagoras Triple Edusol. All rights reserved.
        </div>

      </div>
    </footer>
  );
};