const fs = require("fs");
const snarkjs = require("snarkjs");
const { merkleRootPoseidon } = require("./filePreprocess");

// Full proving using snarkjs.groth16.fullProve
async function generateProof(filePath, r, b, C, wasmPath, zkeyPath) {
  const R = await merkleRootPoseidon(filePath);
  // Inputs to circuit
  const input = { R: R.toString(), r: r.toString(), b: b.toString(), C: C.toString() };

  const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, wasmPath, zkeyPath);
  // Save if needed
  fs.writeFileSync("proof.json", JSON.stringify(proof, null, 2));
  fs.writeFileSync("public.json", JSON.stringify(publicSignals, null, 2));

  return { proof, publicSignals };
}

module.exports = { generateProof };
