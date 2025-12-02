-- Galeri Tablosu
CREATE TABLE IF NOT EXISTS gallery (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image_url VARCHAR(500) NOT NULL,
    image_path VARCHAR(500),
    message TEXT NOT NULL,
    visitor_name VARCHAR(100),
    visitor_phone VARCHAR(20),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    admin_id INT,
    admin_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (admin_id) REFERENCES admin_kullanicilar(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Galeri için örnek veriler (isteğe bağlı)
INSERT INTO gallery (image_url, message, status, approved_at) VALUES
('https://pbs.twimg.com/media/Gd4zOf6WgAsWgMs?format=jpg&name=small', 'Sebilin muhteşem detayları beni çok etkiledi. Osmanlı mimarisinin inceliği burada çok net görülüyor.', 'approved', NOW()),
('https://pbs.twimg.com/media/GdiyWK_XYAA_y49?format=jpg&name=small', 'Cami içi görülmeye değer! Huzur dolu bir atmosfer.', 'approved', NOW()),
('https://pbs.twimg.com/media/GdepXjiXEAATeY8?format=jpg&name=small', 'Medrese avlusunda tarihi hissettim. 280 yıllık bu yapı hala ayakta duruyor.', 'approved', NOW()),
('https://pbs.twimg.com/media/GdI3sl-W8AAKNYy?format=jpg&name=small', 'Barok süslemeler harika, kesinlikle detaylı incelenmeli.', 'approved', NOW());