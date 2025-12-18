import React, { useState } from 'react';
import { UserPlus, Phone, Lock, User, ArrowLeft } from 'lucide-react';
import { cardanoRealService } from '../services/Cardano';

interface SignUpProps {
  onSignUpSuccess: (farmerId: string, phoneNumber: string, fullName: string) => void;
  onBackToAuth: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess, onBackToAuth }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    pin: '',
    confirmPin: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const blockchainService = new cardanoRealService();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.fullName || !formData.phoneNumber || !formData.pin || !formData.confirmPin) {
        throw new Error('Please fill in all fields');
      }

      if (formData.pin.length !== 6 || !/^\d+$/.test(formData.pin)) {
        throw new Error('PIN must be exactly 6 digits');
      }

      if (formData.pin !== formData.confirmPin) {
        throw new Error('PINs do not match');
      }

      
      const { farmerId } = await blockchainService.deriveKeyFromCredentials(
        formData.phoneNumber,
        formData.pin
      );

      console.log('Sign up successful! FarmerId:', farmerId);

      sessionStorage.setItem('farmerId', farmerId);
      sessionStorage.setItem('phoneNumber', formData.phoneNumber);
      sessionStorage.setItem('fullName', formData.fullName);
      

      onSignUpSuccess(farmerId, formData.phoneNumber, formData.fullName);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
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
            Create your blockchain account
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-2 mb-6">
            <UserPlus className="w-6 h-6 text-(--primary-700)" />
            <h2 className="text-2xl font-bold text-gray-900">Sign Up</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+1234567890"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">This will be your unique farmer ID</p>
            </div>

            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                Create 6-Digit PIN
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="pin"
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="••••••"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPin" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm PIN
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="confirmPin"
                  name="confirmPin"
                  value={formData.confirmPin}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="••••••"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleSignUp}
              disabled={isLoading}
              className="w-full bg-(--primary-700) text-white py-3 rounded-lg font-medium hover:bg-(--primary-600) disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Secure & Private:</strong> Your phone number and PIN generate a unique 
              cardano wallet. Keep your PIN safe - we cannot recover it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;