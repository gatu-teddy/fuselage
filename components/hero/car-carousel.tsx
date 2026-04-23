"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const CARS = [
  { id: 1, make: "Mercedes-Benz", model: "S 580",         src: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&h=1100&fit=crop&q=85" },
  { id: 2, make: "Range Rover",   model: "SVAutobiography", src: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&h=1100&fit=crop&q=85" },
  { id: 3, make: "Porsche",       model: "Cayenne Turbo",  src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&h=1100&fit=crop&q=85" },
  { id: 4, make: "Lamborghini",   model: "Urus",           src: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&h=1100&fit=crop&q=85" },
  { id: 5, make: "BMW",           model: "M760i",          src: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&h=1100&fit=crop&q=85" },
  { id: 6, make: "Rolls-Royce",   model: "Cullinan",       src: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=900&h=1100&fit=crop&q=85" },
  { id: 7, make: "Ferrari",       model: "Purosangue",     src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&h=1100&fit=crop&q=85" },
];

const INTERVAL = 3500; // ms per slide

export function CarCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % CARS.length);
    }, INTERVAL);
    return () => clearInterval(t);
  }, []);

  const car = CARS[index];

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden" style={{ minHeight: "90vh" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={car.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.75, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={car.src}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover"
            sizes="50vw"
            priority={car.id === 1}
          />

          {/* Left fade so it blends into the dark left panel */}
          <div
            className="absolute inset-y-0 left-0 w-48 pointer-events-none"
            style={{ background: "linear-gradient(to right, #050206 0%, transparent 100%)" }}
          />
          {/* Bottom vignette */}
          <div
            className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
            style={{ background: "linear-gradient(to top, #050206 0%, transparent 100%)" }}
          />
          {/* Top vignette */}
          <div
            className="absolute inset-x-0 top-0 h-32 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, #050206 0%, transparent 100%)" }}
          />

          {/* Make / model label */}
          <div className="absolute bottom-10 left-8 right-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.45 }}
            >
              <div className="text-lg font-black tracking-tight" style={{ color: "#FBFFF4" }}>{car.make}</div>
              <div className="text-sm" style={{ color: "#9A8174" }}>{car.model}</div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="absolute bottom-10 right-6 flex flex-col gap-1.5 z-10">
        {CARS.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setIndex(i)}
            className="w-1 rounded-full transition-all duration-300"
            style={{
              height: i === index ? 20 : 6,
              backgroundColor: i === index ? "#9A8174" : "rgba(251,255,244,0.25)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
