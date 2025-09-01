pragma circom 2.1.4;

// to compute Poseidon from circomlib 
include "circomlib/circuits/poseidon.circom";

/*
  Public inputs:
    - b : randomness beacon (field element)
    - C : commitment (field element)

  Private inputs:
    - R : Merkle root (field element)
    - r : secret salt (field element)

  Constraint:
    Poseidon(R, r, b) == C
*/

template Timestamp() {
    signal input R;
    signal input r;
    signal input b;
    signal input C;

    component H = Poseidon(3);
    H.inputs[0] <== R;
    H.inputs[1] <== r;
    H.inputs[2] <== b;

    // Enforce equality
    H.out === C;
}

component main = Timestamp();
