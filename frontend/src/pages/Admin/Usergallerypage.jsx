import React, { useState, useEffect } from 'react';
import { Eye, Check, X, Trash2, Image as ImageIcon, Clock, CheckCircle, XCircle } from 'lucide-react';
import { galleryAPI } from '../../services/api';

const AdminGalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [actionLoading, setActionLoading] = useState(false);
  
  // Confirmation modal için state'ler
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectItemId, setRejectItemId] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);

  const adminId = JSON.parse(localStorage.getItem('adminUser'))?.id || 1;

  // Galeri öğelerini yükle
  const loadGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await galleryAPI.getAllGalleryItems();
      if (response.success) {
        setGalleryItems(response.data);
        filterItems(response.data, filter);
      }
    } catch (error) {
      console.error('Galeri yükleme hatası:', error);
      alert('Galeri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // İstatistikleri yükle
  const loadStats = async () => {
    try {
      const response = await galleryAPI.getGalleryStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('İstatistik yükleme hatası:', error);
    }
  };

  useEffect(() => {
    loadGalleryItems();
    loadStats();
  }, []);

  // Filtrele
  const filterItems = (items, status) => {
    if (status === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.status === status));
    }
  };

  useEffect(() => {
    filterItems(galleryItems, filter);
  }, [filter, galleryItems]);

  // Detay modal aç
  const handleViewDetail = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  // Onayla
  const handleApprove = async (id) => {
    setConfirmMessage('Bu galeri öğesini onaylamak istediğinize emin misiniz?');
    setConfirmAction(() => async () => {
      setActionLoading(true);
      try {
        await galleryAPI.approveGalleryItem(id, adminId);
        setAlertMessage('Galeri öğesi onaylandı');
        setShowAlertModal(true);
        loadGalleryItems();
        loadStats();
        setShowDetailModal(false);
      } catch (error) {
        setAlertMessage('Onaylama hatası: ' + error.message);
        setShowAlertModal(true);
      } finally {
        setActionLoading(false);
      }
    });
    setShowConfirmModal(true);
  };

  // Reddet
  const handleReject = (id) => {
    setRejectItemId(id);
    setRejectReason('');
    setShowRejectModal(true);
  };

  // Reddetme işlemini onayla
  const confirmReject = async () => {
    setActionLoading(true);
    try {
      await galleryAPI.rejectGalleryItem(rejectItemId, adminId, rejectReason || null);
      setAlertMessage('Galeri öğesi reddedildi');
      setShowAlertModal(true);
      loadGalleryItems();
      loadStats();
      setShowDetailModal(false);
      setShowRejectModal(false);
      setRejectReason('');
    } catch (error) {
      setAlertMessage('Reddetme hatası: ' + error.message);
      setShowAlertModal(true);
    } finally {
      setActionLoading(false);
    }
  };

  // Sil
  const handleDelete = async (id) => {
    setConfirmMessage('Bu galeri öğesini kalıcı olarak silmek istediğinize emin misiniz?');
    setConfirmAction(() => async () => {
      setActionLoading(true);
      try {
        await galleryAPI.deleteGalleryItem(id);
        setAlertMessage('Galeri öğesi silindi');
        setShowAlertModal(true);
        loadGalleryItems();
        loadStats();
        setShowDetailModal(false);
      } catch (error) {
        setAlertMessage('Silme hatası: ' + error.message);
        setShowAlertModal(true);
      } finally {
        setActionLoading(false);
      }
    });
    setShowConfirmModal(true);
  };

  // Galeri istatistikleri (Admin Dashboard için)  // Status badge
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      approved: 'bg-green-500/20 text-green-400 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    };

    const labels = {
      pending: 'Beklemede',
      approved: 'Onaylandı',
      rejected: 'Reddedildi',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

 return (
    <div className="min-h-screen p-6 bg-slate-50"> {/* Arka plan rengi değiştirildi */}
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Galeri Yönetimi</h1>
          <p className="text-gray-600">Ziyaretçilerin paylaştığı fotoğrafları yönetin</p>
        </div>

        {/* İstatistikler (Mevcut tasarım korundu) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Toplam */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Toplam</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <ImageIcon className="text-gray-400" size={32} />
            </div>
          </div>
          
          {/* Beklemede */}
          <div className="bg-white border border-yellow-200 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm mb-1">Beklemede</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <Clock className="text-yellow-500" size={32} />
            </div>
          </div>

          {/* Onaylı */}
          <div className="bg-white border border-green-200 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm mb-1">Onaylı</p>
                <p className="text-3xl font-bold text-gray-900">{stats.approved}</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>

          {/* Reddedildi */}
          <div className="bg-white border border-red-200 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm mb-1">Reddedildi</p>
                <p className="text-3xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
              <XCircle className="text-red-500" size={32} />
            </div>
          </div>
        </div>

        {/* Filtreler (Mevcut tasarım korundu, renklere uyum sağlandı) */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-md p-4 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { value: 'all', label: 'Tümü', count: stats.total },
              { value: 'pending', label: 'Beklemede', count: stats.pending },
              { value: 'approved', label: 'Onaylı', count: stats.approved },
              { value: 'rejected', label: 'Reddedildi', count: stats.rejected },
            ].map(({ value, label, count }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap text-sm ${
                  filter === value
                    ? 'bg-emerald-600 text-white shadow-md' // Renk 'amber' yerine 'emerald' olarak ayarlandı
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Galeri Listesi */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <ImageIcon className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">Bu kategoride galeri öğesi bulunmuyor</p>
          </div>
        ) : (
          <>
            {/* Desktop Table (Masaüstü Tablo) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Görsel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Mesaj & Ziyaretçi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Oluşturulma Tarihi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Aksiyonlar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                        #{item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-20 h-12 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={item.image_url}
                            alt="Galeri"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">
                            "{item.message}"
                          </p>
                          {item.visitor_name && (
                            <p className="text-xs text-gray-600 mt-1">
                              Ziyaretçi: {item.visitor_name}
                            </p>
                          )}
                           {item.visitor_phone && (
                            <p className="text-xs text-gray-500">
                              Tel: {item.visitor_phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(item.created_at).toLocaleDateString('tr-TR')}
                        <p className="text-xs text-gray-600">
                          {new Date(item.created_at).toLocaleTimeString('tr-TR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetail(item)}
                            className="text-emerald-600 hover:text-emerald-700 font-medium"
                          >
                            <Eye size={18} />
                          </button>
                           {item.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(item.id)}
                                className="text-green-600 hover:text-green-700 font-medium"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() => handleReject(item.id)}
                                className="text-red-600 hover:text-red-700 font-medium"
                              >
                                <X size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards (Mobil Kartlar) */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Galeri Öğesi #{item.id}
                      </p>
                      <p className="text-xs text-gray-600">
                          {new Date(item.created_at).toLocaleString('tr-TR')}
                      </p>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>

                  {/* Görsel ve Mesaj */}
                  <div className="flex gap-3 mb-3">
                    <div className="w-16 h-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={item.image_url}
                            alt="Galeri"
                            className="w-full h-full object-cover"
                          />
                    </div>
                    <div>
                        <p className="text-sm text-gray-900 line-clamp-2">
                          "{item.message}"
                        </p>
                        {item.visitor_name && (
                          <p className="text-xs text-gray-500 mt-1">
                            Ziyaretçi: {item.visitor_name}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Aksiyonlar */}
                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleViewDetail(item)}
                        className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        <Eye size={16} /> Detay
                      </button>
                      {item.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
                          >
                            <Check size={16} /> Onayla
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            <X size={16} /> Reddet
                          </button>
                        </>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        </div>
        
        {/* Detay Modal, Confirmation Modal, Reject Modal, Alert Modal (Aynı Kod Yapısı Korunmuştur) */}
        {/* ... (Modal kodları buraya taşınmıştır, stil güncellemeleri gerekebilir) */}
        
        {/* Detay Modal */}
        {showDetailModal && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"> {/* Arka plan ve blur güncellendi */}
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-gray-900">Galeri Detayı</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Görsel */}
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={selectedItem.image_url}
                    alt="Galeri"
                    className="w-full h-auto"
                  />
                </div>

                {/* Bilgiler */}
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-600 text-sm block mb-2 font-medium">Durum</label>
                    {getStatusBadge(selectedItem.status)}
                  </div>

                  <div>
                    <label className="text-gray-600 text-sm block mb-2 font-medium">Mesaj</label>
                    <p className="text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      "{selectedItem.message}"
                    </p>
                  </div>

                  {selectedItem.visitor_name && (
                    <div>
                      <label className="text-gray-600 text-sm block mb-2 font-medium">Ziyaretçi Adı</label>
                      <p className="text-gray-900">{selectedItem.visitor_name}</p>
                    </div>
                  )}

                  {selectedItem.visitor_phone && (
                    <div>
                      <label className="text-gray-600 text-sm block mb-2 font-medium">Telefon</label>
                      <p className="text-gray-900">{selectedItem.visitor_phone}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-600 text-sm block mb-2 font-medium">Oluşturulma</label>
                      <p className="text-gray-900 text-sm">
                        {new Date(selectedItem.created_at).toLocaleString('tr-TR')}
                      </p>
                    </div>
                    {selectedItem.approved_at && (
                      <div>
                        <label className="text-gray-600 text-sm block mb-2 font-medium">Onaylanma</label>
                        <p className="text-gray-900 text-sm">
                          {new Date(selectedItem.approved_at).toLocaleString('tr-TR')}
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedItem.admin_name && (
                    <div>
                      <label className="text-gray-600 text-sm block mb-2 font-medium">İşlem Yapan Admin</label>
                      <p className="text-gray-900">{selectedItem.admin_name}</p>
                    </div>
                  )}

                  {selectedItem.admin_note && (
                    <div>
                      <label className="text-gray-600 text-sm block mb-2 font-medium">Admin Notu</label>
                      <p className="text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        {selectedItem.admin_note}
                      </p>
                    </div>
                  )}
                </div>

                {/* Aksiyonlar */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  {selectedItem.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(selectedItem.id)}
                        disabled={actionLoading}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium shadow-sm"
                      >
                        <Check size={20} />
                        Onayla
                      </button>
                      <button
                        onClick={() => handleReject(selectedItem.id)}
                        disabled={actionLoading}
                        className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium shadow-sm"
                      >
                        <X size={20} />
                        Reddet
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(selectedItem.id)}
                    disabled={actionLoading}
                    className="px-6 py-3 bg-gray-100 text-red-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium shadow-sm"
                  >
                    <Trash2 size={20} />
                    Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white border border-gray-200 rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Onay</h3>
              <p className="text-gray-600 mb-6">{confirmMessage}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  İptal
                </button>
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    if (confirmAction) confirmAction();
                  }}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Onayla
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white border border-gray-200 rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Galeri Öğesini Reddet</h3>
              <p className="text-gray-600 mb-4">Red nedeni (opsiyonel):</p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Neden reddedildiğini açıklayın..."
                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-red-500 resize-none h-24 placeholder:text-gray-400 mb-6 shadow-sm"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  İptal
                </button>
                <button
                  onClick={confirmReject}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {actionLoading ? 'İşleniyor...' : 'Reddet'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alert Modal */}
        {showAlertModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white border border-gray-200 rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Bilgi</h3>
              <p className="text-gray-600 mb-6">{alertMessage}</p>
              <button
                onClick={() => setShowAlertModal(false)}
                className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Tamam
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGalleryPage;