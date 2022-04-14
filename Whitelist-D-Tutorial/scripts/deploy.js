const {ethers}  = require("hardhat");
async function main(){
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so whitelistContract here is a factory for instances of our Whitelist contract.
  */
 const whitelistContract = await ethers.getContractFactory("Whitelist");
 //here we deoply the contract
  const deployedWhitelistContract = await whitelistContract.deploy(10);
  // wait for it to finish the deploying
  await deployedWhitelistContract.deployed();

  // print the address of the deployed contract
  console.log("whitelist contract address ",deployedWhitelistContract.address);

}
// call the main function and catch if there is any error
main()
.then(() => process.exit(0))
.catch((err) => {
  console.error(err);
  process.exit(1);
});