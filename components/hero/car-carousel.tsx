"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";

// Placeholder images — swap src with real vehicle photos when ready
const CARS = [
  { id: 1, make: "Mercedes-Benz", model: "S 580", src: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=560&fit=crop&q=80" },
  { id: 2, make: "Range Rover",   model: "SVAutobiography", src: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=560&fit=crop&q=80" },
  { id: 3, make: "Porsche",       model: "Cayenne Turbo", src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=560&fit=crop&q=80" },
  { id: 4, make: "Lamborghini",   model: "Urus", src: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=560&fit=crop&q=80" },
  { id: 5, make: "BMW",           model: "M760i", src: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=560&fit=crop&q=80" },
  { id: 6, make: "Rolls-Royce",   model: "Cullinan", src: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=560&fit=crop&q=80" },
  { id: 7, make: "Ferrari",       model: "Purosangue", src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=560&fit=crop&q=80" },
];

// Duplicate for seamless infinite loop
const TRACK = [...CARS, ...CARS];

const CARD_W = 220;   // px — card width
const GAP    = 16;    // px — gap between cards
const UNIT   = CARD_W + GAP;
const TOTAL  = UNIT * CARS.length; // width of one full set

export function CarCarousel() {
  const controls = useAnimationControls();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // 2-second delay before scroll begins
    const t = setTimeout(async () => {
      setStarted(true);
      await controls.start({
        x: [-0, -TOTAL],
        transition: {
          duration: CARS.length * 3.2, // ~3.2s per card
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    }, 2000);
    return () => clearTimeout(t);
  }, [controls]);

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ minHeight: 420 }}>

      {/* Left fade mask */}
      <div
        className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #050206, transparent)" }}
      />
      {/* Right fade mask */}
      <div
        className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #050206, transparent)" }}
      />

      <motion.div
        animate={controls}
        className="flex items-center h-full"
        style={{ gap: GAP, width: UNIT * TRACK.length }}
      >
        {TRACK.map((car, i) => (
          <CarCard key={`${car.id}-${i}`} car={car} />
        ))}
      </motion.div>
    </div>
  );
}

function CarCard({ car }: { car: (typeof CARS)[number] }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="relative shrink-0 rounded-2xl overflow-hidden border"
      style={{
        width: CARD_W,
        height: 300,
        borderColor: "#3B3B3B",
        backgroundColor: "#0D0B0E",
      }}
    >
      {/* Image */}
      {!imgError ? (
        <Image
          src={car.src}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover"
          onError={() => setImgError(true)}
          sizes="220px"
        />
      ) : (
        /* Fallback gradient tile if image fails */
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #1a1a1a, #0D0B0E)" }}
        >
          <span className="text-4xl">🚗</span>
        </div>
      )}

      {/* Bottom label overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 px-3 py-3"
        style={{ background: "linear-gradient(to top, rgba(5,2,6,0.95), transparent)" }}
      >
        <div className="text-xs font-bold" style={{ color: "#FBFFF4" }}>{car.make}</div>
        <div className="text-[10px]" style={{ color: "#9A8174" }}>{car.model}</div>
      </div>

      {/* Corner accent */}
      <div
        className="absolute top-2.5 right-2.5 w-4 h-4 border-r border-t rounded-tr-md"
        style={{ borderColor: "rgba(154,129,116,0.4)" }}
      />
    </div>
  );
}
