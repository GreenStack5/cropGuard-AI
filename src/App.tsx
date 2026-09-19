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
import { DashboardLayout as PrototypeDashboard } from './components/dashboard/DashboardLayout'
import { RouterProvider } from './lib/router'

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

          {/* Dashboard routes — rich interactive SPA ecosystem */}
          <Route
            path="dashboard"
            element={
              <RequireAuth>
                <AuthPromptProvider>
                  <ScrollToTop />
                  <RouterProvider>
                    <PrototypeDashboard />
                  </RouterProvider>
                </AuthPromptProvider>
              </RequireAuth>
            }
          />
          <Route
            path="supplier-dashboard"
            element={
              <RequireAuth>
                <AuthPromptProvider>
                  <ScrollToTop />
                  <RouterProvider>
                    <PrototypeDashboard />
                  </RouterProvider>
                </AuthPromptProvider>
              </RequireAuth>
            }
          />

          {/* Auth pages */}
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App