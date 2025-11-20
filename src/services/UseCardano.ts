import * as bip39 from "bip39";
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

export class BlockchainRealService {
  private lucid: any = null;

  constructor() {
    this.initializeLucid();
  }

  private async initializeLucid() {
  try {
    const { Lucid, Blockfrost } = await import(
      "https://unpkg.com/lucid-cardano@0.10.11/web/mod.js"
    );

    this.lucid = await Lucid.new(
      new Blockfrost(
        "https://cardano-preprod.blockfrost.io/api/v0",
        import.meta.env.VITE_BLOCKFROST_PROJECT_ID
      ),
      "Preprod"
    );

  } catch (error) {
    console.warn("Failed to initialize Lucid:", error);
  }
}

  async deriveKeyFromCredentials(phoneNumber: string, pin: string): Promise<{
    seedInput: string;
    farmerId: string;
  }> {
    
    const combined = phoneNumber + pin;
    const seedInput = sha256(combined);
    const farmerId = sha256(seedInput).slice(0, 16);
    
    return { seedInput, farmerId };
  }

  async generateMnemonicFromSeed(seedInput: string): Promise<string> {
    try {
      // Convert seed input to valid entropy for bip39
      const entropy = seedInput.slice(0, 32);
      const entropyBuffer = Buffer.from(entropy, 'hex');
      
      // Generate deterministic mnemonic
      const mnemonic = bip39.entropyToMnemonic(entropyBuffer);
      return mnemonic;
    } catch (error) {
      throw new Error(`Failed to generate mnemonic: ${error}`);
    }
  }

  async signPayloadOffline(payload: HarvestPayload, mnemonic: string): Promise<{
    signature: string;
    publicKey: string;
    address: string;
  }> {
    if (!this.lucid) {
      throw new Error("Lucid not initialized");
    }

    try {
      // Select wallet from mnemonic
      this.lucid.selectWallet.fromSeed(mnemonic);
      
      const wallet = this.lucid.wallet();
      const address = await wallet.address();
      const publicKey = await wallet.getPubKeyHash();

      // Sign the payload
      const payloadString = JSON.stringify(payload);
      const signature = await wallet.signMessage(payloadString);

      return {
        signature,
        publicKey,
        address
      };
    } catch (error) {
      throw new Error(`Failed to sign payload: ${error}`);
    }
  }

  async submitHarvestToBlockchain(
    payload: HarvestPayload,
    seedInput: string
  ): Promise<BlockchainResult> {
    try {
      // First, try to submit via backend API
      const backendResult = await this.submitViaBackend(payload, seedInput);
      return backendResult;
    } catch (error) {
      console.warn("Backend submission failed, trying direct blockchain:", error);
      
      // Fallback: direct blockchain submission
      const directResult = await this.submitDirectToBlockchain(payload, seedInput);
      return directResult;
    }
  }

  private async submitViaBackend(
    payload: HarvestPayload,
    seedInput: string
  ): Promise<BlockchainResult> {
    const response = await fetch('/api/harvest/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payload,
        seedInput,
        network: 'preprod'
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Backend submission failed');
    }

    return {
      transactionHash: result.transactionHash,
      publicKey: result.publicKey,
      signature: result.signature,
      farmerAddress: result.farmerAddress
    };
  }

  private async submitDirectToBlockchain(
    payload: HarvestPayload,
    seedInput: string
  ): Promise<BlockchainResult> {
    if (!this.lucid) {
      throw new Error("Lucid not initialized for direct submission");
    }

    try {
      const mnemonic = await this.generateMnemonicFromSeed(seedInput);
      const { signature, publicKey, address } = await this.signPayloadOffline(payload, mnemonic);

      
      const tx = await this.lucid.newTx()
        .payToAddress(address, { lovelace: 0n })
        .attachMetadata(674, { 
          type: "harvest_record",
          crop: payload.cropType,
          weight: payload.weightKg,
          location: payload.locationText,
          timestamp: payload.timestamp,
          farmer: payload.farmerId,
          signature: signature.slice(0, 64)
        })
        .complete();

      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();

      return {
        transactionHash: txHash,
        publicKey,
        signature,
        farmerAddress: address
      };
    } catch (error) {
      throw new Error(`Direct blockchain submission failed: ${error}`);
    }
  }

  async verifyTransaction(txHash: string): Promise<boolean> {
    try {
      if (!this.lucid) return false;

      const tx = await this.lucid.provider.getTransaction(txHash);
      return !!tx && tx.block !== undefined;
    } catch (error) {
      return false;
    }
  }
}