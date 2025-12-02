const { promisePool } = require('../config/database');

// Tüm onaylanmış galeri öğelerini getir (Public - Ziyaretçiler için)
const getApprovedGallery = async (req, res) => {
    try {
        const [rows] = await promisePool.query(
            `SELECT id, image_url, message, visitor_name, created_at, approved_at 
             FROM gallery 
             WHERE status = 'approved' 
             ORDER BY approved_at DESC`
        );
        
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Galeri getirme hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Galeri öğeleri getirilemedi'
        });
    }
};

// Yeni galeri öğesi ekle (Public - Ziyaretçiler için)
const createGalleryItem = async (req, res) => {
    try {
        const { image_url, message, visitor_name, visitor_phone } = req.body;

        // Validasyon
        if (!image_url || !message) {
            return res.status(400).json({
                success: false,
                error: 'Görsel ve mesaj alanları zorunludur'
            });
        }

        // Telefon numarası varsa format kontrolü
        if (visitor_phone) {
            const phoneRegex = /^[0-9]{10,11}$/;
            const cleanPhone = visitor_phone.replace(/\s/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                return res.status(400).json({
                    success: false,
                    error: 'Geçerli bir telefon numarası giriniz (10-11 rakam)'
                });
            }
        }

        const [result] = await promisePool.query(
            `INSERT INTO gallery (image_url, message, visitor_name, visitor_phone, status) 
             VALUES (?, ?, ?, ?, 'pending')`,
            [image_url, message, visitor_name || null, visitor_phone || null]
        );

        res.status(201).json({
            success: true,
            message: 'Fotoğrafınız inceleme için gönderildi. Onaylandıktan sonra galeriye eklenecektir.',
            data: {
                id: result.insertId
            }
        });
    } catch (error) {
        console.error('Galeri öğesi ekleme hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Galeri öğesi eklenemedi'
        });
    }
};

// ==================== ADMIN FONKSİYONLARI ====================

// Tüm galeri öğelerini getir (Admin)
const getAllGalleryItems = async (req, res) => {
    try {
        const { status } = req.query;

        let query = `
            SELECT g.*, a.ad_soyad as admin_name
            FROM gallery g
            LEFT JOIN admin_kullanicilar a ON g.admin_id = a.id
        `;

        const params = [];
        
        if (status) {
            query += ' WHERE g.status = ?';
            params.push(status);
        }

        query += ' ORDER BY g.created_at DESC';

        const [rows] = await promisePool.query(query, params);

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Admin galeri listeleme hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Galeri öğeleri getirilemedi'
        });
    }
};

// Galeri öğesi detayı (Admin)
const getGalleryItemDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await promisePool.query(
            `SELECT g.*, a.ad_soyad as admin_name
             FROM gallery g
             LEFT JOIN admin_kullanicilar a ON g.admin_id = a.id
             WHERE g.id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Galeri öğesi bulunamadı'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Galeri detay hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Galeri öğesi detayı getirilemedi'
        });
    }
};

// Galeri öğesini onayla (Admin)
const approveGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { admin_id } = req.body;

        if (!admin_id) {
            return res.status(400).json({
                success: false,
                error: 'Admin ID gereklidir'
            });
        }

        // Önce öğenin varlığını ve durumunu kontrol et
        const [checkRows] = await promisePool.query(
            'SELECT status FROM gallery WHERE id = ?',
            [id]
        );

        if (checkRows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Galeri öğesi bulunamadı'
            });
        }

        if (checkRows[0].status === 'approved') {
            return res.status(400).json({
                success: false,
                error: 'Bu öğe zaten onaylanmış'
            });
        }

        // Onayla
        await promisePool.query(
            `UPDATE gallery 
             SET status = 'approved', admin_id = ?, approved_at = NOW(), updated_at = NOW()
             WHERE id = ?`,
            [admin_id, id]
        );

        res.json({
            success: true,
            message: 'Galeri öğesi onaylandı'
        });
    } catch (error) {
        console.error('Galeri onaylama hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Galeri öğesi onaylanamadı'
        });
    }
};

// Galeri öğesini reddet (Admin)
const rejectGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { admin_id, admin_note } = req.body;

        if (!admin_id) {
            return res.status(400).json({
                success: false,
                error: 'Admin ID gereklidir'
            });
        }

        // Önce öğenin varlığını kontrol et
        const [checkRows] = await promisePool.query(
            'SELECT id FROM gallery WHERE id = ?',
            [id]
        );

        if (checkRows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Galeri öğesi bulunamadı'
            });
        }

        // Reddet
        await promisePool.query(
            `UPDATE gallery 
             SET status = 'rejected', admin_id = ?, admin_note = ?, updated_at = NOW()
             WHERE id = ?`,
            [admin_id, admin_note || null, id]
        );

        res.json({
            success: true,
            message: 'Galeri öğesi reddedildi'
        });
    } catch (error) {
        console.error('Galeri reddetme hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Galeri öğesi reddedilemedi'
        });
    }
};

// Galeri öğesini sil (Admin)
const deleteGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await promisePool.query(
            'DELETE FROM gallery WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Galeri öğesi bulunamadı'
            });
        }

        res.json({
            success: true,
            message: 'Galeri öğesi silindi'
        });
    } catch (error) {
        console.error('Galeri silme hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Galeri öğesi silinemedi'
        });
    }
};

// Galeri istatistikleri (Admin Dashboard için)
const getGalleryStats = async (req, res) => {
    try {
        const [stats] = await promisePool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
                SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
            FROM gallery
        `);

        res.json({
            success: true,
            data: stats[0]
        });
    } catch (error) {
        console.error('Galeri istatistik hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Galeri istatistikleri getirilemedi'
        });
    }
};

module.exports = {
    // Public endpoints
    getApprovedGallery,
    createGalleryItem,
    
    // Admin endpoints
    getAllGalleryItems,
    getGalleryItemDetail,
    approveGalleryItem,
    rejectGalleryItem,
    deleteGalleryItem,
    getGalleryStats
};