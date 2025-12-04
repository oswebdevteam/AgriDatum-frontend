const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


export interface HarvestSubmission {
  farmerId: string;
  phoneNumber: string;
  plotLocation: string;
  cropType: string;
  weightKg: number;
  timestamp: string;
  publicKey: string;
  signature?: string;
}

export interface HarvestRecordAPI {
  id: number;
  farmer_id: string;
  phone_number: string;
  plot_location: string;
  crop_type: string;
  weight_kg: string;
  timestamp: string;
  transaction_hash: string | null;
  farmer_address: string;
  indexed_on_chain: boolean;
  created_at: string;
  public_key: string;
  signature: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  blockchain?: {
    submitted: boolean;
    transactionHash: string | null;
  };
  pagination?: {
    total?: number;
    limit: number;
    offset: number;
  };
}

export interface VerificationResponse {
  success: boolean;
  record: {
    id: number;
    farmerId: string;
    cropType: string;
    weightKg: number;
    timestamp: string;
    farmerAddress: string;
  };
  verification: {
    signatureValid: boolean | null;
    blockchainIndexed: boolean;
    blockchainValid: boolean;
    transactionHash: string | null;
  };
  metadata: any;
}


class HarvestApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        console.error('=== API ERROR RESPONSE ===');
        console.error('Status:', response.status);
        console.error('Error:', error);
        throw new Error(error.error || error.message || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async generateKeys(seedInput: string): Promise<{
    success: boolean;
    publicKey: string;
    farmerAddress: string;
    farmerId: string;
  }> {
    return this.request<any>('/api/keys/generate', {
      method: 'POST',
      body: JSON.stringify({ seedInput }),
    });
  }

  async submitHarvest(data: HarvestSubmission): Promise<ApiResponse<HarvestRecordAPI>> {
    return this.request<ApiResponse<HarvestRecordAPI>>(
      '/api/harvest/submit',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async verifyHarvest(
    recordId?: number,
    transactionHash?: string
  ): Promise<VerificationResponse> {
    if (!recordId && !transactionHash) {
      throw new Error('Either recordId or transactionHash is required');
    }

    return this.request<VerificationResponse>('/api/harvest/verify', {
      method: 'POST',
      body: JSON.stringify({ recordId, transactionHash }),
    });
  }

  async getRecordsByFarmer(
    farmerId: string,
    limit = 50,
    offset = 0
  ): Promise<ApiResponse<HarvestRecordAPI[]>> {
    return this.request<ApiResponse<HarvestRecordAPI[]>>(
      `/api/harvest/records/${farmerId}?limit=${limit}&offset=${offset}`,
      { method: 'GET' }
    );
  }

  async getAllRecords(filters?: {
    cropType?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<HarvestRecordAPI[]>> {
    const params = new URLSearchParams();
    
    if (filters?.cropType) params.append('cropType', filters.cropType);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    params.append('limit', (filters?.limit || 100).toString());
    params.append('offset', (filters?.offset || 0).toString());
    
    return this.request<ApiResponse<HarvestRecordAPI[]>>(
      `/api/harvest/records?${params.toString()}`,
      { method: 'GET' }
    );
  }
}

export const harvestApi = new HarvestApiService();

export function transformApiRecord(apiRecord: HarvestRecordAPI): any {
  return {
    id: apiRecord.id.toString(),
    phoneNumber: apiRecord.phone_number,
    plotLocation: apiRecord.plot_location,
    cropType: apiRecord.crop_type,
    weightKg: parseFloat(apiRecord.weight_kg),
    timestamp: apiRecord.timestamp,
    transactionHash: apiRecord.transaction_hash,
    publicKey: apiRecord.public_key,
    farmerAddress: apiRecord.farmer_address,
    signature: apiRecord.signature?.slice(0, 32),
    indexedOnChain: apiRecord.indexed_on_chain,
    farmerId: apiRecord.farmer_id,
  };
}

export function transformApiRecords(apiRecords: HarvestRecordAPI[]): any[] {
  return apiRecords.map(transformApiRecord);
}