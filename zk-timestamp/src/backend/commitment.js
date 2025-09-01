const poseidon = require("circomlibjs").poseidon;
const F = poseidon.F;

function poseidonCommitment(R, r, b) {
  const C = poseidon([R, r, b]);
  return F.toObject(C); // field element (uint256)
}

module.exports = { poseidonCommitment };
