import React, { useState, useEffect } from "react";

import banner1 from "../assets/banner_company_1.png";
import banner2 from "../assets/banner_company_2.png";

const BANNER_DATA = [
  {
    image: banner1,
    bgClass: "from-[#1a1110] via-[#2c1d1b] to-[#1a1110]",
  },
  {
    image: banner2,
    bgClass: "from-[#111827] via-[#1f2937] to-[#111827]",
  },
];

const CustomSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // LogikaPrevious Slide
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? BANNER_DATA.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  // Logika Next Slide
  const nextSlide = () => {
    const isLastSlide = currentIndex === BANNER_DATA.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Auto Slide (Optional)
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const slide = BANNER_DATA[currentIndex];

  return (
    <section
      className={`relative w-full min-h-screen bg-gradient-to-r ${slide.bgClass} overflow-hidden transition-all duration-700 ease-in-out flex flex-col justify-center items-center`}
    >
      {/* Tombol Kiri */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
      >
        <span className="text-white text-lg">❮</span>
      </button>

      {/* Tombol Kanan */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
      >
        <span className="text-white text-lg">❯</span>
      </button>

      {/* Container Utama: Dots di Atas, Gambar di Bawah */}
      <div className="flex flex-col items-center gap-6">
        
        {/* SLIDER DOTS - ATAS */}
        <div className="flex gap-3 z-20">
          {BANNER_DATA.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "w-8 h-2 bg-white"
                  : "w-2 h-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* GAMBAR - BAWAH */}
        <div className="relative">
          <div className="absolute w-96 h-96 bg-[#7a4843]/20 blur-[120px] rounded-full -z-10" />
          <img
            src={slide.image}
            alt="Banner"
            className="relative z-10 w-full max-w-xl md:max-w-2xl object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default CustomSlider;