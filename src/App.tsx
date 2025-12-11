import  { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthChoice from './components/AuthChoice';
import Login from './components/Login';
import SignUp from './components/SignUp';
import HarvestForm from './components/HaverstForm';
import { harvestApi } from './services/api/harvestApi';
import type { HarvestRecord } from './types';

type AppView = 'landing' | 'auth-choice' | 'login' | 'signup' | 'harvest-form';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [harvestRecords, setHarvestRecords] = useState<HarvestRecord[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentFarmerId, setCurrentFarmerId] = useState<string | null>(null);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState<string | null>(null);
  const [currentFullName, setCurrentFullName] = useState<string | null>(null);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);

  useEffect(() => {
    const savedFarmerId = sessionStorage.getItem('farmerId');
    const savedPhoneNumber = sessionStorage.getItem('phoneNumber');
    const savedFullName = sessionStorage.getItem('fullName');
    
    if (savedFarmerId && savedPhoneNumber) {
      console.log('Restoring session for farmer:', savedFarmerId);
      setCurrentFarmerId(savedFarmerId);
      setCurrentPhoneNumber(savedPhoneNumber);
      setCurrentFullName(savedFullName);
      setIsAuthenticated(true);
      setCurrentView('harvest-form');
      
      loadFarmerRecords(savedFarmerId);
    }
  }, []);

  const loadFarmerRecords = async (farmerId: string) => {
    setIsLoadingRecords(true);
    try {
      console.log(' Loading records for farmer:', farmerId);
      const response = await harvestApi.getRecordsByFarmer(farmerId, 100, 0);
      
      if (response.success && response.data) {
        const transformedRecords: HarvestRecord[] = response.data.map((record: any) => ({
          id: record.id.toString(),
          phoneNumber: record.phone_number,
          plotLocation: record.plot_location,
          cropType: record.crop_type,
          weightKg: parseFloat(record.weight_kg),
          timestamp: record.timestamp,
          transactionHash: record.transaction_hash,
          publicKey: record.public_key,
          farmerAddress: record.farmer_address,
          signature: record.signature?.slice(0, 32),
          indexedOnChain: record.indexed_on_chain,
          farmerId: record.farmer_id
        }));
        
        console.log(` Loaded ${transformedRecords.length} records from database`);
        setHarvestRecords(transformedRecords);
      } else {
        console.log('📭 No records found for this farmer');
        setHarvestRecords([]);
      }
    } catch (error) {
      console.error(' Failed to load records:', error);
      setHarvestRecords([]);
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const handleGetStarted = () => {
    setCurrentView('auth-choice');
  };

  const handleChooseLogin = () => {
    setCurrentView('login');
  };

  const handleChooseSignUp = () => {
    setCurrentView('signup');
  };

  const handleBackToAuth = () => {
    setCurrentView('auth-choice');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleLoginSuccess = (farmerId: string, phoneNumber: string) => {
    console.log(' Login successful for farmer:', farmerId);
    setCurrentFarmerId(farmerId);
    setCurrentPhoneNumber(phoneNumber);
    setIsAuthenticated(true);
    setCurrentView('harvest-form');
    
    
    loadFarmerRecords(farmerId);
  };

  const handleSignUpSuccess = (farmerId: string, phoneNumber: string, fullName: string) => {
    console.log(' Sign up successful for farmer:', farmerId);
    setCurrentFarmerId(farmerId);
    setCurrentPhoneNumber(phoneNumber);
    setCurrentFullName(fullName);
    setIsAuthenticated(true);
    setCurrentView('harvest-form');
    
    
    setHarvestRecords([]);
  };

  const handleLogout = () => {
    console.log(' Logging out...');
    sessionStorage.removeItem('farmerId');
    sessionStorage.removeItem('phoneNumber');
    sessionStorage.removeItem('fullName');
    setCurrentFarmerId(null);
    setCurrentPhoneNumber(null);
    setCurrentFullName(null);
    setIsAuthenticated(false);
    setHarvestRecords([]);
    setCurrentView('landing');
  };

  if (isLoadingRecords && currentView === 'harvest-form') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-green-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Loading your harvest records...</p>
          <p className="text-gray-500 text-sm mt-2">Fetching from database</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {currentView === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}

      {currentView === 'auth-choice' && (
        <AuthChoice
          onChooseLogin={handleChooseLogin}
          onChooseSignUp={handleChooseSignUp}
          onBackToLanding={handleBackToLanding}
        />
      )}

      {currentView === 'login' && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onBackToAuth={handleBackToAuth}
        />
      )}

      {currentView === 'signup' && (
        <SignUp
          onSignUpSuccess={handleSignUpSuccess}
          onBackToAuth={handleBackToAuth}
        />
      )}

      {currentView === 'harvest-form' && (
        <HarvestForm
          onBack={handleBackToLanding}
          onLogout={handleLogout}
          harvestRecords={harvestRecords}
          setHarvestRecords={setHarvestRecords}
          isAuthenticated={isAuthenticated}
          currentFarmerId={currentFarmerId}
          currentPhoneNumber={currentPhoneNumber}
          currentFullName={currentFullName}
        />
      )}
    </div>
  );
}

export default App;