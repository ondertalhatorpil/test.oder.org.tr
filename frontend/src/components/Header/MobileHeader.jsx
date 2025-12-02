import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, LayoutGrid, Headphones, HelpCircle, Info, Menu, X, BookMarked } from 'lucide-react';

// Menü listemiz (Etiketler çok önemli)
const menuItems = [
  { id: 1, Icon: Home, href: '/', label: 'Anasayfa' },
  { id: 2, Icon: BookMarked, href: '/rezervasyon', label: 'Rezervasyon' },
  { id: 3, Icon: LayoutGrid, href: '/galeri', label: 'Galeri' },
  { id: 4, Icon: HelpCircle, href: '/bilgi-yarismasi', label: 'Bilgi Yarışması' },
  { id: 5, Icon: Info, href: '/hakkimizda', label: 'Hakkımızda' }
];

// Mobil açılır menü için animasyon (Değişiklik yok)
const mobileMenuVariant = {
  hidden: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.2, 
      ease: 'easeIn',
      staggerChildren: 0.05
    }
  },
};

// Menü linkleri için animasyon (Değişiklik yok)
const mobileItemVariant = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 }
};

// Tooltip (İpucu) animasyonu
const tooltipVariant = {
  hidden: { opacity: 0, y: -5, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 }
};

// --- Ana Bileşen ---

const Header = () => {
  // Masaüstü state'leri (Artık mobil için de kullanacağız)
  const [hoveredId, setHoveredId] = useState(null);
  
  // Mobil state (Değişiklik yok)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setHoveredId(null); // Menü kapanınca tooltip'i de kapat
  };

  // Scroll dinleyicisini ve body kilitlemesini basitleştirelim
  useEffect(() => {
    // Mobil menü açıkken body scroll'u kilitle
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  // Desktop için scroll effect'i (Kodunuzda vardı, korundu)
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    // Sadece desktop'ta çalışması için media query eklendi
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    
    const scrollListener = () => {
      if (mediaQuery.matches) {
        handleScroll();
      }
    };
    
    window.addEventListener('scroll', scrollListener);
    return () => window.removeEventListener('scroll', scrollListener);
  }, []);

  return (
    <>
      {/* --- YENİ MOBİL TASARIM --- */}
      <div className="fixed top-5 left-0 w-full z-[1000] md:hidden px-4">
        <div className="relative flex flex-col items-center">
          
          {/* Hamburger Butonu (Değişiklik yok) */}
          <button 
            className="p-2 cursor-pointer text-white flex items-center justify-center rounded-full transition-all duration-300 z-[1001] hover:bg-[#D12A2C] shadow-[0_5px_15px_rgba(0,0,0,0.15)] bg-[#D12A2C] border border-[#D12A2C]"
            onClick={toggleMenu}
            aria-label="Menüyü aç/kapat"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isMenuOpen ? 'x' : 'menu'}
                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </AnimatePresence>
          </button>

          {/* Açılır Menü Alanı (Artık Yatay Kapsül) */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="
                  absolute top-full mt-2
                  bg-[#D12A2C] backdrop-blur-md 
                  rounded-full shadow-xl border border-[#D12A2C]
                  overflow-hidden
                "
                variants={mobileMenuVariant}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onMouseLeave={() => setHoveredId(null)} 
              >
                <motion.ul
                  className="flex flex-row p-1.5" // Dikeyden yataya (flex-row) ve p-2
                  variants={mobileMenuVariant}
                >
                  {menuItems.map((item) => (
                    <motion.li 
                      key={item.id} 
                      variants={mobileItemVariant}
                      className="relative" // Tooltip'i konumlandırmak için
                    >
                      {/* --- TOOLTIP (Etiket) --- */}
                      <AnimatePresence>
                        {hoveredId === item.id && (
                          <motion.div
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-amber-800 text-amber-50 text-xs font-semibold rounded-full shadow-md whitespace-nowrap"
                            variants={tooltipVariant}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                          >
                            {item.label}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <a
                        href={item.href}
                        onClick={toggleMenu}
                        className="flex items-center justify-center w-12 h-12 text-[#fff] rounded-full transition-colors duration-200 hover:bg-amber-100"
                        onMouseEnter={() => setHoveredId(item.id)}
                      >
                        <item.Icon size={22} />
                      </a>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </>
  );
};

export default Header;