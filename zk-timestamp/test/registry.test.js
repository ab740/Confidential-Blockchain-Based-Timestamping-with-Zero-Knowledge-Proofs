const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CommitmentRegistry", function () {
  it("emits Anchored event", async () => {
    const [user] = await ethers.getSigners();
    const Registry = await ethers.getContractFactory("CommitmentRegistry");
    const registry = await Registry.deploy();
    await registry.deployed();

    const C = 123n;
    await expect(registry.connect(user).anchor(C))
      .to.emit(registry, "Anchored")
      .withArgs(user.address, C, anyValue=undefined, anyValue=undefined);
  });
});
