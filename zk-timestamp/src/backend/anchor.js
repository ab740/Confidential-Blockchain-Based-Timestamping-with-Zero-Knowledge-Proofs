const { ethers } = require("ethers");

async function anchorCommitment(registryAddress, C, signer) {
  const abi = [
    "event Anchored(address indexed submitter, uint256 indexed C, uint256 blockNumber, uint256 timestamp)",
    "function anchor(uint256 C) external"
  ];
  const contract = new ethers.Contract(registryAddress, abi, signer);
  const tx = await contract.anchor(C.toString());
  const receipt = await tx.wait(1);
  const ev = receipt.logs
    .map(l => {
      try { return contract.interface.parseLog(l); } catch { return null; }
    })
    .filter(Boolean)
    .find(e => e.name === "Anchored");
  return {
    txHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber,
    timestamp: ev ? ev.args.timestamp.toNumber() : null
  };
}

module.exports = { anchorCommitment };
