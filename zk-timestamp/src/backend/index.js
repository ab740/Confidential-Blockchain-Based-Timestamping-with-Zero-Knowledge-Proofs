const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { ethers } = require("ethers");

const { merkleRootPoseidon } = require("./filePreprocess");
const { randomSalt, beaconFromBlock } = require("./randomness");
const { poseidonCommitment } = require("./commitment");
const { anchorCommitment } = require("./anchor");
const { generateProof } = require("./proofGenerator");
const { verifyOffchain } = require("./verify");

const app = express();
const upload = multer({ dest: "uploads/" });

const {
  RPC_URL,
  PRIVATE_KEY,
  REGISTRY_ADDRESS, // CommitmentRegistry
} = process.env;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = PRIVATE_KEY ? new ethers.Wallet(PRIVATE_KEY, provider) : null;

// Paths to circuit artifacts (after build-circuit.sh)
const wasmPath = path.join(__dirname, "../../artifacts/circuits/timestamp_js/timestamp.wasm");
const zkeyPath = path.join(__dirname, "../../artifacts/circuits/timestamp.zkey");

app.get("/", (_, res) => res.send("ZK Timestamp API: /commit, /prove, /verify-offchain"));

/**
 * POST /commit
 * body: file (multipart/form-data)
 * returns: { R, r, b, C, txHash, blockNumber, timestamp }
 */
app.post("/commit", upload.single("file"), async (req, res) => {
  try {
    if (!signer || !REGISTRY_ADDRESS) {
      return res.status(500).json({ error: "Signer or REGISTRY_ADDRESS not configured" });
    }
    const filePath = req.file.path;

    const R = await merkleRootPoseidon(filePath);
    const r = randomSalt();
    const b = await beaconFromBlock(provider);
    const C = poseidonCommitment(R, r, b);

    const { txHash, blockNumber, timestamp } = await anchorCommitment(REGISTRY_ADDRESS, C, signer);

    // User must store r and (optionally) R securely off-chain
    res.json({
      R: R.toString(),
      r: r.toString(),
      b: b.toString(),
      C: C.toString(),
      txHash,
      blockNumber,
      timestamp
    });

    fs.unlinkSync(filePath); // cleanup uploaded file
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

/**
 * POST /prove
 * body: file (multipart/form), fields: r, b, C
 * returns: { proof, publicSignals }
 */
app.post("/prove", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const { r, b, C } = req.body;

    const { proof, publicSignals } = await generateProof(
      filePath,
      BigInt(r),
      BigInt(b),
      BigInt(C),
      wasmPath,
      zkeyPath
    );

    fs.unlinkSync(filePath);
    res.json({ proof, publicSignals });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

/**
 * POST /verify-offchain
 * body: { proof, publicSignals }
 * returns: { ok: boolean }
 */
app.use(express.json());
app.post("/verify-offchain", async (req, res) => {
  try {
    const { proof, publicSignals } = req.body;
    const ok = await verifyOffchain(null, proof, publicSignals);
    res.json({ ok });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server listening on", PORT));
