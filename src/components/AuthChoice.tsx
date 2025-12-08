import React from 'react';
import { LogIn, UserPlus, Leaf } from 'lucide-react';

interface AuthChoiceProps {
  onChooseLogin: () => void;
  onChooseSignUp: () => void;
}

const AuthChoice: React.FC<AuthChoiceProps> = ({ onChooseLogin, onChooseSignUp }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-green-100 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Leaf className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-green-900 mb-4">
            Welcome to AgriDatum
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Secure, blockchain-powered harvest tracking for farmers
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                New User
              </h2>
              <p className="text-gray-600 mb-6">
                Create your blockchain account and start recording your harvests securely
              </p>
              <ul className="text-sm text-gray-600 text-left space-y-2 mb-6 w-full">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Secure blockchain wallet</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Immutable harvest records</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Access from any device</span>
                </li>
              </ul>
              <button
                onClick={onChooseSignUp}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-5 h-5" />
                <span>Sign Up</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <LogIn className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Existing User
              </h2>
              <p className="text-gray-600 mb-6">
                Log in with your phone number and PIN to access your harvest records
              </p>
              <ul className="text-sm text-gray-600 text-left space-y-2 mb-6 w-full">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>View all your records</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Add new harvests</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Verify on blockchain</span>
                </li>
              </ul>
              <button
                onClick={onChooseLogin}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </button>
            </div>
          </div>
        </div>

        
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Your data is secured on the Cardano blockchain
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthChoice;