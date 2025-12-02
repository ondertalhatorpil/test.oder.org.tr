import React, { useState } from 'react';
import { rezervasyonAPI } from '../../services/api';
import * as XLSX from 'xlsx';

const Step6OgrenciBilgileri = ({ formData, updateFormData, prevStep }) => {
  const [ogrenciler, setOgrenciler] = useState(formData.ogrenciler || []);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [excelYuklendi, setExcelYuklendi] = useState(false);

  const toplamKisi = Object.values(formData.mekanlar).reduce((a, b) => a + b, 0);

  const handleExcelYukle = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const excelOgrenciler = jsonData.map(row => ({
          ad_soyad: row['Ad Soyad'] || row['ad_soyad'] || '',
          telefon: row['Telefon'] || row['telefon'] || '',
          sinif: row['Sınıf'] || row['sinif'] || '',
          cinsiyet: (row['Cinsiyet'] || row['cinsiyet'] || 'erkek').toLowerCase()
        }));

        if (excelOgrenciler.length !== toplamKisi) {
          alert(`Excel'de ${excelOgrenciler.length} öğrenci var, ancak ${toplamKisi} öğrenci bilgisi gerekiyor.`);
          return;
        }

        setOgrenciler(excelOgrenciler);
        setExcelYuklendi(true);
      } catch (error) {
        console.error('Excel okuma hatası:', error);
        alert('Excel dosyası okunamadı. Lütfen formatı kontrol edin.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExcelIndir = () => {
    const ornekData = Array(toplamKisi).fill(null).map((_, i) => ({
      'Ad Soyad': `Öğrenci ${i + 1}`,
      'Telefon': '05551234567',
      'Sınıf': '9-A',
      'Cinsiyet': 'erkek'
    }));

    const worksheet = XLSX.utils.json_to_sheet(ornekData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Öğrenciler');
    XLSX.writeFile(workbook, 'ogrenci_listesi_ornek.xlsx');
  };

  const validateForm = () => {
    if (ogrenciler.length !== toplamKisi) {
      alert(`${toplamKisi} öğrenci bilgisi girmeniz gerekiyor.`);
      return false;
    }
    for (let i = 0; i < ogrenciler.length; i++) {
      const ogr = ogrenciler[i];
      if (!ogr.ad_soyad || !ogr.sinif) {
        alert(`${i + 1}. öğrencinin adı soyadı ve sınıfı zorunludur.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitLoading(true);

    try {
      const rezervasyonData = {
        yetkili_ad_soyad: formData.yetkili_ad_soyad,
        kurum_adi: formData.kurum_adi,
        kurum_tipi: formData.kurum_tipi,
        il: formData.il,
        ilce: formData.ilce,
        telefon: formData.telefon,
        tarih: formData.tarih,
        saat_dilimi: formData.saat_dilimi,
        mekanlar: formData.mekanlar,
        aciklama: formData.aciklama || '',
        ogrenciler: ogrenciler
      };

      const response = await rezervasyonAPI.createRezervasyon(rezervasyonData);

      if (response.success) {
        alert(`Rezervasyon No: ${response.data.rezervasyon_id}\nDurum: Beklemede\n\nAdmin onayından sonra size bilgi verilecektir.`);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Rezervasyon oluşturma hatası:', error);
      alert('Hata: ' + (error.message || 'Bilinmeyen hata'));
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Öğrenci Bilgileri</h2>
        <p className="text-sm text-gray-600 mt-1">Toplam {toplamKisi} öğrenci için Excel listesi yükleyin</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Excel Yükleme */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-900">Excel Dosyası</span>
            <button
              type="button"
              onClick={handleExcelIndir}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Şablon İndir
            </button>
          </div>

          <div className="p-4">
            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              excelYuklendi ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}>
              {excelYuklendi ? (
                <div className="text-center">
                  <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm font-medium text-green-700">{ogrenciler.length} öğrenci yüklendi</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setExcelYuklendi(false);
                      setOgrenciler([]);
                    }}
                    className="text-xs text-green-600 hover:underline mt-1"
                  >
                    Yeni dosya yükle
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600">Dosya seçin veya sürükleyin</p>
                  <p className="text-xs text-gray-400 mt-1">.xlsx, .xls</p>
                </div>
              )}
              <input 
                type="file" 
                accept=".xlsx,.xls"
                onChange={handleExcelYukle}
                className="hidden" 
              />
            </label>

            {/* Bilgilendirme */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
              <div className="bg-red-50 rounded p-3">
                <p className="font-semibold text-gray-900 mb-1">Zorunlu Alanlar</p>
                <p className="text-gray-600">Ad Soyad, Sınıf, Cinsiyet</p>
              </div>
              <div className="bg-orange-50 rounded p-3">
                <p className="font-semibold text-gray-900 mb-1">Önemli</p>
                <p className="text-gray-600">Sütun başlıklarını değiştirmeyin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Önizleme Tablosu */}
        {excelYuklendi && ogrenciler.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-900 text-white px-4 py-2 text-sm flex justify-between items-center">
              <span>Önizleme</span>
              <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                {ogrenciler.filter(o => o.ad_soyad && o.sinif).length} / {toplamKisi}
              </span>
            </div>
            
            <div className="overflow-x-auto max-h-64">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs">
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left font-semibold">#</th>
                    <th className="px-4 py-2 text-left font-semibold">Ad Soyad</th>
                    <th className="px-4 py-2 text-left font-semibold">Sınıf</th>
                    <th className="px-4 py-2 text-left font-semibold">Cinsiyet</th>
                    <th className="px-4 py-2 text-center font-semibold">Durum</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {ogrenciler.map((ogr, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2 font-medium">{ogr.ad_soyad || '-'}</td>
                      <td className="px-4 py-2">{ogr.sinif || '-'}</td>
                      <td className="px-4 py-2 capitalize">{ogr.cinsiyet}</td>
                      <td className="px-4 py-2 text-center">
                        {(!ogr.ad_soyad || !ogr.sinif) ? (
                          <span className="inline-block px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">Eksik</span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">✓</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Butonlar */}
        <div className="flex justify-between items-center pt-4 border-t">
          <button
            type="button"
            onClick={prevStep}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            disabled={submitLoading}
          >
            ← Geri
          </button>

          <button
            type="submit"
            disabled={submitLoading || !excelYuklendi}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
          >
            {submitLoading ? 'İşleniyor...' : 'Rezervasyonu Tamamla'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step6OgrenciBilgileri;