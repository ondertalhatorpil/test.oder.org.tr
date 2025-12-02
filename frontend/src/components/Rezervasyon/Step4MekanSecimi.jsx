import React, { useState, useEffect } from 'react';
import { rezervasyonAPI } from '../../services/api';
import mekanlarData from '../../data/mekanlarData';

// --- Mekan Galeri Modalı Bileşeni ---
const MekanGaleriModal = ({ isOpen, onClose, mekanlar }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Modal Başlık */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-red-600">Mekan Görselleri</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Kapat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal İçerik (Görsel Grid) */}
        <div className="p-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mekanlar.map((mekan) => (
              <div key={mekan.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"> 
                {/* Yatay görsel oranı: 16:9 (aspect-video) */}
                <div className="relative w-full aspect-video overflow-hidden bg-gray-300"> 
                  {mekan.gorselUrl ? (
                    <img 
                      src={mekan.gorselUrl} 
                      alt={mekan.mekan_adi} 
                      // Görselin kapsayıcıyı doldurması için object-cover kullanıldı
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.alt = `Görsel Yüklenemedi: ${mekan.gorselUrl}`;
                        e.target.style.opacity = '0.1';
                        e.target.style.background = 'repeating-linear-gradient(45deg, #ccc 0, #ccc 10px, #eee 10px, #eee 20px)';
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                      Görsel Yok
                    </div>
                  )}
                </div>
                <div className="p-3 bg-white">
                  <p className="text-center text-sm font-semibold text-gray-700">{mekan.mekan_adi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Step4MekanSecimi = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [mekanlar, setMekanlar] = useState([]);
  const [seciliMekanlar, setSeciliMekanlar] = useState(formData.mekanlar || {});
  const [loading, setLoading] = useState(false);
  const [musaitlikMesaji, setMusaitlikMesaji] = useState(null);
  const [musaitlikKontrolEdiliyor, setMusaitlikKontrolEdiliyor] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    loadMekanlar();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(seciliMekanlar).length > 0) {
        const toplamKisi = Object.values(seciliMekanlar).reduce((a, b) => a + b, 0);
        if (toplamKisi > 0) {
          checkMusaitlik();
        } else {
          setMusaitlikMesaji(null);
        }
      } else {
        setMusaitlikMesaji(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [seciliMekanlar]);

  const loadMekanlar = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); 
      setMekanlar(mekanlarData); 
    } catch (error) {
      console.error('Mekanlar yükleme hatası:', error);
      setMekanlar([]); 
    } finally {
      setLoading(false);
    }
  };

  const checkMusaitlik = async () => {
    setMusaitlikKontrolEdiliyor(true);
    try {
      const response = await rezervasyonAPI.musaitlikKontrol({
        tarih: formData.tarih,
        saat_dilimi: formData.saat_dilimi,
        mekanlar: seciliMekanlar
      });

      setMusaitlikMesaji({
        musait: response.musait,
        message: response.message,
        data: response.mekanDurumu
      });
    } catch (error) {
      console.error('Müsaitlik kontrol hatası:', error);
      setMusaitlikMesaji({
        musait: false,
        message: 'Kontrol sırasında hata oluştu.'
      });
    } finally {
      setMusaitlikKontrolEdiliyor(false);
    }
  };

  const handleMekanToggle = (mekanAdi) => {
    const yeniSeciliMekanlar = { ...seciliMekanlar };
    
    if (yeniSeciliMekanlar.hasOwnProperty(mekanAdi)) {
      delete yeniSeciliMekanlar[mekanAdi];
    } else {
      yeniSeciliMekanlar[mekanAdi] = 0;
    }
    
    setSeciliMekanlar(yeniSeciliMekanlar);
  };

  const handleKisiSayisiChange = (mekanAdi, kisi) => {
    const kisiSayisi = parseInt(kisi) || 0;
    const maxKisi = 9999; 
    const yeniKisiSayisi = Math.min(Math.max(0, kisiSayisi), maxKisi);
    
    setSeciliMekanlar({
      ...seciliMekanlar,
      [mekanAdi]: yeniKisiSayisi
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const toplamKisi = Object.values(seciliMekanlar).reduce((a, b) => a + b, 0);

    if (Object.keys(seciliMekanlar).length === 0) {
      alert('Lütfen en az bir mekan seçiniz.');
      return;
    }
    if (toplamKisi === 0) {
      alert('Lütfen katılımcı sayılarını giriniz.');
      return;
    }
    if (!musaitlikMesaji || (musaitlikMesaji && !musaitlikMesaji.musait)) {
      alert('Seçilen mekanlar bu tarih/saatte uygun değil veya kontrol tamamlanmadı.');
      return;
    }
    if (musaitlikKontrolEdiliyor) {
        alert('Lütfen müsaitlik kontrolünün tamamlanmasını bekleyiniz.');
        return;
    }

    updateFormData('mekanlar', seciliMekanlar);
    nextStep();
  };

  const toplamKisi = Object.values(seciliMekanlar).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-4xl mx-auto font-sans px-4 sm:px-0">
      
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-red-600 mb-2">Mekan ve Kişi Sayısı</h2>
        
        <button 
          type="button"
          onClick={() => setIsModalOpen(true)}
          disabled={loading || mekanlar.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D12A2C]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A1 1 0 0011.666 3H8.333a1 1 0 00-.707.293L6.505 4.707a1 1 0 01-.707.293H4zm1 2h10v7a1 1 0 01-1 1H5a1 1 0 01-1-1V7zm5 2a3 3 0 100 6 3 3 0 000-6z" clipRule="evenodd" />
          </svg>
          Görseller
        </button>
      </div>

      {/* Yüklenme Durumu */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D12A2C]"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Mekan Listesi Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mekanlar.map((mekan) => {
              const secili = seciliMekanlar.hasOwnProperty(mekan.mekan_adi);
              const kisiSayisi = seciliMekanlar[mekan.mekan_adi] || 0;

              return (
                <div
                  key={mekan.id}
                  className={`
                    relative rounded-lg border transition-all duration-200 overflow-hidden
                    ${secili 
                      ? 'border-[#D12A2C] bg-white ring-1 ring-[#D12A2C] shadow-md' 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}
                  `}
                >
                  {/* Kart Header */}
                  <div 
                    onClick={() => handleMekanToggle(mekan.mekan_adi)}
                    className="p-4 cursor-pointer flex items-center justify-between select-none"
                  >
                    <div className="flex items-center gap-3">
                      {/* Checkbox */}
                      <div className={`
                        w-5 h-5 rounded border flex items-center justify-center transition-colors
                        ${secili ? 'bg-[#D12A2C] border-[#D12A2C]' : 'bg-white border-gray-300'}
                      `}>
                        {secili && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      
                      <div>
                        <h3 className={`font-semibold text-sm sm:text-base ${secili ? 'text-red-900' : 'text-gray-700'}`}>
                          {mekan.mekan_adi}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {secili && (
                    <div className="bg-red-50/50 px-4 py-3 border-t border-red-100 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-[#D12A2C] uppercase tracking-wide">
                          Katılımcı Sayısı
                        </label>
                        
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleKisiSayisiChange(mekan.mekan_adi, Math.max(0, kisiSayisi - 5))}
                            className="w-8 h-8 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-red-700 transition-colors"
                          >
                            -
                          </button>
                          
                          <input
                            type="number"
                            min="0"
                            value={kisiSayisi}
                            onChange={(e) => handleKisiSayisiChange(mekan.mekan_adi, e.target.value)}
                            className="w-16 h-8 text-center border border-gray-200 rounded text-gray-900 font-bold focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                          />
                          
                          <button
                            type="button"
                            onClick={() => handleKisiSayisiChange(mekan.mekan_adi, kisiSayisi + 5)}
                            className="w-8 h-8 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-red-700 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Durum ve Aksiyon Alanı */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur py-4 border-t border-gray-100 z-20">
            {/* Toplam Kişi */}
            {toplamKisi > 0 && (
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-gray-600 font-medium">Toplam Katılımcı</span>
                <span className="text-xl font-bold text-[#D12A2C]">{toplamKisi} Kişi</span>
              </div>
            )}

            {/* Müsaitlik Mesajı */}
            {musaitlikKontrolEdiliyor ? (
              <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded flex items-center gap-2 mb-4">
                <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                Uygunluk kontrol ediliyor...
              </div>
            ) : musaitlikMesaji && (
              <div className={`p-3 text-sm rounded flex items-start gap-2 mb-4 ${
                musaitlikMesaji.musait ? 'bg-green-50 text-green-800' : 'bg-red-50 text-[#D12A2C]'
              }`}>
                <span className="text-lg leading-none">{musaitlikMesaji.musait ? '✓' : '⚠️'}</span>
                <div>
                  <span className="font-bold block mb-0.5">{musaitlikMesaji.musait ? 'Müsait' : 'Uygun Değil'}</span>
                  <span className="opacity-90">{musaitlikMesaji.message}</span>
                </div>
              </div>
            )}

            {/* Butonlar */}
            <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="text-gray-500 hover:text-gray-800 font-medium text-sm transition-colors px-4 py-2"
              >
                ← Geri
              </button>

              <button
                type="submit"
                disabled={toplamKisi === 0 || (musaitlikMesaji && !musaitlikMesaji.musait) || musaitlikKontrolEdiliyor}
                className="w-full md:w-auto px-10 py-3 bg-[#D12A2C] text-white font-medium rounded hover:bg-red-900 transition-all shadow-sm hover:shadow-md disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Devam Et
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </form>
      )}
      
      {/* Modal */}
      <MekanGaleriModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mekanlar={mekanlar}
      />
    </div>
  );
};

export default Step4MekanSecimi;