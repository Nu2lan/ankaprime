import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect, createContext, useContext } from 'react'
import api from './api'
import AdminLogin from './pages/AdminLogin'
import SetupPage from './pages/SetupPage'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ProductsPage from './pages/Products'
import ProductForm from './pages/ProductForm'
import Categories from './pages/Categories'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Users from './pages/Users'
import Coupons from './pages/Coupons'

export const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export default function App() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [needsSetup, setNeedsSetup] = useState(false)

    useEffect(() => {
        // Check if setup is needed first
        api.get('/auth/setup-status')
            .then(r => {
                if (r.data.needsSetup) {
                    setNeedsSetup(true)
                    setLoading(false)
                } else {
                    // Setup done, check if user is logged in
                    const token = localStorage.getItem('adminToken')
                    if (token) {
                        api.get('/auth/me')
                            .then(r => { if (r.data.user.role === 'admin') setUser(r.data.user); else localStorage.removeItem('adminToken') })
                            .catch(() => localStorage.removeItem('adminToken'))
                            .finally(() => setLoading(false))
                    } else { setLoading(false) }
                }
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading) return <div className="flex items-center justify-center h-screen"><div className="w-8 h-8 border-2 border-luxe-gold border-t-transparent rounded-full animate-spin" /></div>

    // Show setup page if no admin exists
    if (needsSetup) {
        return (
            <Routes>
                <Route path="*" element={<SetupPage onSetupComplete={() => setNeedsSetup(false)} />} />
            </Routes>
        )
    }

    return (
        <AuthCtx.Provider value={{ user, setUser }}>
            <Routes>
                <Route path="/login" element={user ? <Navigate to="/" /> : <AdminLogin />} />
                <Route path="/*" element={user ? <Layout /> : <Navigate to="/login" />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="products/new" element={<ProductForm />} />
                    <Route path="products/edit/:id" element={<ProductForm />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="orders/:id" element={<OrderDetail />} />
                    <Route path="users" element={<Users />} />
                    <Route path="coupons" element={<Coupons />} />
                </Route>
            </Routes>
        </AuthCtx.Provider>
    )
}
