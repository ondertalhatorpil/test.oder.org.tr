import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

// Ana Sayfalar
import HomePages from './pages/HomePage/index'
import About from './pages/About/index'
import Galeri from './pages/UserGalleryPage/index.jsx'
import Rezervasyon from './pages/RezervasyonPage/index.jsx'
import BilgiYarismasi from "./pages/BilgiYarismasi/index.jsx";
import Footer from './components/HomeFooter/index.jsx';
import Header from './components/Header/HeaderController.jsx'; 
import UserGalleryPage from './pages/UserGalleryPage/index.jsx';

// Admin Sayfaları
import AdminLogin from './pages/Admin/Login';
import AdminLayout from './pages/Admin/Layout';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminRezervasyonlar from './pages/Admin/Rezervasyonlar';
import AdminGalleryPage from './pages/Admin/Usergallerypage.jsx';


// Protected Route Component
const ProtectedAdminRoute = ({ children }) => {
    const adminData = localStorage.getItem('adminData');
    
    if (!adminData) {
        window.location.href = '/admin/login';
        return null;
    }
    
    return children;
};

const Layout = ({ children }) => {
    const location = useLocation();
    
    // Admin panelinde header ve footer gizlenecek
    const hideHeaderFooter = location.pathname.startsWith('/admin');
    
    // Sadece footer gizlenecek sayfalar (header gösterilecek)
    const hideOnlyFooter = location.pathname === '/bilgi-yarismasi' || 
                          location.pathname === '/rezervasyon';

    return (
        <>
            {/* Header - Admin panelinde gizli */}
            {!hideHeaderFooter && <Header />}
            
            {/* Sayfa içeriği */}
            {children}
            
            {!hideHeaderFooter && !hideOnlyFooter && <Footer />}
        </>
    );
};

const Router = () => {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    {/* Ana Sayfa Rotaları */}
                    <Route path="/" element={<HomePages />} />
                    <Route path="/hakkimizda" element={<About />} />
                    <Route path="/galeri" element={<UserGalleryPage />} />
                    <Route path="/rezervasyon" element={<Rezervasyon />} />
                    <Route path="/bilgi-yarismasi" element={<BilgiYarismasi />} />
                    
                    <Route path="/admin/login" element={<AdminLogin />} />
                    
                    <Route 
                        path="/admin" 
                        element={
                            <ProtectedAdminRoute>
                                <AdminLayout />
                            </ProtectedAdminRoute>
                        }
                    >
                        <Route index element={<AdminDashboard />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="rezervasyonlar" element={<AdminRezervasyonlar />} />
                        <Route path="/admin/galeri" element={<AdminGalleryPage />} />

                    </Route>
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default Router