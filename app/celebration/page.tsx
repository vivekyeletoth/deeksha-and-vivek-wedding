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
  const y = useTransform(scrollY, [0, 500], [0, 100]);

  const [activeSection, setActiveSection] = useState("home");

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

    if (localStorage.getItem("rsvp_submitted")) {
      alert("You have already submitted your RSVP 💍");
      return;
    }

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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          mode: "no-cors",
        }
      );

      localStorage.setItem("rsvp_submitted", "true");
      setSubmitted(true);
    } catch (err) {
      console.error(err);
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

  return (
    <>
      <audio ref={audioRef} loop>
        <source src="/music/perfect.mp3" type="audio/mpeg" />
      </audio>

      {/* MUSIC BUTTON */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-50 bg-[#7a1f1f] text-white px-4 py-3 rounded-full shadow-lg"
      >
        {musicPlaying ? "Pause 🎵" : "Play 🎵"}
      </button>

      {/* HEADER */}
      <header className="fixed top-0 w-full z-[100] bg-[#fdf6f2]/95 backdrop-blur-md border-b border-black/10 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between px-6 py-4">
          <div className="font-serif text-lg text-[#5a1414]">DV</div>

          <nav className="flex gap-8 text-sm tracking-widest text-gray-800">
            {[
              { id: "home", label: "WELCOME" },
              { id: "story", label: "OUR STORY" },
              { id: "details", label: "THE DAY" },
              { id: "rsvp", label: "JOIN US" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`relative pb-1 group transition ${
                  activeSection === item.id
                    ? "text-[#7a1f1f]"
                    : "hover:text-[#7a1f1f]"
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 bottom-0 h-[1px] bg-[#7a1f1f] transition-all duration-300 ${
                    activeSection === item.id
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="bg-[#fdf6f2] text-gray-800 overflow-y-auto scroll-smooth">
        {/* HERO */}
        <section
          id="home"
          className="min-h-screen flex items-center justify-center text-center px-6 relative overflow-hidden pt-20"
        >
          <motion.div
            style={{ y }}
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1591604466107-ec97de577aff')] bg-cover bg-center opacity-45"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-[#fff5f0]/75 to-[#fdf6f2]/90" />

          <div className="space-y-6 relative z-10">
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

        {/* STORY (FIXED ANIMATION) */}
        <section
          id="story"
          className="min-h-screen flex items-center justify-center px-6"
        >
          <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
            {/* LEFT: IMAGE SLIDER */}
            <StorySlider />

            {/* RIGHT: TEXT */}
            <div className="space-y-6 text-center md:text-left">
              <p className="text-sm tracking-widest text-[#7a1f1f]">
                OUR STORY
              </p>

              <h2 className="text-5xl md:text-6xl font-serif text-[#2c2c2c]">
                Deeksha & Vivek
              </h2>

              <motion.p
                className="text-lg md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                It began with a badminton match — a simple exchange of numbers
                that turned into endless conversations.
              </motion.p>

              <motion.p
                className="text-lg md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                From classrooms to dreams that took us far apart, we chose each
                other at every step.
              </motion.p>

              <motion.p
                className="text-lg md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                From being side by side to miles apart, we chose each other,
                every single time.
              </motion.p>

              <motion.p
                className="text-lg md:text-xl"
                className="font-serif text-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                And now, that choice becomes forever.
              </motion.p>
            </div>
          </div>
        </section>
        {/* DETAILS */}
        <section
          id="details"
          className="min-h-screen flex items-center justify-center text-center px-6"
        >
          <div className="space-y-6">
            <p className="text-sm tracking-widest text-[#7a1f1f]">THE DAY</p>
            <h2 className="text-4xl md:text-5xl font-serif">
              Wedding Ceremony
            </h2>
            <p className="text-lg">May 6, 2026</p>
            <p className="text-lg">10:15 AM</p>
            <p className="text-lg">Sri Venkateshwara Temple Austin</p>
          </div>
        </section>

        {/* RSVP */}
        <section
          id="rsvp"
          className="min-h-screen flex items-center justify-center text-center px-6"
        >
          <div className="space-y-6 max-w-md">
            <h2 className="text-4xl md:text-5xl font-serif">Join Us</h2>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  className="w-full p-3 → p-4 text-lg"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full p-3 border rounded"
                />
                <input
                  className="w-full p-3 → p-4 text-lg"
                  name="guests"
                  type="number"
                  placeholder="Guests"
                  required
                  className="w-full p-3 border rounded"
                />

                <select
                  name="attending"
                  required
                  className="w-full p-3 border rounded"
                >
                  <option value="">Will you attend?</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <button
                  className="bg-[#7a1f1f] text-white px-6 py-3 → py-4 text-lg"
                  type="submit"
                  className="bg-[#7a1f1f] text-white px-6 py-3 w-full rounded"
                >
                  Submit RSVP
                </button>
              </form>
            ) : (
              <p className="text-xl text-[#7a1f1f]">
                Thank you! We can't wait to celebrate with you 💍
              </p>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-20 text-center text-base text-gray-500">
          <p>Deeksha & Vivek 💍</p>
          <p>Built with love & chai ☕</p>
        </footer>
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
      <div className="text-2xl font-semibold text-[#5a1414]">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-xs tracking-widest text-gray-600 mt-1">
        {label.toUpperCase()}
      </div>
    </motion.div>
  );
}

function StorySlider() {
  const images = ["/images/1.jpg", "/images/2.jpg", "/images/3.jpg"];

  const [current, setCurrent] = useState(0);

  // ⏱ Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 👆 Swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);

  function handleTouchStart(e: any) {
    setTouchStart(e.touches[0].clientX);
  }

  function handleTouchEnd(e: any) {
    if (touchStart === null) return;

    const diff = touchStart - e.changedTouches[0].clientX;

    if (diff > 50) {
      // swipe left
      setCurrent((prev) => (prev + 1) % images.length);
    } else if (diff < -50) {
      // swipe right
      setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }

    setTouchStart(null);
  }

  return (
    <div className="flex flex-col items-center">
      {/* IMAGE CONTAINER */}
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Glow background */}
        <div className="absolute inset-0 blur-xl opacity-30 bg-[#eac7b5]" />

        {/* Image with soft border */}
        <div className="relative border border-[#e8d5c4]/50 rounded-2xl p-1 backdrop-blur-sm shadow-xl">
          <motion.img
            key={current}
            src={images[current]}
            className="w-full h-[450px] object-cover rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          />
        </div>
      </div>

      {/* DOTS */}
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
