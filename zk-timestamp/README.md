# Confidential Timestamping (Commit–Anchor–Prove)

End-to-end prototype for confidential timestamping using Poseidon commitments and zk-SNARKs (Circom + SnarkJS). Anchors only the commitment `C` on Ethereum; later, prove knowledge of (R, r) with zero-knowledge.

## Prereqs

- Node.js >= 18
- `circom` v2.x (install from https://docs.circom.io)
- `snarkjs` (`npm i -g snarkjs`)
- `hardhat` (installed via devDependencies)
- An RPC provider URL + funded testnet key (Sepolia suggested)

## Install

```bash
npm install
cp .env.example .env
# edit .env with RPC_URL and PRIVATE_KEY
