// Example: on-chain verify using Verifier.sol
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [caller] = await hre.ethers.getSigners();
  const verifierAddress = process.argv[2];
  if (!verifierAddress) throw new Error("Usage: node scripts/verify-onchain.js <verifierAddress>");

  const proof = JSON.parse(fs.readFileSync("proof.json", "utf8"));
  const publicSignals = JSON.parse(fs.readFileSync("public.json", "utf8"));

  const Verifier = await hre.ethers.getContractFactory("Verifier");
  const verifier = Verifier.attach(verifierAddress);

  // snarkjs/groth16 outputs proof fields in a specific format
  const ok = await verifier.verifyProof(
    proof.pi_a,
    proof.pi_b,
    proof.pi_c,
    publicSignals // [C, b]
  );

  console.log("On-chain verify:", ok);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
