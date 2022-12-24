const ETHswap = artifacts.require("ETHswap");
const HINtoken = artifacts.require("HINtoken");

module.exports = async function(deployer) {

  await deployer.deploy(HINtoken);
  const token = await HINtoken.deployed()

  await deployer.deploy(ETHswap, token.address);
  const swap = await ETHswap.deployed()

  await token.transfer(swap.address, '1000000000000000000000000')
  

};