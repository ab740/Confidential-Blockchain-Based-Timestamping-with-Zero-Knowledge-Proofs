const snarkjs = require("snarkjs");

// Off-chain verification with verification key
async function verifyOffchain(vkeyPath, proof, publicSignals) {
  const vkey = require("../../artifacts/circuits/vkey.json");
  if (vkeyPath) {
    // optionally load from provided path
  }
  const ok = await snarkjs.groth16.verify(vkey, publicSignals, proof);
  return ok;
}

module.exports = { verifyOffchain };
