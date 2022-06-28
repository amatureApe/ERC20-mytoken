const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers } = require("hardhat");
const { INITIAL_SUPPLY } = require("../helper-hardhat-config");

describe("MyToken Unit Test", function () {
  let myToken, deployer, user1;
  beforeEach(async function () {
    const accounts = await getNamedAccounts();
    deployer = accounts.deployer;
    user1 = accounts.user1;

    await deployments.fixture("all");
    myToken = await ethers.getContract("MyToken", deployer);
  });

  it("Should have correct INITIAL_SUPPLY of token", async function () {
    const totalSupply = await myToken.totalSupply();
    assert.equal(totalSupply.toString(), INITIAL_SUPPLY);
  });

  it("Should be able to transfer tokens successfully to an address", async function () {
    const tokensToSend = ethers.utils.parseEther("10");
    await myToken.transfer(user1, tokensToSend);
    expect(await myToken.balanceOf(user1)).to.equal(tokensToSend);
  });

  it("Should approve other address to spend token", async () => {
    const tokensToSpend = ethers.utils.parseEther("5");
    await myToken.approve(user1, tokensToSpend);
    const myToken1 = await ethers.getContract("MyToken", user1);
    await myToken1.transferFrom(deployer, user1, tokensToSpend);
    expect(await myToken1.balanceOf(user1)).to.equal(tokensToSpend);
  });
})