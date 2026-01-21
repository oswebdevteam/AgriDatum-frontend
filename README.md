# AgriDatum (Frontend Repository)

AgriDatum is a blockchain-powered agricultural platform designed to revolutionize harvest data management. By leveraging the Cardano blockchain and AI-driven insights, AgriDatum ensures data integrity, transparency, and smarter decision-making for farmers.

## Key Features

- **Secure Harvest Logging**: Record crop types, weights, and locations with ease.
- **Blockchain Verification**: Every record is signed and hashed on the Cardano blockchain for immutable proof of origin.
- **AI Agricultural Assistant**: Integrated ChatBot powered by Google Gemini to help farmers with agricultural queries.
- **Farmer Authentication**: Secure login and sign-up with Cardano-derived cryptographic identities.
- **Real-time Dashboard**: View and manage harvest history with on-chain status verification.

## Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Blockchain Integration**: [MeshSDK](https://meshjs.dev/) for Cardano
- **AI Engine**: [Google Gemini Pro](https://deepmind.google/technologies/gemini/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+) or [Bun](https://bun.sh/)
- A `.env` file with the following variables:

  ```env
  VITE_API_URL=your_backend_url
  VITE_GEMINI_API_KEY=your_gemini_key
  ```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/agridatum.git
   cd agridatum
   ```

2. Install dependencies:

   ```bash
   bun install
   # or
   npm install
   ```

3. Run the development server:

   ```bash
   bun dev
   # or
   npm run dev
   ```

## Project Structure

- `src/components`: UI components (Landing Page, Forms, ChatBot, etc.)
- `src/services`: API services and Blockchain logic (Cardano, Gemini)
- `src/types`: TypeScript definitions
- `src/utils`: Helper functions and utilities

## Security & Verification

AgriDatum uses a unique key derivation system. When a farmer signs in with their phone number and PIN, a secure cryptographic identity is derived to sign harvest records. These signatures are verifiable on-chain, preventing data tampering.

---

Built for the future of Agriculture.
