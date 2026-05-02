import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "../../hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast({
        title: "Missing details",
        description: "Please fill name and email.",
      });
      return;
    }
    toast({
      title: "Message sent!",
      description: "We'll be in touch shortly.",
    });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="relative bg-[#FBE4EA] py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-1.5 rounded-full text-[#8E2A4A] text-xs tracking-[0.25em] uppercase font-semibold">
              Contact Us
            </div>
            <h2 className="font-display mt-5 text-[42px] md:text-[60px] leading-[0.95] font-extrabold text-[#5b1f33]">
              Say hello.<br />
              We listen with sprinkles.
            </h2>
            <p className="mt-6 text-[#5b1f33]/75 max-w-md leading-relaxed">
              Got a flavour idea, a catering request, or just want to say hi?
              Drop us a note — we read every single one.
            </p>

            <div className="mt-10 space-y-5">
              {[
                { icon: Mail, label: "hello@creamery.co" },
                { icon: Phone, label: "+1 (415) 555–0117" },
                { icon: MapPin, label: "221 Sugar Lane, Brookline" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white grid place-items-center text-[#8E2A4A] shadow-[0_8px_20px_rgba(190,60,90,0.10)]">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[#5b1f33] font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={submit}
            className="bg-white rounded-[28px] p-7 md:p-10 shadow-[0_20px_50px_rgba(190,60,90,0.12)]"
          >
            <label className="block text-xs tracking-[0.2em] uppercase font-semibold text-[#8E2A4A] mb-2">
              Your name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Jane Doe"
              className="w-full bg-[#FBE4EA]/60 border border-[#F7C6CF] rounded-2xl px-5 py-4 text-[#5b1f33] placeholder:text-[#8E2A4A]/40 outline-none focus:border-[#8E2A4A] transition-colors"
            />
            <label className="block text-xs tracking-[0.2em] uppercase font-semibold text-[#8E2A4A] mt-6 mb-2">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="jane@example.com"
              className="w-full bg-[#FBE4EA]/60 border border-[#F7C6CF] rounded-2xl px-5 py-4 text-[#5b1f33] placeholder:text-[#8E2A4A]/40 outline-none focus:border-[#8E2A4A] transition-colors"
            />
            <label className="block text-xs tracking-[0.2em] uppercase font-semibold text-[#8E2A4A] mt-6 mb-2">
              Message
            </label>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tell us what's on your mind…"
              className="w-full bg-[#FBE4EA]/60 border border-[#F7C6CF] rounded-2xl px-5 py-4 text-[#5b1f33] placeholder:text-[#8E2A4A]/40 outline-none focus:border-[#8E2A4A] transition-colors resize-none"
            />
            <button
              type="submit"
              className="mt-7 inline-flex items-center gap-2 bg-[#8E2A4A] hover:bg-[#7a2440] text-white pl-7 pr-3 py-3.5 rounded-full font-medium transition-all duration-300 shadow-[0_10px_24px_rgba(142,42,74,0.25)] hover:translate-y-[-1px]"
            >
              Send message
              <span className="w-9 h-9 rounded-full bg-white/20 grid place-items-center">
                <Send className="w-4 h-4" />
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
