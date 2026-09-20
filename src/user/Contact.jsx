import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";

const CONTACT_ID = "00000000-0000-0000-0000-000000000001";

export const Contact = () => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstname] = useState("");
  const [surName, setSurname] = useState("");
  const [message, setMessage] = useState("");

  // =========================
  // FETCH CONTACT INFO
  // =========================
  const fetchContact = async () => {
    try {
      const { data, error } = await supabase
        .from("PYTHA_contact")
        .select("*")
        .eq("id", CONTACT_ID)
        .maybeSingle();

      if (error) throw error;

      setContact(data);
    } catch (error) {
      console.error("Contact fetch error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  // =========================
  // WHATSAPP NUMBER
  // =========================
  const formatWhatsAppNumber = (number) => {
    if (!number) return "";

    let cleaned = number.replace(/\D/g, "");

    // Nigerian local number: 08012345678 -> 2348012345678
    if (cleaned.startsWith("0")) {
      cleaned = `234${cleaned.slice(1)}`;
    }

    return cleaned;
  };

  // =========================
  // SUBMIT MESSAGE
  // =========================
  const Submit = (e) => {
    e.preventDefault();

    if (!firstName.trim() || !surName.trim() || !message.trim()) {
      toast.error("Please fill in all the fields.");
      return;
    }

    const whatsappNumber = formatWhatsAppNumber(
      contact?.whatsapp || contact?.phone1
    );

    if (!whatsappNumber) {
      toast.error("WhatsApp contact is currently unavailable.");
      return;
    }

    const fullname = `${surName.trim()} ${firstName.trim()}`;

    const text = `Hello, my name is ${fullname}.

${message.trim()}`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      text
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  const phones = [
    contact?.phone1,
    contact?.phone2,
    contact?.phone3,
  ].filter(Boolean);

  if (loading) {
    return (
      <section
        id="contact"
        className="flex min-h-[500px] items-center justify-center bg-slate-50"
      >
        <LoaderCircle
          size={35}
          className="animate-spin text-blue-600"
        />
      </section>
    );
  }

  return (
    <section
      id="contact"
      className="scroll-mt-22 overflow-hidden bg-slate-50 py-8"
    >
      <div className="mx-auto max-w-8xl px-6 md:px-10 lg:px-16">

        {/* HEADER */}
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-yellow-500">
            Let's connect
          </p>

          <h2 className="text-4xl font-bold leading-tight text-blue-700 md:text-5xl lg:text-6xl">
            Have a question?
            <span className="block text-yellow-500">
              Talk to us.
            </span>
          </h2>

          <div className="mt-5 h-1 w-16 rounded-full bg-blue-600"></div>

          <p className="mt-5 max-w-xl text-base leading-7 text-slate-500 md:text-lg">
            Whether you want to ask about lessons, admission guidance,
            examinations, or anything else, we're ready to hear from you.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">

          {/* CONTACT DETAILS */}
          <div className="rounded-[2rem] bg-blue-700 p-7 text-white shadow-xl shadow-blue-100 md:p-10">

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-400">
                Contact information
              </p>

              <h3 className="mt-3 text-3xl font-bold md:text-4xl">
                Let's keep in touch.
              </h3>

              <p className="mt-4 max-w-lg leading-7 text-blue-100">
                Reach out through any of our available contact channels.
              </p>
            </div>

            <div className="mt-10 space-y-7">

              {/* ADDRESS 1 */}
              {contact?.address1 && (
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-blue-800">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-blue-200">
                      Address
                    </p>

                    <p className="mt-1 leading-6">
                      {contact.address1}
                    </p>
                  </div>
                </div>
              )}

              {/* ADDRESS 2 */}
              {contact?.address2 && (
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-blue-800">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-blue-200">
                      Second Address
                    </p>

                    <p className="mt-1 leading-6">
                      {contact.address2}
                    </p>
                  </div>
                </div>
              )}

              {/* PHONE NUMBERS */}
              {phones.length > 0 && (
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-blue-800">
                    <Phone size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-blue-200">
                      Phone
                    </p>

                    <div className="mt-1 space-y-1">
                      {phones.map((phone, index) => (
                        <a
                          key={`${phone}-${index}`}
                          href={`tel:${phone}`}
                          className="block transition hover:text-yellow-300"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* EMAIL */}
              {contact?.email && (
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-blue-800">
                    <Mail size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-blue-200">
                      Email
                    </p>

                    <a
                      href={`mailto:${contact.email}`}
                      className="mt-1 block break-all transition hover:text-yellow-300"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>
              )}

              {/* WHATSAPP */}
              {contact?.whatsapp && (
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-blue-800">
                    <MessageCircle size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-blue-200">
                      WhatsApp
                    </p>

                    <a
                      href={`https://wa.me/${formatWhatsAppNumber(
                        contact.whatsapp
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block transition hover:text-yellow-300"
                    >
                      {contact.whatsapp}
                    </a>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* MESSAGE FORM */}
          <div className="rounded-[2rem] bg-white p-7 shadow-xl shadow-slate-200/70 md:p-10">

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-500">
                Send a message
              </p>

              <h3 className="mt-3 text-3xl font-bold text-blue-700 md:text-4xl">
                Tell us what you need.
              </h3>

              <p className="mt-3 leading-7 text-slate-500">
                Fill in the form and we'll connect you through WhatsApp.
              </p>
            </div>

            <form
              onSubmit={Submit}
              className="mt-8 space-y-5"
            >
              {/* NAMES */}
              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Surname
                  </label>

                  <input
                    type="text"
                    value={surName}
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder="Surname"
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    First name
                  </label>

                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstname(e.target.value)}
                    placeholder="First name"
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

              </div>

              {/* MESSAGE */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Message
                </label>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message..."
                  rows={7}
                  required
                  className="w-full resize-none rounded-xl border border-slate-200 p-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition duration-300 hover:bg-blue-700"
              >
                Send Message

                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </form>

          </div>
        </div>

      </div>
    </section>
  );
};