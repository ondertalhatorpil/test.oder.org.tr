/**
 * Dosya: frontend/src/components/Rezervasyon/Step2TarihSecimi.jsx
 * Açıklama: Adım 2 - Tarih seçimi (Responsive & Kurumsal)
 */

import React, { useState, useEffect } from 'react';
import { rezervasyonAPI } from '../../services/api';

const Step2TarihSecimi = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formData.tarih || '');
  const [doluGunler, setDoluGunler] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDoluGunler();
  }, [currentMonth]);

  useEffect(() => {
    if (formData.tarih) {
      setSelectedDate(formData.tarih);
    }
  }, [formData.tarih]);

  const loadDoluGunler = async () => {
    setLoading(true);
    try {
      const yil = currentMonth.getFullYear();
      const ay = currentMonth.getMonth() + 1;
      const gunSayisi = new Date(yil, ay, 0).getDate();

      const doluGunlerTemp = {};

      for (let gun = 1; gun <= gunSayisi; gun++) {
        const tarih = `${yil}-${String(ay).padStart(2, '0')}-${String(gun).padStart(2, '0')}`;
        try {
          const response = await rezervasyonAPI.getTarihDoluluk(tarih);
          if (response.success) {
            const saatler = response.saatler;
            const tumSaatlerDolu = Object.values(saatler).every(saat => saat.dolu);
            doluGunlerTemp[tarih] = tumSaatlerDolu;
          }
        } catch (error) {
          console.error(`Tarih doluluk hatası (${tarih}):`, error);
        }
      }
      setDoluGunler(doluGunlerTemp);
    } catch (error) {
      console.error('Dolu günler yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (tarih) => {
    setSelectedDate(tarih);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate) {
      alert('Lütfen bir tarih seçin');
      return;
    }
    updateFormData('tarih', selectedDate);
    nextStep();
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); 
    return { daysInMonth, startingDayOfWeek };
  };

  const isDatePast = (tarih) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(tarih);
    return checkDate < today;
  };

  const isDateFull = (tarih) => {
    return doluGunler[tarih] === true;
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;

    const days = [];
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    // Boş günler
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="bg-gray-50/30"></div>);
    }

    // Günler
    for (let day = 1; day <= daysInMonth; day++) {
      const tarih = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPast = isDatePast(tarih);
      const isFull = isDateFull(tarih);
      const isSelected = selectedDate === tarih;

      // Responsive Sınıflar
      // h-14 (mobil) -> sm:h-20 (tablet/desktop)
      let containerClass = "relative h-14 sm:h-24 border border-gray-100 flex flex-col items-center justify-center transition-all duration-200 group ";
      
      // text-sm (mobil) -> sm:text-lg (tablet/desktop)
      let textClass = "font-medium text-sm sm:text-lg ";
      let statusIndicator = null;

      if (isPast) {
        containerClass += "bg-gray-100 cursor-not-allowed opacity-60";
        textClass += "text-gray-400";
      } else if (isFull) {
        containerClass += "bg-red-50 cursor-not-allowed";
        textClass += "text-red-300 decoration-red-300 line-through";
        // text-[8px] (mobil) -> sm:text-[10px] (desktop)
        statusIndicator = <span className="text-[8px] sm:text-[10px] text-red-400 font-semibold mt-0.5 sm:mt-1">DOLU</span>;
      } else if (isSelected) {
        containerClass += "bg-[#D12A2C] shadow-lg scale-105 z-10 border-[#D12A2C] rounded-lg transform";
        textClass += "text-white font-bold";
        statusIndicator = <span className="text-[8px] sm:text-[10px] text-red-100 font-medium mt-0.5 sm:mt-1">SEÇİLDİ</span>;
      } else {
        containerClass += "bg-white hover:bg-red-50 hover:border-red-200 cursor-pointer hover:shadow-md hover:z-10";
        textClass += "text-gray-700 group-hover:text-[#D12A2C]";
      }

      days.push(
        <div
          key={day}
          onClick={() => !isPast && !isFull && handleDateSelect(tarih)}
          className={containerClass}
        >
          <span className={textClass}>{day}</span>
          {statusIndicator}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Ay Navigasyonu */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              const newMonth = new Date(currentMonth);
              newMonth.setMonth(newMonth.getMonth() - 1);
              setCurrentMonth(newMonth);
            }}
            className="p-1.5 sm:p-2 text-gray-600 hover:text-[#D12A2C] hover:bg-white hover:shadow-sm rounded-full transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h3 className="text-lg sm:text-xl  font-bold text-gray-900 text-center">
            {monthNames[currentMonth.getMonth()]} <span className="text-[#D12A2C] block sm:inline">{currentMonth.getFullYear()}</span>
          </h3>

          <button
            type="button"
            onClick={() => {
              const newMonth = new Date(currentMonth);
              newMonth.setMonth(newMonth.getMonth() + 1);
              setCurrentMonth(newMonth);
            }}
            className="p-1.5 sm:p-2 text-gray-600 hover:text-[#D12A2C] hover:bg-white hover:shadow-sm rounded-full transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Haftanın Günleri */}
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
          {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map(day => (
            <div key={day} className="py-2 sm:py-3 text-center text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Günler Izgarası */}
        <div className="grid grid-cols-7 bg-gray-100 gap-[1px] border-b border-gray-100">
          {days}
        </div>
        
        {loading && (
          <div className="w-full h-1 bg-gray-100">
            <div className="h-1 bg-red-600 animate-progress"></div>
          </div>
        )}

        {/* Lejant (Responsive Gap ve Font) */}
        <div className="px-4 py-3 sm:px-6 bg-white flex flex-wrap gap-3 sm:gap-6 justify-center text-xs sm:text-sm border-t border-gray-100">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white border border-gray-300"></div>
            <span className="text-gray-600">Müsait</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#D12A2C]"></div>
            <span className="text-gray-900 font-medium">Seçili</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-100"></div>
            <span className="text-gray-400 decoration-slice line-through">Dolu</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gray-200"></div>
            <span className="text-gray-400">Geçmiş</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto font-sans px-4 sm:px-0">
      {/* Başlık */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-red-600 mb-2">Ziyaret Tarihi</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {renderCalendar()}

        {/* Seçim Özeti Kartı */}
        {selectedDate && (
          <div className="bg-red-50 border-l-4 border-[#D12A2C] p-4 rounded-r-lg flex flex-col sm:flex-row sm:items-center justify-between animate-fade-in-up gap-2 sm:gap-0">
            <div>
              <p className="text-xs sm:text-sm font-bold text-red-800 uppercase tracking-wide mb-1">Seçilen Tarih</p>
              <p className="text-xl sm:text-2xl font-serif text-gray-900">
                {new Date(selectedDate).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  weekday: 'long'
                })}
              </p>
            </div>
            <div className="hidden sm:block text-red-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}

        {/* Butonlar */}
        <div className="flex flex-col-reverse md:flex-row justify-between pt-2 gap-3 sm:gap-4 pb-8 sm:pb-0">
          <button
            type="button"
            onClick={prevStep}
            className="w-full md:w-auto px-6 py-3 text-gray-700 bg-white border border-gray-300 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all text-sm sm:text-base"
          >
            ← Geri
          </button>

          <button
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-[#D12A2C] text-white font-bold rounded-lg hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            disabled={!selectedDate}
          >
            Devam Et
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2TarihSecimi;