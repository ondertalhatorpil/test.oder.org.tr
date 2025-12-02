const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware'ler
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Base64 image için limit artırıldı
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Test route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Beşirağa Medresesi Rezervasyon API',
        version: '1.0.0',
        status: 'active'
    });
});

// Health check endpoint
app.get('/health', async (req, res) => {
    const dbConnected = await testConnection();
    res.json({
        status: 'OK',
        database: dbConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/rezervasyon', require('./routes/rezervasyon'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/gallery', require('./routes/gallery')); // YENİ: Galeri route'u

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint bulunamadı' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Sunucu hatası', 
        message: process.env.NODE_ENV === 'development' ? err.message : 'Bir hata oluştu'
    });
});

// Sunucuyu başlat
app.listen(PORT, async () => {
    console.log(`🚀 Server ${PORT} portunda çalışıyor`);
    console.log(`📍 http://localhost:${PORT}`);
    
    // Veritabanı bağlantısını test et
    await testConnection();
});

module.exports = app;