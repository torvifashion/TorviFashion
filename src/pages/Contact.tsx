import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSent(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans text-left">
      
      {/* Page Header text details */}
      <div className="space-y-2 mb-12 text-center select-none">
        <span className="text-rose-455 text-xs font-semibold uppercase tracking-[0.2em] block">
          Concierge Services
        </span>
        <h1 className="text-3xl md:text-4xl font-sans tracking-tight text-zinc-900 dark:text-white font-light">
          Get in Touch <span className="font-serif italic text-rose-400">With Us</span>
        </h1>
        <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
          Our specialized team is available for fitting requests, customized leather monogram queries, or bulk gifting selections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COMPONENT: STYLISH CONTACT INFRASTRUCTURE */}
        <div className="md:col-span-5 space-y-6">
          
          <div className="bg-white dark:bg-zinc-90 w-full p-6 rounded-3xl border border-zinc-10 ) dark:border-zinc-800 space-y-6">
            <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-800 dark:text-white border-b border-zinc-50 dark:border-zinc-805 pb-3">
              Boutique Headquarters
            </h3>

            <div className="space-y-4 text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed">
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-zinc-400 block font-mono">SHOWROOM ADDRESS:</span>
                  <p className="font-semibold text-zinc-800 dark:text-white pt-0.5">
                    Plot 12, Block E, Banani Avenue,<br />
                    Dhaka-1213, Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-zinc-400 block font-mono">CONCIERGE HOTLINE:</span>
                  <p className="font-mono pt-0.5">+880 1823-999888</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-zinc-400 block font-mono">SUPPORT MAILBOX:</span>
                  <p className="font-semibold text-rose-500 pt-0.5">support@eleganceboutique.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-zinc-400 block font-mono">BOUTIQUE HOURS:</span>
                  <p className="pt-0.5">Saturday – Thursday: 10:00 AM – 9:00 PM (GMT+6)</p>
                </div>
              </div>

            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-150 dark:border-zinc-805 space-y-3">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">Complimentary Concierge Policy</span>
            <p className="text-[11px] text-zinc-505 leading-relaxed font-sans">
              Enjoy standard complimentary fitting and customized leather embossed letter initials (up to 3 characters) matching your acquisition of handbag series. Talk to checkout coordinators inside our physical showrooms.
            </p>
          </div>

        </div>

        {/* RIGHT COMPONENT: INTERACTIVE SUPPORT TICKETS SUBMIT FORM */}
        <div className="md:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-80) rounded-3xl p-8 space-y-6">
          <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-850 dark:text-white">
            Send Anonymous styling message
          </h3>

          {isSent ? (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-955/20 border border-emerald-100 dark:border-emerald-900 rounded-2xl text-center space-y-3 animate-fade-in">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Message Sourced Elegantly!</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed font-sans">
                Thank you, Amelia! Your fitting request has been indexed onto our client support database. A concierge rep will revert shortly.
              </p>
              <button
                id="contact-reset-btn"
                onClick={() => setIsSent(false)}
                className="text-xs font-semibold underline text-rose-455 cursor-pointer block mx-auto pt-2"
              >
                Submit another message ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-404 block">Your name</label>
                  <input
                    id="contact-input-name"
                    type="text"
                    required
                    placeholder="e.g. Amelia Watson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white rounded border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-rose-455"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-404 block">Your email</label>
                  <input
                    id="contact-input-email"
                    type="email"
                    required
                    placeholder="amelia@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white rounded border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-rose-455"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs text-zinc-404 block">Confidential query description</label>
                <textarea
                  id="contact-input-message"
                  required
                  rows={4}
                  placeholder="Detail customized monogram styling or accessory sizing request details..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white rounded border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-rose-455"
                />
              </div>

              <button
                id="contact-submit-btn"
                type="submit"
                className="w-full py-3 bg-zinc-950 hover:bg-rose-455 text-white rounded text-xs uppercase tracking-widest font-semibold transition flex items-center justify-center space-x-1 shadow-xs"
              >
                <span>Dispatch Support Request</span>
                <Send className="w-3.5 h-3.5" />
              </button>

            </form>
          )}

        </div>

      </div>

      {/* Decorative Showroom Map frame visual */}
      <div className="mt-16 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-80) rounded-3xl overflow-hidden p-3 relative h-[320px] shadow-sm flex items-center justify-center select-none text-center">
        <div className="absolute inset-4 bg-zinc-50 dark:bg-zinc-955 rounded-2xl flex flex-col items-center justify-center space-y-3 p-6 text-center">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-505">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-white">BANANI SHOWROOM INTERACTIVE MAP</h4>
            <p className="text-[11px] text-zinc-400 font-sans max-w-sm">
              Plot 12, Block E, Banani Avenue, Dhaka, Bangladesh. GPS grid positions indexed elegantly inside Google Maps platform nodes.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
