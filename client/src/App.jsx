import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { Toaster } from 'sonner'
import { Suspense, lazy } from 'react'
import Productsroutes from './productsroutes'
import AuthVerify from './AuthVerify'

// ✅ Lazy-loaded components
const Userlayout = lazy(() => import('./components/shopingview/Userlayout'))
const AdminLayout = lazy(() => import('./components/admin-view/Layout'))

// Shop pages
const Home = lazy(() => import('./pages/shoping-view/Home'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const StoreAndContact = lazy(() => import('./pages/servicefilespage/Contact'))
const FAQ = lazy(() => import('./pages/servicefilespage/Faq'))
const PrivacyPolicy = lazy(() => import('./pages/servicefilespage/PrivacyPolicy'))
const TermsAndConditions = lazy(() => import('./pages/servicefilespage/TermsAndConditions'))
const AccountPage = lazy(() => import('./pages/auth/AccountPage'))
const ProductPage = lazy(() => import('./pages/shoping-view/Dress'))
const Bestseller = lazy(() => import('./pages/shoping-view/Bestseller'))
const View = lazy(() => import('./pages/shoping-view/VIew'))
const Checkout = lazy(() => import('./pages/shoping-view/Checkout'))
const OrderSuccess = lazy(() => import('./pages/shoping-view/OrderSuccess'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))
const Newin = lazy(() => import('./pages/shoping-view/Newin'))
const Aboutus = lazy(() => import('./pages/servicefilespage/Aboutus'))

// Admin pages
const AdminHomepage = lazy(() => import('./pages/admin-view/AdminHomepage'))
const ProductMangement = lazy(() => import('./pages/admin-view/ProductMangement'))
const Editproductpage = lazy(() => import('./components/admin-view/Editproductpage'))
const Addproduct = lazy(() => import('./components/admin-view/Addproduct'))
const Newsletter = lazy(() => import('./pages/admin-view/Newsletter'))
const OrderManagement = lazy(() => import('./pages/admin-view/Ordermangemant'))

function App() {
  return (
    <>
      <AuthVerify />
      <Toaster position="top-right" richColors duration={3000} closeButton />

      {/* Fallback loader */}
      <Suspense fallback={<div className="text-center p-10"></div>}>
        <Routes>
          {/* ---------- User routes ---------- */}
          <Route path='/' element={<Userlayout />}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='aboutus' element={<Aboutus />} />
            <Route path='StoreAndContact' element={<StoreAndContact />} />
            <Route path='Faq' element={<FAQ />} />
            <Route path='PrivacyPolicy' element={<PrivacyPolicy />} />
            <Route path='TermsAndConditions' element={<TermsAndConditions />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="Product" element={<ProductPage />} />
            <Route path="newin" element={<Newin />} />
            <Route path="bestseller" element={<Bestseller />} />
            <Route path="product/:productId" element={<View />} />
            <Route path="shop/checkout" element={<Checkout />} />
            <Route path="order-success" element={<OrderSuccess />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/* ---------- Success route ---------- */}
          <Route path='success' element={<OrderSuccess />} />

          {/* ---------- Admin routes ---------- */}
          <Route
            path='/admin'
            element={
              <Productsroutes role="admin">
                <AdminLayout />
              </Productsroutes>
            }
          >
            <Route index element={<AdminHomepage />} />
            <Route path='Products' element={<ProductMangement />} />
            <Route path='Products/:id/edit' element={<Editproductpage />} />
            <Route path='Products/addproduct' element={<Addproduct />} />
            <Route path='order' element={<OrderManagement />} />
            <Route path='Newsletter' element={<Newsletter />} />
          </Route>

          {/* ---------- Fallback ---------- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
