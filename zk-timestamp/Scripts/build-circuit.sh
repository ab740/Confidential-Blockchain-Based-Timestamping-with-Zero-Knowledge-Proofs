#!/usr/bin/env bash
set -euo pipefail

CIRCUITS_DIR=circuits
ARTIFACTS_DIR=artifacts/circuits

mkdir -p $ARTIFACTS_DIR

# 1) Compile circom
echo "[*] Compiling circuit..."
circom $CIRCUITS_DIR/timestamp.circom --r1cs --wasm --sym -o $ARTIFACTS_DIR

# 2) Powers of Tau (use a small ptau for demo; pick higher for production)
PTAU_FILE=powersOfTau28_hez_final_10.ptau
if [ ! -f $ARTIFACTS_DIR/$PTAU_FILE ]; then
  echo "[*] Downloading ptau..."
  curl -L -o $ARTIFACTS_DIR/$PTAU_FILE https://hermez.s3-eu-west-1.amazonaws.com/$PTAU_FILE
fi

# 3) Groth16 setup
echo "[*] Groth16 setup..."
snarkjs groth16 setup \
  $ARTIFACTS_DIR/timestamp.r1cs \
  $ARTIFACTS_DIR/$PTAU_FILE \
  $ARTIFACTS_DIR/timestamp.zkey

# 4) Export verification key
echo "[*] Exporting vkey..."
snarkjs zkey export verificationkey $ARTIFACTS_DIR/timestamp.zkey $ARTIFACTS_DIR/vkey.json

# 5) Export Solidity Verifier
echo "[*] Exporting Verifier.sol..."
snarkjs zkey export verifier $ARTIFACTS_DIR/timestamp.zkey contracts/Verifier.sol

echo "[*] Done. Artifacts in $ARTIFACTS_DIR"
