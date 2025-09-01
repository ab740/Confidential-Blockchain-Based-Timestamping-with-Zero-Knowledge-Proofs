const fs = require("fs");
const poseidon = require("circomlibjs").poseidon;

const F = poseidon.F;

// Chunk file into fixed-size pieces and compute a Poseidon Merkle root.
// Leaves: Poseidon([chunkField]); Parents: Poseidon([left, right])
// If odd number at a level, duplicate the last leaf.
async function merkleRootPoseidon(filePath, chunkSize = 32 * 1024) {
  const buf = fs.readFileSync(filePath);
  const leaves = [];

  for (let offset = 0; offset < buf.length; offset += chunkSize) {
    const chunk = buf.slice(offset, offset + chunkSize);
    const x = BigInt("0x" + chunk.toString("hex")); // map bytes to field
    const leaf = poseidon([x]); // hash chunk as one field element
    leaves.push(F.toObject(leaf));
  }

  if (leaves.length === 0) {
    // empty file: use Poseidon([0]) as leaf
    leaves.push(F.toObject(poseidon([0n])));
  }

  let level = leaves;
  while (level.length > 1) {
    const next = [];
    for (let i = 0; i < level.length; i += 2) {
      const L = level[i];
      const R = i + 1 < level.length ? level[i + 1] : level[i]; 
      const parent = poseidon([L, R]);
      next.push(F.toObject(parent));
    }
    level = next;
  }

  return level[0]; 
}

module.exports = { merkleRootPoseidon };
