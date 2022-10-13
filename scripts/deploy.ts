import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

// DAI CONTRACT ADDRESS: 0x6B175474E89094C44Da98b954EedeAC495271d0F
// DAI HOLDER ADDRESS: 0x4943b0c9959dcf58871a799dfb71bece0d97c9f4

async function main() {
  const daiContractAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  
  const daiHolder = "0x4943b0c9959dcf58871a799dfb71bece0d97c9f4";
  await helpers.impersonateAccount(daiHolder);
  const impersonatedSigner = await ethers.getSigner(daiHolder);

  await helpers.setBalance(impersonatedSigner.address, 100n ** 18n);

  // -> DEPLOY ERC20 Token
  const LPToken = await ethers.getContractFactory("LPToken");
  const lPToken = await LPToken.deploy(impersonatedSigner.address);
  await lPToken.deployed();
  
  console.log(`LP Token deployed to ${lPToken.address}`);
  

  // -> DEPLOY THE IFO
  const IFO = await ethers.getContractFactory("IFO");
  const ifo = await IFO.deploy();
  await ifo.deployed();
  
  console.log(`LP Token deployed to ${ifo.address}`);

   

  // Contracts are deployed using the first signer/account by default
  const [owner, otherAccount] = await ethers.getSigners();


  const getCurrentBlock = (await ifo.getCurrentBlock());
  console.log(`This is the log of the block ${getCurrentBlock}`);

  // -> INTERACT WITH THE INITIALIZE FUNCTION
  const offeringAmount = ethers.utils.parseEther("100");
  const raisingAmount = ethers.utils.parseEther("1000");
  const init = await (await ifo.initialize(daiContractAddress, lPToken.address, getCurrentBlock, (Number(getCurrentBlock) + 5760), offeringAmount, raisingAmount, owner.address)).wait();
  console.log(`This is the log of the initializable ${init}`);
  
  // -> INTERACT WITH THE DEPOSIT FUNCTION
  const amount = ethers.utils.parseEther("10");
  const deposit = await (await ifo.connect(impersonatedSigner).deposit(amount)).wait();
  console.log(`This is the log of the deposit ${deposit}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
