import { useState } from 'react'
import type { Diagnosis, FarmerLocation, Role, ScanRecord, Supplier, View } from './lib/types'
import {
  addScan,
  getFarmerProfile,
  getScans,
  getCurrentSupplierId,
  getStoredLocation,
  getSuppliers,
  saveStoredLocation,
  saveSuppliers,
  setCurrentSupplierId,
} from './lib/storage'
import { Shell } from './components/Shell'
import { FarmerLayout } from './components/FarmerLayout'
import { Landing } from './views/Landing'
import { RoleSelect } from './views/RoleSelect'
import { AuthView } from './views/AuthView'
import { HowItWorks } from './views/HowItWorks'
import { Features } from './views/Features'
import { FarmerDashboard } from './views/FarmerDashboard'
import { FarmerLocation as FarmerLocationView } from './views/FarmerLocation'
import { Scanner } from './views/Scanner'
import { DiagnosisView } from './views/DiagnosisView'
import { SupplierFinder } from './views/SupplierFinder'
import { ScanHistory } from './views/ScanHistory'
import { SupplierPortal } from './views/SupplierPortal'
import { SupplierRegistration } from './views/SupplierRegistration'

export default function App() {
  const [role, setRole] = useState<Role>(null)
  const [authRole, setAuthRole] = useState<Exclude<Role, null> | null>(null)
  const [view, setView] = useState<View>('landing')
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null)
  const [location, setLocation] = useState<FarmerLocation>(getStoredLocation())
  const [scans, setScans] = useState<ScanRecord[]>(getScans())
  const [farmerName, setFarmerName] = useState<string | null>(null)
  const [currentSupplierId, setCurrentSupplierIdState] = useState<string | null>(
    getCurrentSupplierId(),
  )
  const [pending, setPending] = useState<{ product?: string; crop?: string | null }>({})

  const selectRole = (next: Exclude<Role, null>) => {
    setRole(next)
    setAuthRole(next)
    setView('auth')
  }

  const authenticate = () => {
    if (authRole === 'farmer') {
      const profile = getFarmerProfile()
      setFarmerName(profile?.name ?? null)
      setView('dashboard')
    } else {
      setView('portal')
    }
  }

  const switchRole = () => {
    setRole(null)
    setAuthRole(null)
    setView('landing')
  }

  const updateLocation = (next: FarmerLocation) => {
    setLocation(next)
    saveStoredLocation(next)
  }

  const handleScanComplete = (d: Diagnosis, thumb: string | null) => {
    setDiagnosis(d)
    const record: ScanRecord = {
      id: `scan-${Date.now()}`,
      crop: d.crop,
      issue: d.issue,
      confidence: d.confidence,
      treatment: d.treatment,
      product: d.product,
      date: new Date().toISOString(),
      thumb,
    }
    setScans(addScan(record))
    setView('result')
  }

  const openFinders = (product?: string, crop?: string | null) => {
    setPending({ product, crop })
    setView('finders')
  }

  const handleSupplierCreated = (supplier: Supplier) => {
    const suppliers = getSuppliers()
    suppliers.push(supplier)
    saveSuppliers(suppliers)
    setCurrentSupplierId(supplier.id)
    setCurrentSupplierIdState(supplier.id)
    setView('portal')
  }

  if (view === 'landing') {
    return (
      <Landing
        onGetStarted={() => setView('roles')}
        onFarmer={() => selectRole('farmer')}
        onSupplier={() => selectRole('supplier')}
        onHowWorks={() => setView('how')}
        onFeatures={() => setView('features')}
      />
    )
  }

  if (view === 'roles') {
    return <RoleSelect onSelect={selectRole} onBack={() => setView('landing')} />
  }

  if (view === 'how') {
    return (
      <HowItWorks
        onBack={() => setView('landing')}
        onHow={() => setView('how')}
        onFeatures={() => setView('features')}
        onGetStarted={() => setView('roles')}
      />
    )
  }

  if (view === 'features') {
    return (
      <Features
        onBack={() => setView('landing')}
        onHow={() => setView('how')}
        onFeatures={() => setView('features')}
        onGetStarted={() => setView('roles')}
      />
    )
  }

  if (view === 'auth' && authRole) {
    return (
      <AuthView
        role={authRole}
        onBack={() => setView('roles')}
        onAuthenticated={authenticate}
        onCreateSupplier={() => setView('register')}
      />
    )
  }

  if (role === null) return null

  if (role === 'farmer') {
    return (
      <FarmerLayout
        view={view}
        onNavigate={(next) => setView(next)}
        onSwitchRole={switchRole}
        farmerName={farmerName}
        location={location}
      >
        {view === 'dashboard' && (
          <FarmerDashboard
            farmerName={farmerName}
            location={location}
            onChangeLocation={updateLocation}
            onScan={() => setView('scan')}
            onFindSuppliers={() => openFinders()}
            onHistory={() => setView('history')}
            scans={scans}
          />
        )}

        {view === 'scan' && (
          <Scanner onComplete={handleScanComplete} onCancel={() => setView('dashboard')} />
        )}

        {view === 'result' && diagnosis && (
          <DiagnosisView
            diagnosis={diagnosis}
            onFindSuppliers={() => openFinders(diagnosis.product, diagnosis.crop)}
            onScanAgain={() => setView('scan')}
          />
        )}

        {view === 'finders' && (
          <SupplierFinder
            location={location}
            onChangeLocation={updateLocation}
            initialProduct={pending.product}
            crop={pending.crop}
          />
        )}

        {view === 'history' && (
          <ScanHistory
            scans={scans}
            onViewSuppliers={(record) => openFinders(record.product, record.crop)}
            onScanNew={() => setView('scan')}
          />
        )}

        {view === 'location' && (
          <FarmerLocationView
            location={location}
            onChangeLocation={updateLocation}
            onBack={() => setView('dashboard')}
          />
        )}
      </FarmerLayout>
    )
  }

  return (
    <Shell role={role} onSwitchRole={switchRole}>
      {view === 'portal' && (
        <SupplierPortal
          currentSupplierId={currentSupplierId}
          onRegister={() => setView('register')}
        />
      )}

      {view === 'register' && (
        <SupplierRegistration
          onCreated={handleSupplierCreated}
          onCancel={() => setView('portal')}
        />
      )}
    </Shell>
  )
}