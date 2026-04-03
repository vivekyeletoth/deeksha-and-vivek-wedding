"use client";

import { useEffect, useState } from "react";

export default function Celebration() {
  const weddingDate = new Date("2026-02-27T00:00:00");
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

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
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="bg-[#faf7f5] text-gray-800">
      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac')] bg-cover bg-center opacity-30"></div>

        <div className="relative backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl px-10 py-12 shadow-2xl">
          <p className="uppercase tracking-widest text-sm text-gray-600 mb-4">
            We’re Getting Married
          </p>

          <h1 className="text-5xl md:text-7xl font-serif mb-4">
            Deeksha & Vivek
          </h1>

          <p className="text-lg text-gray-700 mb-6">February 27, 2026</p>

          <div className="flex gap-4 justify-center mt-6">
            <TimeBox label="Days" value={timeLeft.days} />
            <TimeBox label="Hours" value={timeLeft.hours} />
            <TimeBox label="Min" value={timeLeft.minutes} />
            <TimeBox label="Sec" value={timeLeft.seconds} />
          </div>
        </div>
      </section>

      {/* INVITE MESSAGE */}
      <section className="py-24 px-6 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-serif mb-6">Our Celebration</h2>
        <p className="text-gray-600 leading-relaxed text-lg">
          With immense joy and love in our hearts, we invite you to be part of
          our wedding celebrations. Your presence will make our day truly
          special.
        </p>
      </section>

      {/* DETAILS */}
      <section className="py-20 px-6 bg-white/60 backdrop-blur-lg">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <DetailCard title="Venue" value="Add your venue" />
          <DetailCard title="Date" value="Feb 27, 2026" />
          <DetailCard title="Time" value="Add time" />
        </div>
      </section>

      {/* EVENTS TIMELINE */}
      <section className="py-24 px-6 bg-pink-50">
        <h2 className="text-4xl font-serif text-center mb-12">Events</h2>

        <div className="max-w-3xl mx-auto space-y-6">
          <EventCard title="Haldi" time="Morning" />
          <EventCard title="Wedding Ceremony" time="Afternoon" />
          <EventCard title="Reception" time="Evening" />
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-24 px-6">
        <h2 className="text-4xl font-serif text-center mb-12">
          Moments Together
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <GalleryImage src="https://images.unsplash.com/photo-1519741497674-611481863552" />
          <GalleryImage src="https://images.unsplash.com/photo-1520857014576-2c4f4c972b57" />
          <GalleryImage src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" />
        </div>
      </section>

      {/* RSVP */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-white to-pink-50">
        <h2 className="text-4xl font-serif mb-6">Join Us</h2>
        <p className="text-gray-600 mb-8">
          We would love to celebrate with you
        </p>

        <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition">
          RSVP Coming Soon
        </button>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-gray-500 text-sm">
        Deeksha ❤️ Vivek
      </footer>
    </main>
  );
}

/* COMPONENTS */

function TimeBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="backdrop-blur-md bg-white/40 border border-white/30 rounded-xl px-4 py-3 w-20 shadow-md">
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}

function DetailCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{value}</p>
    </div>
  );
}

function EventCard({ title, time }: { title: string; time: string }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md flex justify-between">
      <span className="font-medium">{title}</span>
      <span className="text-gray-500">{time}</span>
    </div>
  );
}

function GalleryImage({ src }: { src: string }) {
  return (
    <div className="overflow-hidden rounded-2xl shadow-lg group">
      <img
        src={src}
        alt="gallery"
        className="w-full h-80 object-cover group-hover:scale-110 transition duration-500"
      />
    </div>
  );
}
