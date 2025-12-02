/**
 * Dosya: frontend/src/components/Rezervasyon/Step3SaatSecimi.jsx
 * Açıklama: Adım 3 - Saat Seçimi (Minimalist & Kurumsal V2)
 */

import React, { useState, useEffect } from 'react';
import { rezervasyonAPI } from '../../services/api';

const Step3SaatSecimi = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [selectedSaat, setSelectedSaat] = useState(formData.saat_dilimi || '');
  const [saatDurumu, setSaatDurumu] = useState({});
  const [loading, setLoading] = useState(false);

  // Emojiler kaldırıldı, daha sade veri yapısı
  const saatDilimleri = [
    { saat: '07:00-08:30', baslik: '07:00 - 08:30', sure: '1.5 Saat', ikramlar: ['Kahvaltı'] },
    { saat: '09:00-10:30', baslik: '09:00 - 10:30', sure: '1.5 Saat', ikramlar: [] },
    { saat: '11:00-12:00', baslik: '11:00 - 12:00', sure: '1 Saat', ikramlar: [] },
    { saat: '12:00-13:30', baslik: '12:00 - 13:30', sure: '1.5 Saat', ikramlar: ['Öğle Yemeği'] },
    { saat: '14:00-15:30', baslik: '14:00 - 15:30', sure: '1.5 Saat', ikramlar: [] },
    { saat: '16:00-17:00', baslik: '16:00 - 17:00', sure: '1 Saat', ikramlar: ['Waffle'] }
  ];

  useEffect(() => {
    if (formData.tarih) {
      loadSaatDurumu();
    }
  }, [formData.tarih]);

  const loadSaatDurumu = async () => {
    setLoading(true);
    try {
      const response = await rezervasyonAPI.getTarihDoluluk(formData.tarih);
      if (response.success) {
        setSaatDurumu(response.saatler);
      }
    } catch (error) {
      console.error('Saat durumu yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaatSelect = (saat) => {
    if (saatDurumu[saat]?.dolu) return;
    setSelectedSaat(saat);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSaat) return;
    updateFormData('saat_dilimi', selectedSaat);
    nextStep();
  };

  return (
    <div className="max-w-4xl mx-auto font-sans px-4 sm:px-0">
      
    <div className="mb-8">
        <h2 className="text-3xl font-bold text-red-600 mb-2">
          Randevu Saati
        </h2>
        <p className="text-gray-500 text-sm">
          {new Date(formData.tarih).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D12A2C]"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Liste Görünümü */}
          <div className="space-y-3">
            {saatDilimleri.map((dilim) => {
              const durum = saatDurumu[dilim.saat] || {};
              const dolu = durum.dolu || false;
              const isSelected = selectedSaat === dilim.saat;

              return (
                <div
                  key={dilim.saat}
                  onClick={() => handleSaatSelect(dilim.saat)}
                  className={`
                    relative group flex flex-col sm:flex-row items-start sm:items-center justify-between 
                    p-5 rounded-lg border transition-all duration-200 cursor-pointer
                    ${dolu 
                      ? 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed' 
                      : isSelected 
                        ? 'bg-white border-[#D12A2C] ring-1 ring-[#D12A2C] shadow-md z-10' 
                        : 'bg-white border-gray-200 hover:border-gray-400 hover:bg-gray-50'}
                  `}
                >
                  {/* Sol Taraf: Saat ve Bilgi */}
                  <div className="flex items-center gap-4">
                    {/* Radyo Buton Görünümü */}
                    <div className={`
                      w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0
                      ${isSelected ? 'border-[#D12A2C]' : 'border-gray-300'}
                    `}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#D12A2C]"></div>}
                    </div>

                    <div>
                      <h3 className={`text-lg font-semibold ${dolu ? 'text-gray-400' : 'text-gray-900'}`}>
                        {dilim.baslik}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                        <span>⏱ {dilim.sure}</span>
                        {dilim.ikramlar.length > 0 && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-600 font-medium">
                              {dilim.ikramlar.join(', ')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sağ Taraf: Durum */}
                  <div className="mt-3 sm:mt-0 pl-9 sm:pl-0">
                    {dolu ? (
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded">
                        Dolu
                      </span>
                    ) : isSelected ? (
                      <span className="text-sm font-bold text-[#D12A2C] flex items-center gap-1">
                        Seçildi
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400 font-medium group-hover:text-gray-600">
                        Müsait
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Alt Bilgi & Butonlar */}
          <div className="pt-6 border-t border-gray-100 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
            <button
              type="button"
              onClick={prevStep}
              className="text-gray-500 hover:text-gray-800 font-medium text-sm transition-colors px-4 py-2"
            >
              ← Tarih Seçimine Dön
            </button>

            <button
              type="submit"
              disabled={!selectedSaat}
              className="w-full md:w-auto px-10 py-3 bg-[#D12A2C] text-white font-medium rounded hover:bg-red-900 transition-all shadow-sm hover:shadow-md disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              İlerle
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
          
        </form>
      )}
    </div>
  );
};

export default Step3SaatSecimi;