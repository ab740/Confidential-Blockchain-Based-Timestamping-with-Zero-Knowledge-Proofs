pragma solidity ^0.8.20;

/**
 * @title CommitmentRegistry
 * @dev Minimal anchoring contract: emits an event that includes the commitment C.
 * Only C is stored on-chain to preserve confidentiality; b (beacon) is derivable from the block hash.
 */
contract CommitmentRegistry {
    event Anchored(
        address indexed submitter,
        uint256 indexed C,
        uint256 blockNumber,
        uint256 timestamp
    );

    function anchor(uint256 C) external {
        emit Anchored(msg.sender, C, block.number, block.timestamp);
    }
}
