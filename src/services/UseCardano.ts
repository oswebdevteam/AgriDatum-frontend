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

  async generateKeysFromSeed(seedInput: string): Promise<{
    publicKey: string;
    farmerAddress: string;
    farmerId: string;
  }> {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${API_BASE_URL}/api/keys/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seedInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate keys from backend');
      }

      const result = await response.json();
      return {
        publicKey: result.publicKey,
        farmerAddress: result.farmerAddress,
        farmerId: result.farmerId,
      };
    } catch (error) {
      throw new Error(`Key generation failed: ${error}`);
    }
  }

  async submitHarvestToBlockchain(
    payload: HarvestPayload,
    seedInput: string
  ): Promise<BlockchainResult> {
    const keys = await this.generateKeysFromSeed(seedInput);
    
    const signature = sha256(JSON.stringify(payload) + seedInput);
    
    return {
      transactionHash: '', 
      publicKey: keys.publicKey,
      signature,
      farmerAddress: keys.farmerAddress,
    };
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