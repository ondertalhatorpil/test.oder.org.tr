import React from 'react';
import { Phone, Mail } from 'lucide-react';

const FinchLanding = () => {
  return (
    <div className="flex min-h-screen font-['Space_Grotesk',sans-serif] bg-white items-center justify-center">
      <main className="w-full max-w-4xl px-8 md:px-16 py-16 flex flex-col justify-between min-h-screen">
        <div className="flex-1 flex flex-col justify-center gap-12 md:gap-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal leading-tight tracking-tight text-[#D12A2C] m-0 text-center">
            Ecdat yadigârı, <br /> huzurun adresi.
          </h1>

          <div className="flex flex-col gap-6 items-center">
            <a href="tel:+905551234567" className="flex items-center gap-4 no-underline text-black text-base md:text-lg group">
              <span className="w-12 h-12 md:w-8 md:h-8 rounded-full p-2 bg-[#D12A2C] flex items-center justify-center transition-all duration-300 ">
                <Phone size={24} className="text-white" />
              </span>
              <span className=" transition-colors duration-300">+90 553 297 88 73</span>
            </a>
            <a href="mailto:info@besiragakulliyesi.com" className="flex items-center gap-4 no-underline text-black text-base md:text-lg group">
              <span className="w-12 h-12 md:w-8 md:h-8 rounded-full p-2 bg-[#D12A2C] flex items-center justify-center transition-all duration-300 ">
                <Mail size={24} className="text-white" />
              </span>
              <span className=" transition-colors duration-300">besiraga@onder.org.tr</span>
            </a>
          </div>
        </div>
        <footer className="text-gray-600 text-xs md:text-sm mt-8 text-center">
          <p>Copyright © 2025, Beşirağa Külliyesi | ÖNDER İmam Hatipliler Derneği</p>
        </footer>
      </main>
    </div>
  );
};

export default FinchLanding;