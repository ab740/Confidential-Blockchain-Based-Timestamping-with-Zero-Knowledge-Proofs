const crypto = require("crypto");
const poseidon = require("circomlibjs").poseidon;
const F = poseidon.F;

function randomSalt() {
  const bytes = crypto.randomBytes(31); // ~248 bits < BN254 field
  const r = BigInt("0x" + bytes.toString("hex")) % F.p;
  return r;
}

async function beaconFromBlock(provider) {
  const block = await provider.getBlock("latest");
  return BigInt(block.hash); // treat block hash as field (auto mod below)
}

module.exports = { randomSalt, beaconFromBlock };
