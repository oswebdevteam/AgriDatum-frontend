export interface HarvestFormData {
  phoneNumber: string
  pin: string
  plotLocation: string
  cropType: string;      
  weightKg: number | '';
}

export interface HarvestRecord {
  id: string
  phoneNumber: string
  plotLocation: string
  cropType: string
  weightKg: number
  timestamp: string
  transactionHash?: string
  publicKey: string
  farmerAddress: string
  signature?: string
}