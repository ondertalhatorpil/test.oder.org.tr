import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, LayoutGrid, Headphones, HelpCircle, Info, BookMarked} from 'lucide-react';

const menuItems = [
  { id: 1, Icon: Home, href: '/', label: 'Anasayfa' },
  { id: 2, Icon: BookMarked, href: '/rezervasyon', label: 'Rezervasyon' },
  { id: 3, Icon: LayoutGrid, href: '/galeri', label: 'Galeri' },
  { id: 4, Icon: HelpCircle, href: '/bilgi-yarismasi', label: 'Bilgi Yarışması' },
  { id: 5, Icon: Info, href: '/hakkimizda', label: 'Hakkımızda' }
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const headerVariants = {
    top: {
      backgroundColor: 'rgba(255, 255, 255, 0)', // Tamamen şeffaf
      paddingTop: '2rem',
      paddingBottom: '2rem',
    },
    scrolled: {
      backgroundColor: 'rgba(255, 255, 255, 0)', // Scroll edilince de şeffaf
      paddingTop: '1rem', // Sadece küçül
      paddingBottom: '1rem',
    },
  };

  return (
    <motion.nav
      className="w-full fixed top-0 left-0 z-[1000]"
      variants={headerVariants}
      animate={isScrolled ? 'scrolled' : 'top'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16">
          <div className="flex items-center space-x-2">
            <ul 
              className="flex items-center space-x-2 relative"
              onMouseLeave={() => setHoveredId(null)}
            >
              {menuItems.map((item) => (
                <li key={item.id} className="relative">
                  <a
                    href={item.href}
                    className={`
                      relative block p-3 text-lg font-semibold text-[#D12A2C] rounded-lg
                      transition-all duration-300 ease-in-out
                      ${isScrolled 
                        ? 'bg-[#D12A2C] backdrop-blur-md shadow-lg border border-[#D12A2C] text-[#fff]' 
                        : 'bg-transparent shadow-none border-transparent'
                      }
                    `}
                    onMouseEnter={() => setHoveredId(item.id)}
                    aria-label={item.label}
                  >
                    {/* "Magic Ink" Hover Efekti (z-0) */}
                    {hoveredId === item.id && (
                      <motion.div
                        layoutId="magic-ink" 
                        className="absolute inset-0 bg-[#D12A2C] rounded-lg z-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      />
                    )}
                    
                    {/* İkonun kendisi (z-10) */}
                    <span className={`relative z-10 transition-colors ${hoveredId === item.id ? 'text-white' : ''}`}>
                      <item.Icon size={24} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Header;