import { useState } from 'react'
import LandingPage from './components/LandingPage'
import HarvestForm from './components/HaverstForm'
import type { HarvestRecord } from './types'

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'form'>('landing')
  const [harvestRecords, setHarvestRecords] = useState<HarvestRecord[]>([])

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 to-primary-100">
      {currentView === 'landing' ? (
        <LandingPage onGetStarted={() => setCurrentView('form')} />
      ) : (
        <HarvestForm 
          onBack={() => setCurrentView('landing')}
          harvestRecords={harvestRecords}
          setHarvestRecords={setHarvestRecords}
        />
      )}
    </div>
  )
}

export default App