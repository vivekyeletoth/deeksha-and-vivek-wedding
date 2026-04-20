"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Celebration() {
  const weddingDate = new Date(2026, 4, 6);

  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [submitted, setSubmitted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 40]);

  const [activeSection, setActiveSection] = useState("home");

  const [menuOpen, setMenuOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sections = ["home", "story", "details", "rsvp"];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.1 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  function toggleMusic() {
    if (!audioRef.current) return;

    if (musicPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});

    setMusicPlaying(!musicPlaying);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.target);

    const data = {
      name: formData.get("name"),
      guests: formData.get("guests"),
      attending: formData.get("attending"),
      message: formData.get("message"),
    };

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbw4gCj96JecVOSO2ZxBiLu3BfSgG45vNTE-T74MSx99mrhW-6Y1GQ3C61lwJSEH4BM/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          mode: "no-cors",
        }
      );

      setSubmitted(true);
      e.target.reset();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function getTimeLeft() {
    const now = new Date();
    const diff = weddingDate.getTime() - now.getTime();

    return {
      days: Math.max(Math.floor(diff / (1000 * 60 * 60 * 24)), 0),
      hours: Math.max(Math.floor((diff / (1000 * 60 * 60)) % 24), 0),
      minutes: Math.max(Math.floor((diff / 1000 / 60) % 60), 0),
      seconds: Math.max(Math.floor((diff / 1000) % 60), 0),
    };
  }

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function handleFirstInteraction() {
      if (!audioRef.current) return;

      audioRef.current.play().catch(() => {});
      setMusicPlaying(true);

      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("scroll", handleFirstInteraction);
    }

    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("scroll", handleFirstInteraction);

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("scroll", handleFirstInteraction);
    };
  }, []);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white px-6 py-5 rounded-2xl shadow-xl flex items-center gap-3">
            <span className="w-5 h-5 border-2 border-[#7a1f1f] border-t-transparent rounded-full animate-spin"></span>
            <p className="text-[#7a1f1f] font-medium text-lg">
              Submitting RSVP...
            </p>
          </div>
        </div>
      )}{" "}
      <audio ref={audioRef} loop>
        {" "}
        <source src="/music/perfect.mp3" type="audio/mpeg" />{" "}
      </audio>
      <button
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-50 bg-[#7a1f1f] text-white px-4 py-3 rounded-full shadow-lg"
      >
        {musicPlaying ? "Pause 🎵" : "Play 🎵"}
      </button>
      <header
        className={`fixed top-0 w-full z-[100] bg-[#fdf6f2] border-b border-black/10 shadow-sm transition ${
          menuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <div className="font-serif text-lg text-[#5a1414]">DV</div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 text-sm tracking-widest text-gray-800">
            {[
              { id: "home", label: "WELCOME" },
              { id: "story", label: "OUR STORY" },
              { id: "details", label: "THE DAY" },
              { id: "rsvp", label: "JOIN US" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="hover:text-[#7a1f1f] transition"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-2xl text-[#7a1f1f]"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </header>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#fdf6f2] flex flex-col items-center justify-center">
          <button
            className="absolute top-6 right-6 text-2xl text-[#7a1f1f]"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>

          <div className="flex flex-col items-center space-y-8">
            {[
              { id: "home", label: "WELCOME" },
              { id: "story", label: "OUR STORY" },
              { id: "details", label: "THE DAY" },
              { id: "rsvp", label: "JOIN US" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMenuOpen(false)}
                className="text-[#3b1f1f] text-2xl font-serif tracking-widest hover:text-[#7a1f1f] transition"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
      <main className="bg-[#fdf6f2] text-gray-800 overflow-y-auto scroll-smooth">
        <section
          id="home"
          className="min-h-screen flex items-center justify-center text-center px-6 relative overflow-hidden pt-16"
        >
          {/* Base (keep very light) */}

          <motion.div
            style={{ y }}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
          >
            <div className="hidden md:block w-full h-full bg-[url('/images/decor.png')] bg-no-repeat bg-cover bg-center opacity-5" />{" "}
            <div className="block md:hidden w-full h-full bg-[url('/images/decor-mobile.png')] bg-no-repeat bg-cover bg-center opacity-5" />
          </motion.div>

          {/* Gold glow (very subtle) */}
          <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.10),transparent_60%)]" />

          {/* Content */}
          <div className="space-y-6 relative z-20">
            <p className="text-sm tracking-widest text-[#7a1f1f]">
              Together with their families
            </p>

            <h1 className="text-7xl md:text-8xl font-serif">
              Deeksha <br /> & <br /> Vivek
            </h1>

            <p className="text-lg md:text-xl">
              invite you to celebrate their wedding
            </p>

            <div className="space-y-2">
              <p className="text-sm tracking-[0.3em] text-[#7a1f1f] uppercase">
                Save the Date
              </p>
              <p className="text-xl md:text-2xl">May 6, 2026 · Austin</p>
            </div>

            {mounted && (
              <div className="flex justify-center gap-4 mt-8 flex-wrap">
                <TimeBox label="Days" value={timeLeft.days} />
                <TimeBox label="Hours" value={timeLeft.hours} />
                <TimeBox label="Min" value={timeLeft.minutes} />
                <TimeBox label="Sec" value={timeLeft.seconds} />
              </div>
            )}

            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#7a1f1f] to-transparent mx-auto my-10 opacity-70" />
          </div>
        </section>

        <section
          id="story"
          className="min-h-screen flex items-center justify-center px-6 pt-16 relative overflow-hidden"
        >
          {/* Background (SAME as HOME) */}
          <motion.div
            style={{ y }}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
          >
            <div className="hidden md:block w-full h-full bg-[url('/images/decor.png')] bg-no-repeat bg-cover bg-center opacity-40 saturate-75" />
            <div className="block md:hidden w-full h-full bg-[url('/images/decor-mobile.png')] bg-no-repeat bg-cover bg-center opacity-40 saturate-75" />
          </motion.div>

          {/* Subtle gold glow (same as home) */}
          <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.10),transparent_60%)]" />

          {/* CONTENT */}
          <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center relative z-20">
            <div className="space-y-6 text-center md:text-left">
              <p className="text-sm tracking-widest text-[#7a1f1f]">
                OUR STORY
              </p>

              <h2 className="text-5xl md:text-6xl font-serif text-[#2d1a1a]">
                Deeksha & Vivek
              </h2>

              <motion.p
                className="text-lg md:text-xl text-[#3a2a2a]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                It began with a badminton match — a simple exchange of numbers
                that turned into endless conversations.
              </motion.p>

              <motion.p
                className="text-lg md:text-xl text-[#3a2a2a]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                From classrooms to dreams that took us far apart, we chose each
                other at every step.
              </motion.p>

              <motion.p
                className="text-lg md:text-xl text-[#3a2a2a]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Whether side by side or miles apart, it was always us.
              </motion.p>

              <motion.p
                className="font-serif text-lg md:text-xl text-[#2d1a1a]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                And now, that choice becomes forever.
              </motion.p>
            </div>

            <StorySlider />
          </div>
        </section>
        <section
          id="details"
          className="py-24 flex items-center justify-center text-center px-6 relative overflow-hidden"
        >
          {/* Background (same as home style but lighter) */}
          {/* Subtle glow (same pattern as home) */}
          <div
            className="absolute inset-0 z-10 
    bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_60%)]"
          />

          {/* CONTENT */}
          <div className="space-y-6 max-w-xl relative z-20">
            <p className="text-sm tracking-[0.3em] text-[#7a1f1f] font-medium">
              THE DAY
            </p>

            <h2 className="text-4xl md:text-5xl font-serif text-[#2d1a1a]">
              Wedding Ceremony
            </h2>

            <div className="w-16 h-[2px] bg-[#7a1f1f] mx-auto rounded-full"></div>

            <p className="text-lg text-gray-800 font-medium">May 6, 2026</p>
            <p className="text-lg text-gray-800 font-medium">10:15 AM</p>

            <div className="mt-4 space-y-2">
              <p className="text-xl font-serif text-[#2d1a1a]">
                Sri Venkateshwara Temple
              </p>
              <p className="text-gray-700">Cedar Park, Texas</p>
            </div>

            <a
              href="https://www.google.com/maps?q=2509+W+New+Hope+Dr+Cedar+Park+TX+78613"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 px-6 py-3 border border-[#7a1f1f] rounded-full text-[#7a1f1f] hover:bg-[#7a1f1f] hover:text-white transition"
            >
              Get Directions
            </a>
          </div>
        </section>

        <section
          id="rsvp"
          className="py-24 flex items-center justify-center text-center px-6 relative overflow-hidden isolate"
        >
          {/* Background (same as HOME) */}

          {/* Subtle glow */}
          <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.10),transparent_60%)]" />

          {/* CONTENT */}
          <div className="space-y-6 max-w-md relative z-20">
            <h2 className="text-4xl md:text-5xl font-serif text-[#2d1a1a]">
              Join Us
            </h2>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full p-4 text-lg rounded-xl bg-white/70 backdrop-blur-md border border-white/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7a1f1f]"
                />

                <input
                  name="guests"
                  type="number"
                  placeholder="Guests"
                  required
                  className="w-full p-4 text-lg rounded-xl bg-white/70 backdrop-blur-md border border-white/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7a1f1f]"
                />

                <select
                  name="attending"
                  required
                  className="w-full p-4 text-lg rounded-xl bg-white/70 backdrop-blur-md border border-white/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7a1f1f]"
                >
                  <option value="">Will you attend?</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#7a1f1f] text-white px-6 py-4 text-lg w-full rounded-xl shadow-md hover:scale-[1.02] transition disabled:opacity-70"
                >
                  {loading ? "Submitting..." : "Submit RSVP"}
                </button>
              </form>
            ) : (
              <p className="text-xl text-[#7a1f1f]">
                Thank you! We can't wait to celebrate with you 💍
              </p>
            )}
            {/* Divider */}
            <div className="mt-12 w-24 h-[2px] bg-gradient-to-r from-transparent via-[#7a1f1f] to-transparent mx-auto opacity-60" />

            {/* Footer-style ending */}
            <div className="mt-6 space-y-2 text-center">
              <p className="font-serif text-base text-[#2d1a1a]">
                Deeksha & Vivek 💍
              </p>
              <p className="text-sm text-[#3a2a2a]">
                Built with love & chai ☕
              </p>
              <p className="text-sm text-[#3a2a2a]">ಪ್ರೀತಿಯಿಂದ… ಎಂದೆಂದಿಗೂ ❤️</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function TimeBox({ label, value }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="backdrop-blur-md bg-white/40 border border-white/30 shadow-lg rounded-xl px-4 py-3 min-w-[70px]"
    >
      {" "}
      <div className="text-2xl font-semibold text-[#5a1414]">
        {String(value).padStart(2, "0")}{" "}
      </div>{" "}
      <div className="text-xs tracking-widest text-gray-600 mt-1">
        {label.toUpperCase()}
      </div>
    </motion.div>
  );
}

function StorySlider() {
  const images = [
    "/images/1.jpg",
    "/images/2.jpg",
    "/images/3.jpg",
    "/images/4.jpg",
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const [touchStart, setTouchStart] = useState<number | null>(null);

  function handleTouchStart(e: any) {
    setTouchStart(e.touches[0].clientX);
  }

  function handleTouchEnd(e: any) {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;

    if (diff > 50) setCurrent((prev) => (prev + 1) % images.length);
    else if (diff < -50)
      setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    setTouchStart(null);
  }

  return (
    <div className="flex flex-col items-center">
      {" "}
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {" "}
        <div className="absolute inset-0 blur-xl opacity-30 bg-[#eac7b5]" />{" "}
        <div className="relative border border-[#e8d5c4]/50 rounded-2xl p-1 backdrop-blur-sm shadow-xl">
          <motion.img
            key={current}
            src={images[current]}
            className="w-full h-[450px] object-cover rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          />{" "}
        </div>{" "}
      </div>
      <div className="flex gap-3 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              current === index ? "bg-[#7a1f1f] scale-110" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
