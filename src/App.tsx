import { useEffect } from 'react'
import { BrowserRouter, Link, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AuthPromptProvider, AuthProvider, RequireAuth } from './auth/providers'
import Navbar from './components/landing/Navbar'
import Footer from './components/landing/Footer'
import HomePage from './pages/HomePage'
import ScanPage from './pages/ScanPage'
import LibraryPage from './pages/LibraryPage'
import DiseaseDetailPage from './pages/DiseaseDetailPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import DashboardPage from './pages/DashboardPage'
import SupplierDashboardPage from './pages/SupplierDashboardPage'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [pathname])

  return null
}

function MainLayout() {
  return (
    <AuthPromptProvider>
      <ScrollToTop />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </AuthPromptProvider>
  )
}

/** Dashboard pages manage their own sidebar layout — no shared Navbar/Footer */
function DashboardLayout() {
  return (
    <AuthPromptProvider>
      <ScrollToTop />
      <Outlet />
    </AuthPromptProvider>
  )
}

function NotFound() {
  return (
    <div className="gate">
      <div className="gate__card">
        <h1 className="gate__title">Page not found</h1>
        <p className="gate__text">The page you are looking for does not exist.</p>
        <div className="gate__actions">
          <Link className="auth-btn auth-btn--primary" to="/">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public / shared-nav routes */}
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route
              path="scan"
              element={
                <RequireAuth>
                  <ScanPage />
                </RequireAuth>
              }
            />
            <Route path="library" element={<LibraryPage />} />
            <Route
              path="library/:diseaseId"
              element={
                <RequireAuth>
                  <DiseaseDetailPage />
                </RequireAuth>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Dashboard routes — own sidebar, no landing nav */}
          <Route element={<DashboardLayout />}>
            <Route
              path="dashboard"
              element={
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              }
            />
            <Route
              path="supplier-dashboard"
              element={
                <RequireAuth>
                  <SupplierDashboardPage />
                </RequireAuth>
              }
            />
          </Route>

          {/* Auth pages */}
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App