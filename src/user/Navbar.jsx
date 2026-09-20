import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    {
      name: "About",
      id: "about",
    },
    {
      name: "Programme",
      id: "programme",
    },
    {
      name: "Teams",
      id: "team",
    },
    {
      name: "Events",
      id: "events",
    },
    {
      name: "Testimonial",
      id: "testimonial",
    },
    {
      name: "Contact",
      id: "contact",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setOpen(false);
  };

  return (
    <nav
      className={`fixed left-0 top-0 z-[100] w-full transition-all duration-500 ${
        scrolled
          ? "bg-white/95 shadow-md backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8 lg:px-12">

        {/* LOGO */}
        <button
          type="button"
          onClick={() => scrollToSection("home")}
          className="text-left"
        >
          <h1 className="flex flex-col uppercase leading-none">
            <span
              className={`text-2xl font-bold transition-colors duration-300 ${
                scrolled ? "text-blue-600" : "text-yellow-300"
              }`}
            >
              Pythagoras
            </span>

            <span
              className={`-mt-0.5 text-sm font-bold tracking-[3px] transition-colors duration-300 ${
                scrolled ? "text-yellow-300" : "text-blue-600"
              }`}
            >
              Triple Edusol
            </span>
          </h1>
        </button>

        {/* DESKTOP NAV */}
        <div className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollToSection(link.id)}
              className={`relative text-sm font-medium transition-colors duration-300 ${
                scrolled
                  ? "text-slate-700 hover:text-blue-600"
                  : "text-white hover:text-yellow-300"
              }`}
            >
              {link.name}

              <span
                className={`absolute -bottom-2 left-0 h-0.5 w-0 transition-all duration-300 hover:w-full ${
                  scrolled ? "bg-blue-600" : "bg-yellow-300"
                }`}
              />
            </button>
          ))}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`rounded-lg border p-2 transition-all duration-300 lg:hidden ${
            scrolled
              ? "border-slate-200 text-slate-700 hover:bg-slate-100"
              : "border-white/40 text-white hover:bg-white/10"
          }`}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        } ${
          scrolled
            ? "bg-white/95 backdrop-blur-md"
            : "bg-black/40 backdrop-blur-md"
        }`}
      >
        <div className="space-y-1 px-5 pb-5 pt-2">
          {links.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollToSection(link.id)}
              className={`block w-full rounded-xl px-4 py-3 text-left font-medium transition-all ${
                scrolled
                  ? "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                  : "text-white hover:bg-white/10 hover:text-yellow-300"
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};