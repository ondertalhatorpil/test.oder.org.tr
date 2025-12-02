const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

// ==================== PUBLIC ROUTES ====================
// Ziyaretçilerin erişebileceği endpoint'ler

// Onaylanmış galeri öğelerini getir
router.get('/approved', galleryController.getApprovedGallery);

// Yeni galeri öğesi ekle (ziyaretçi)
router.post('/submit', galleryController.createGalleryItem);

// ==================== ADMIN ROUTES ====================
// Admin panelinden erişilecek endpoint'ler
// Not: Bu route'lar için auth middleware eklenebilir

// Tüm galeri öğelerini listele (status filtresiyle)
router.get('/admin/all', galleryController.getAllGalleryItems);

// Galeri istatistikleri
router.get('/admin/stats', galleryController.getGalleryStats);

// Galeri öğesi detayı
router.get('/admin/:id', galleryController.getGalleryItemDetail);

// Galeri öğesini onayla
router.put('/admin/:id/approve', galleryController.approveGalleryItem);

// Galeri öğesini reddet
router.put('/admin/:id/reject', galleryController.rejectGalleryItem);

// Galeri öğesini sil
router.delete('/admin/:id', galleryController.deleteGalleryItem);

module.exports = router;