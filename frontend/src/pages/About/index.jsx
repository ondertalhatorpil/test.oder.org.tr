import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Clock, MapPin, BookOpen, Scroll, Award } from 'lucide-react';
import Header from '../../components/Header/HeaderController'; // Header'ınızın yolu

const AboutPagePremium = () => {
  const [activeYear, setActiveYear] = useState(0);
  const scrollRef = useRef(null);

  const timelineData = [
    {
      year: "1744",
      title: "Temelin Atılması",
      desc: "Dârüssaâde Ağası Hacı Beşir Ağa tarafından, Osmanlı'nın Batı'ya açılan yüzü olarak Cağaloğlu'nda inşasına başlandı.",
      icon: <MapPin className="w-6 h-6" />
    },
    {
      year: "1745",
      title: "Külliyenin Tamamlanması",
      desc: "Cami, medrese, tekke, kütüphane, sebil ve sıbyan mektebi ile devasa bir kompleks olarak hizmete açıldı.",
      icon: <Award className="w-6 h-6" />
    },
    {
      year: "1826",
      title: "II. Mahmud Dönemi",
      desc: "Büyük bir onarımdan geçti. Dönemin modernleşme hareketleri mimariye de yansıdı.",
      icon: <Scroll className="w-6 h-6" />
    },
    {
      year: "2025",
      title: "Modern Miras",
      desc: "Günümüzde Türk-İslam eserlerinin en nadide barok örneklerinden biri olarak ziyaretçilerini ağırlıyor.",
      icon: <Clock className="w-6 h-6" />
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const sections = scrollRef.current.children;
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
          setActiveYear(i);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 selection:bg-red-500/30 font-sans">
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Arka Plan Görseli */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/foto.jpeg"
            alt="Beşirağa Külliyesi Genel Görünüm"
            className="w-full h-full object-cover opacity-40 scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/50 to-slate-950" />
        </div>

        {/* Hero İçerik */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-red-500/20 bg-red-500/5 mb-8 backdrop-blur-sm animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-sm tracking-widest uppercase font-medium">1744'ten Günümüze</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-none tracking-tight animate-fade-in-up delay-100">
            Taşa Kazınan <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-200 via-red-400 to-red-600">
              Barok Zarafeti
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Osmanlı mimarisinin klasik çizgilerinden sıyrılıp, Batı esintileriyle dans ettiği o eşsiz anın tanığı: Beşirağa Külliyesi.
          </p>
        </div>

        {/* Scroll Mouse İkonu */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-bounce">
          <span className="text-xs tracking-widest uppercase text-slate-500">Keşfet</span>
          <div className="w-px h-12 bg-gradient-to-b from-red-500 to-transparent" />
        </div>
      </section>

      {/* --- SPLIT INFO SECTION --- */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">

          {/* Sol: Görsel Kompozisyon */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="/images/foto.jpeg" // Detay fotoğrafı
                alt="Mimari Detay"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              {/* Resim Üzeri İstatistik */}
              <div className="absolute bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md p-6 border-t border-white/10 flex justify-around">
                <div className="text-center">
                  <div className="text-3xl font-serif text-red-400">280+</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Yıllık Tarih</div>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <div className="text-3xl font-serif text-red-400">5</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Ana Yapı</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ: Metin İçeriği */}
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 leading-tight">
              Lale Devri'nin <br />
              <span className="italic text-slate-500">Son Nefesi</span>
            </h2>
            <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
              <p>
                Dârüssaâde Ağası Hacı Beşir Ağa, sadece bir devlet adamı değil, aynı zamanda ince ruhlu bir sanat hamisiydi. Ömrünün sonbaharında, İstanbul'a armağan ettiği bu külliye, bir veda busesi gibidir.
              </p>
              <p>
                Soğukçeşme semtinde yükselen bu yapı, Osmanlı'nın klasik "kare ve kubbe" nizamını korurken, süslemelerinde ve detaylarında Avrupa'nın "Barok" ve "Rokoko" rüzgarlarını hissettirir.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* --- INTERACTIVE TIMELINE SECTION --- */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">Zaman Çizelgesi</h2>
            <p className="text-slate-400">Taşların şahit olduğu asırlar</p>
          </div>

          <div className="relative">
            {/* Dikey Çizgi */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-slate-800 transform md:-translate-x-1/2 ml-8 md:ml-0" />

            {/* Timeline Items */}
            <div ref={scrollRef} className="space-y-24">
              {timelineData.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex items-center md:justify-between group ${index % 2 === 0 ? 'flex-row' : 'flex-row md:flex-row-reverse'
                    }`}
                >
                  {/* Merkez Nokta */}
                  <div className="absolute left-0 md:left-1/2 w-16 h-16 flex items-center justify-center transform md:-translate-x-1/2 ml-0 md:ml-0 z-10">
                    <div className={`w-4 h-4 rounded-full border-4 border-slate-900 transition-colors duration-500 ${activeYear === index ? 'bg-red-500 scale-125 shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'bg-slate-700'
                      }`} />
                  </div>

                  {/* İçerik Kartı */}
                  <div className={`ml-20 md:ml-0 w-full md:w-[42%] p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 ${activeYear === index ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-10'
                    }`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-5xl font-serif font-bold text-white/10 group-hover:text-red-500/20 transition-colors">
                        {item.year}
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-3">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-40 flex items-center justify-center overflow-hidden">
        {/* Arka Plan Rengi */}
        <div className="absolute inset-0 bg-slate-900" />

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="text-6xl text-red-500 mb-8 font-serif opacity-50">"</div>
          <p className="text-xl md:text-5xl font-serif text-white leading-tight mb-8 drop-shadow-2xl">
            Sebilin içeri kavisli pencereleri ve kütüphanenin malakari süslemeleri,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-200 to-red-500 italic px-2 font-light">
              medeniyetimizin inceliğini
            </span>
            fısıldar.
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-red-500/30"></div>
            <div className="text-red-500/60 text-xs tracking-[0.3em]">Mimari Notlar</div>
            <div className="h-px w-12 bg-red-500/30"></div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-t from-black to-slate-950 text-center px-6">
        <h2 className="text-4xl md:text-5xl font-serif text-white mb-8">Mirasa Dokunun</h2>
        <p className="text-slate-400 mb-12 max-w-lg mx-auto">
          Sanal tur ile külliyenin her köşesini oturduğunuz yerden detaylıca inceleyebilirsiniz.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a href="bilgi-yarismasi" className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40 flex items-center gap-2 group">
            Bilgi Yarışması <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="/galeri" className="px-10 py-4 border border-white/20 hover:bg-white/5 text-white rounded-full font-medium transition-all">
            Fotoğraf Galerisi
          </a>
        </div>
      </section>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500&display=swap');

        .font-serif {
          font-family: 'Playfair Display', serif;
        }
        .font-sans {
          font-family: 'Inter', sans-serif;
        }

        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s linear infinite alternate;
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AboutPagePremium;