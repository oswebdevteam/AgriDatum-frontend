import { sha256 } from "js-sha256";

export interface HarvestPayload {
  cropType: string;
  weightKg: number;
  locationText: string;
  timestamp: string;
  farmerId: string;
}

export interface BlockchainResult {
  transactionHash: string;
  publicKey: string;
  signature: string;
  farmerAddress: string;
}


export class cardanoRealService {
  
  async deriveKeyFromCredentials(phoneNumber: string, pin: string): Promise<{
    seedInput: string;
    farmerId: string;
  }> {
    const combined = phoneNumber + pin;
    const seedInput = sha256(combined);
    const farmerId = sha256(seedInput).slice(0, 16);
    
    return { seedInput, farmerId };
  }

  async generateKeysAndSignature(
    seedInput: string,
    farmerId: string,
    phoneNumber: string,
    plotLocation: string,
    cropType: string,
    weightKg: number,
    timestamp: string
  ): Promise<{
    publicKey: string;
    farmerAddress: string;
    signature: string;
  }> {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const url = `${API_BASE_URL}/api/keys/generate`;
      
      const harvestData = {
        farmerId,
        phoneNumber,
        plotLocation,
        cropType,
        weightKg,
        timestamp,
      };
      
      console.log('GENERATING KEYS & SIGNATURE');
      console.log('URL:', url);
      console.log('harvestData:', JSON.stringify(harvestData, null, 2));
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seedInput, harvestData }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        throw new Error(`Backend returned ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Keys and signature generated successfully');
      console.log('Signature present:', !!result.signature);
      
      if (!result.signature) {
        throw new Error('Backend did not return a signature');
      }
      
      return {
        publicKey: result.publicKey,
        farmerAddress: result.farmerAddress,
        signature: result.signature,
      };
    } catch (error) {
      console.error('KEY GENERATION ERROR', error);
      throw new Error(`Key generation failed: ${error}`);
    }
  }


  async verifyTransaction(txHash: string): Promise<boolean> {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${API_BASE_URL}/api/harvest/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionHash: txHash }),
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return result.verification?.blockchainValid === true;
    } catch (error) {
      console.error('Transaction verification failed:', error);
      return false;
    }
  }
}