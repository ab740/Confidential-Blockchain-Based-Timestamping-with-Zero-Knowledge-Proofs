Confidential Timestamping (Commit → Anchor → Prove)
A privacy-preserving timestamping system that anchors a Poseidon commitment on Ethereum and proves file existence with zk-SNARKs (Groth16) without revealing the file or its hash. Includes Circom circuits, Solidity verifier + anchoring contract, and a Node.js API for commit, prove, and verify.

Prerequisites

 •	A machine with a recent OS and Git.
 •	Node.js v18+ and npm installed.
 •	Circom v2 compiler available on your PATH.
 •	SnarkJS CLI installed.
 •	Hardhat toolchain available in the project (installed via npm).
 •	(For testnet) An Ethereum RPC endpoint (e.g., Sepolia) and a funded private key.
 
 Setup (one time)
 1.	Clone the repository and open the project folder.
 2.	Install project dependencies using your package manager.
 3.	Create a .env file from the example and set:


o RPC endpoint URL.

o	Private key of the deployer account.

o	API port (optional).


4.	Build the Circom circuit to generate the R1CS, WASM, and symbol files.
5.	Run the Groth16 trusted setup (Powers of Tau), create the circuit zkey, and export the verification key.
6.	Export the Solidity verifier contract from the zkey into the contracts folder.

Local Development Flow
 1.	Start a local Ethereum node with Hardhat.
 2.	Deploy the Commitment Registry and the Verifier contracts to the local node.
 3.	Update the .env with the local RPC URL, a local private key, and the deployed registry address.
 4.	Start the backend server.
Testnet Deployment (Sepolia)
 1.	Ensure the deployer account has test ETH.
 2.	Set the RPC URL and private key for Sepolia in .env.
 3.	Compile and deploy contracts to Sepolia.
 4.	Record the deployed addresses and place the registry address in .env.
 5.	Start the backend server pointing at Sepolia.
API Usage (no code required)
•	Commit: Send a file to the /commit endpoint as form data.
Result includes the Merkle root, a secret salt, the beacon value, the commitment, and on-chain transaction details.
Keep the salt secret and retain the original file; both are needed for proofs.
•	Prove: Send the same file to /prove along with the previously returned salt, beacon, and commitment.
Result includes a zk-SNARK proof and the public signals.
•	Verify (off-chain): Post the proof and public signals to /verify-offchain.
Result indicates whether verification succeeded.
•	Verify (on-chain, optional): Call the Verifier contract with the proof and public inputs; expect a boolean result.

End-to-End Checklist
 1.	Commit a file; note the returned salt, beacon, commitment, and tx details.
 2.	Later, prove using the exact same file plus the saved salt, beacon, and commitment.
 3.	Verify off-chain (fast) or on-chain (costs gas).
 4.	Anyone can independently verify using the public commitment and verification key; no file or hash is revealed.
    
Tips & Troubleshooting
 •	Always use the exact file used during commit; any change alters the Merkle root and invalidates proofs.
 •	Store the salt securely; you cannot regenerate a proof without it.
 •	If proof verification fails, confirm the salt, beacon, and commitment match the commit response.
 •	For WASM or setup errors, ensure Circom v2, SnarkJS, and Node v18+ are correctly installed and available on PATH.
 •	On-chain verification consumes gas; prefer off-chain verification for routine checks.

