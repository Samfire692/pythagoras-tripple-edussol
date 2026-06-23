import React from 'react'

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center md:text-left">
        
        {/* Brand Info */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-blue-400">Pythagoras Tripple Edussol</h3>
          <p className="text-slate-400 text-sm">
            Building strong academic foundations for WAEC, JAMB, and NECO success since our inception.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="font-bold text-lg">Quick Links</h4>
          <ul className="text-slate-400 space-y-2 text-sm">
            <li><a href="#home" className="hover:text-blue-400 transition">Home</a></li>
            <li><a href="#about" className="hover:text-blue-400 transition">About Us</a></li>
            <li><a href="#programme" className="hover:text-blue-400 transition">Our Programmes</a></li>
          </ul>
        </div>

        {/* Contact/CTA */}
        <div className="space-y-4">
          <h4 className="font-bold text-lg">Get in Touch</h4>
          <p className="text-slate-400 text-sm">Need help with your admission or coaching?</p>
          <a 
            href="https://wa.me/2347079715423" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>

      <div className="text-center text-slate-600 mt-12 pt-8 border-t border-slate-800 text-xs">
        &copy; 2026 Pythagoras Tripple Edussol. All rights reserved.
      </div>
    </footer>
  );
};
