import React, { useState } from 'react';
import Step1KurumBilgileri from '../../components/Rezervasyon/Step1KurumBilgileri';
import Step2TarihSecimi from '../../components/Rezervasyon/Step2TarihSecimi';
import Step3SaatSecimi from '../../components/Rezervasyon/Step3SaatSecimi';
import Step4MekanSecimi from '../../components/Rezervasyon/Step4MekanSecimi';
import Step5Aciklama from '../../components/Rezervasyon/Step5Aciklama';
import Step6OgrenciBilgileri from '../../components/Rezervasyon/Step6OgrenciBilgileri';

const RezervasyonPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Adım 1: Kurum Bilgileri (kurum_tipi KALDIRILDI)
    yetkili_ad_soyad: '',
    kurum_adi: '',
    il: '',
    ilce: '',
    telefon: '',
    
    // Adım 2: Tarih
    tarih: '',
    
    // Adım 3: Saat
    saat_dilimi: '',
    
    // Adım 4: Mekanlar
    mekanlar: {},
    
    // Adım 5: Açıklama
    aciklama: '',
    
    // Adım 6: Öğrenciler
    ogrenciler: []
  });

  const totalSteps = 6;

  const steps = [
    { id: 1, title: 'Başlangıç', subtitle: 'Kurum bilgilerinizi girin' },
    { id: 2, title: 'Tarih seçimi', subtitle: 'Ziyaret tarihini belirleyin' },
    { id: 3, title: 'Saat seçimi', subtitle: 'Ziyaret saatini belirleyin' },
    { id: 4, title: 'Mekan seçimi', subtitle: 'Ziyaret edilecek mekanları seçin' },
    { id: 5, title: 'Açıklama', subtitle: 'Ek bilgiler ekleyin' },
    { id: 6, title: 'Rezervasyonu tamamla', subtitle: 'Öğrenci bilgilerini girin' }
  ];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1KurumBilgileri
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <Step2TarihSecimi
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <Step3SaatSecimi
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <Step4MekanSecimi
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 5:
        return (
          <Step5Aciklama
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 6:
        return (
          <Step6OgrenciBilgileri
            formData={formData}
            updateFormData={updateFormData}
            prevStep={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen to-orange-50 mt-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="overflow-hidden min-h-[600px]">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left Sidebar */}
            <div className="lg:w-80 border-r border-gray-200 p-3 sm:p-6 lg:p-8">
              <div className="mb-6 sm:mb-8">
                <p className="text-xs sm:text-sm text-gray-600">
                  Formu doldurmak sadece <br /> birkaç dakika sürer
                </p>
              </div>

              {/* Step List */}
              <div className="space-y-1">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`relative pl-4 sm:pl-6 py-3 sm:py-4 cursor-pointer transition-all duration-200 rounded-lg ${
                      step.id === currentStep
                        ? 'bg-red-50 border-l-4 border-red-500'
                        : step.id < currentStep
                        ? 'bg-green-50 border-l-4 border-green-500'
                        : 'border-l-4 border-transparent hover:bg-gray-50'
                    }`}
                    onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                  >
                    <div className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2">
                      {step.id < currentStep ? (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div
                          className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            step.id === currentStep
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {step.id}
                        </div>
                      )}
                    </div>

                    <div className="ml-4 sm:ml-6">
                      <p
                        className={`font-semibold text-xs sm:text-sm ${
                          step.id === currentStep
                            ? 'text-red-600'
                            : step.id < currentStep
                            ? 'text-green-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{step.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Info */}
              <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">İlerleme</span>
                  <span className="text-xs sm:text-sm font-bold text-red-600">
                    {Math.round((currentStep / totalSteps) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-red-500 to-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] sm:text-xs text-gray-600 mt-2">
                  Adım {currentStep} / {totalSteps}
                </p>
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 p-3 sm:p-6 lg:p-12">
              <div className="max-w-4xl">
                <div className="form-content">
                  {renderStep()}
                </div>

                <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        Verilerinizi sorumlu bir şekilde işlemeye ve gizliliğinizi korumaya kararlıyız. 
                        Tüm bilgilerinizi güvenli bir şekilde saklıyor ve şifreliyoruz.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RezervasyonPage;