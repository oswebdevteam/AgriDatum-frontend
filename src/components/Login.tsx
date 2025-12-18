import React, { useState } from 'react';
import { LogIn, UserCircle, Lock, Phone, ArrowLeft } from 'lucide-react';
import { cardanoRealService } from '../services/Cardano';

interface LoginProps {
  onLoginSuccess: (farmerId: string, phoneNumber: string) => void;
  onBackToAuth: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onBackToAuth }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const blockchainService = new cardanoRealService();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!phoneNumber || !pin) {
        throw new Error('Please enter both phone number and PIN');
      }

      if (pin.length !== 6 || !/^\d+$/.test(pin)) {
        throw new Error('PIN must be exactly 6 digits');
      }

      const { farmerId } = await blockchainService.deriveKeyFromCredentials(
        phoneNumber,
        pin
      );


      sessionStorage.setItem('farmerId', farmerId);
      sessionStorage.setItem('phoneNumber', phoneNumber);
      

      onLoginSuccess(farmerId, phoneNumber);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--primary-50) flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button
          onClick={onBackToAuth}
          className="flex items-center text-green-700 hover:text-green-800 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="rounded-lg flex items-center justify-center">
              <span className="w-40 object-cover"><img src= "/images/logo.png" alt=''/></span>
            </div>
          </div>
          <p className="text-gray-600">
            Blockchain-powered harvest tracking
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-2 mb-6">
            <UserCircle className="w-6 h-6 text-(--primary-600)" />
            <h2 className="text-2xl font-bold text-gray-900">Login</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+1234567890"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                6-Digit PIN
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="pin"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="••••••"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter your 6-digit PIN</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-(--primary-600) text-white py-3 rounded-lg font-medium hover:bg-(--primary-700) disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              Enter your phone number and PIN to access your harvest records.
            </p>
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-gray-600">
          Your data is secured on the Cardano blockchain
        </div>
      </div>
    </div>
  );
};

export default Login;