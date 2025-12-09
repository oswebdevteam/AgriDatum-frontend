export interface HarvestFormData {
  phoneNumber: string
  pin: string
  plotLocation: string
  cropType: string;      
  weightKg: number | '';
}

export interface HarvestRecord {
  id: string | number;
  phoneNumber?: string;
  plotLocation: string;
  cropType: string;
  weightKg: number;
  timestamp: string;
  transactionHash: string | null;
  publicKey: string;
  farmerAddress: string;
  signature?: string;
  indexedOnChain?: boolean;
  farmerId?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  farmerId: string | null;
  phoneNumber: string | null;
}