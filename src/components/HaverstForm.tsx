import React, { useState, useMemo } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import type { HarvestFormData, HarvestRecord } from '../types';
import { BlockchainRealService } from '../services/UseCardano';
import type { HarvestPayload } from '../services/UseCardano';
import HarvestRecords from './HarvestRecords';

interface HarvestFormProps {
  onBack: () => void;
  harvestRecords: HarvestRecord[];
  setHarvestRecords: (records: HarvestRecord[] | ((prev: HarvestRecord[]) => HarvestRecord[])) => void;
}

const HarvestForm: React.FC<HarvestFormProps> = ({ onBack, harvestRecords, setHarvestRecords }) => {
  
  const [formData, setFormData] = useState<HarvestFormData>({
    phoneNumber: '',
    pin: '',
    plotLocation: '',
    cropType: 'Maize',
    weightKg: 50
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'form' | 'records'>('form');
  const [lastTransactionHash, setLastTransactionHash] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null); 

  const blockchainService = useMemo(() => new BlockchainRealService(), []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    const newValue = type === 'number' ? (value === '' ? '' : parseFloat(value)) : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setLastTransactionHash('');
    setErrorMessage(null); 

    try {
      if (!formData.phoneNumber || !formData.pin || !formData.plotLocation || !formData.cropType || formData.weightKg === '') {
        throw new Error('All fields are required.');
      }
      
      if (typeof formData.weightKg !== 'number' || formData.weightKg <= 0) {
          throw new Error('Harvest weight must be a positive number.');
      }

      if (formData.pin.length !== 6 || !/^\d+$/.test(formData.pin)) {
        throw new Error('PIN must be exactly 6 digits.');
      }

      const { seedInput, farmerId } = await blockchainService.deriveKeyFromCredentials(
        formData.phoneNumber, 
        formData.pin
      );

      const payload: HarvestPayload = {
        cropType: formData.cropType,
        weightKg: formData.weightKg, 
        locationText: formData.plotLocation,
        timestamp: new Date().toISOString(),
        farmerId
      };

      const result = await blockchainService.submitHarvestToBlockchain(payload, seedInput);

      const newRecord: HarvestRecord = {
        id: Date.now().toString(),
        phoneNumber: formData.phoneNumber,
        plotLocation: formData.plotLocation,
        cropType: formData.cropType,         
        weightKg: formData.weightKg as number, 
        timestamp: payload.timestamp,
        transactionHash: result.transactionHash,
        publicKey: result.publicKey,
        farmerAddress: result.farmerAddress,
        signature: result.signature.slice(0, 32)
      };

      setHarvestRecords(prev => [newRecord, ...prev]);
      
      setLastTransactionHash(result.transactionHash);
      setSubmitStatus('success');
      
      setFormData({
        phoneNumber: '',
        pin: '',
        plotLocation: '',
        cropType: '',
        weightKg: ''
      });

    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown submission error occurred.';
      console.error('Submission error:', error);
      setErrorMessage(message); 
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const viewOnExplorer = () => {
    if (lastTransactionHash) {
      window.open(`https://preprod.cardanoscan.io/transaction/${lastTransactionHash}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-primary-900">AgriDatum</span>
          </div>
        </div>

        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('form')}
            className={`py-4 px-6 font-medium border-b-2 transition-colors ${
              activeTab === 'form'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Record Harvest
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`py-4 px-6 font-medium border-b-2 transition-colors ${
              activeTab === 'records'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            View Records ({harvestRecords.length})
          </button>
        </div>

        {activeTab === 'form' ? (
          <div className="card p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary-900 mb-2">
                Record Your Harvest
              </h1>
              <p className="text-gray-600">
                Securely store your harvest data on the Cardano blockchain
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Farmer ID) *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="+1234567890"
                  pattern="[+0-9\s\-]+"
                />
              </div>

              <div>
                <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                  6-Digit PIN *
                </label>
                <input
                  type="password"
                  id="pin"
                  name="pin"
                  value={formData.pin}
                  onChange={handleInputChange}
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                  className="input-field"
                  placeholder="123456"
                  title="Must be exactly 6 digits"
                />
                <p className="text-xs text-gray-500 mt-1">Exactly 6 digits (0-9)</p>
              </div>

              <div>
                <label htmlFor="plotLocation" className="block text-sm font-medium text-gray-700 mb-2">
                  Plot Name / Location *
                </label>
                <input
                  type="text"
                  id="plotLocation"
                  name="plotLocation"
                  value={formData.plotLocation}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="North Field - Section A"
                />
              </div>

              <div>
                <label htmlFor="cropType" className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Type *
                </label>
                <input
                  type="text"
                  id="cropType"
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="e.g., Maize, Wheat, Beans"
                />
              </div>

              <div>
                <label htmlFor="weightKg" className="block text-sm font-medium text-gray-700 mb-2">
                  Harvest Weight (kg) *
                </label>
                <input
                  type="number"
                  id="weightKg"
                  name="weightKg"
                  value={formData.weightKg}
                  onChange={handleInputChange}
                  required
                  min="0.1"
                  className="input-field"
                  placeholder="50"
                />
              </div>

              {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">
                      Harvest recorded successfully!
                    </span>
                  </div>
                  {lastTransactionHash && (
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-green-700">Transaction:</span>
                      <code className="bg-green-100 px-2 py-1 rounded text-green-800 font-mono">
                        {lastTransactionHash.slice(0, 16)}...{lastTransactionHash.slice(-8)}
                      </code>
                      <button
                        onClick={viewOnExplorer}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="flex items-start space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                  <div className="text-red-800">
                    <span className="font-medium block mb-1">Error recording harvest.</span>
                    <p className="text-sm">
                      Details: **{errorMessage || 'An unexpected error occurred. Please try again.'}**
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Recording to Blockchain...
                  </div>
                ) : (
                  'Record Harvest on Blockchain'
                )}
              </button>
            </form>

            
            <div className="mt-8 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <h3 className="font-semibold text-primary-900 mb-2">
                Blockchain Security:
              </h3>
              <ul className="text-sm text-primary-700 space-y-1">
                <li>• Your credentials generate a unique Cardano wallet</li>
                <li>• Data is signed and stored on Cardano Preprod network</li>
                <li>• Gas fees are sponsored by AgriDatum</li>
                <li>• Records are immutable and permanently verifiable</li>
              </ul>
            </div>
          </div>
        ) : (
          <HarvestRecords 
            records={harvestRecords} 
            onDownload={() => {
              const dataStr = JSON.stringify(harvestRecords, null, 2);
              const dataBlob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `agridatum-records-${new Date().toISOString().split('T')[0]}.json`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default HarvestForm;