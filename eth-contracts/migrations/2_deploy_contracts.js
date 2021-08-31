// migrating the appropriate contracts
let SquareVerifier = artifacts.require("./verifier.sol");
let SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
let CustomERC721Token = artifacts.require("./CustomERC721Token.sol");

module.exports = async function (deployer) {
  let name = "RealEstateToken";
  let symbol = "RET_ERC721";
  let baseTokenURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";

  await deployer.deploy(CustomERC721Token, name, symbol, baseTokenURI);
  await deployer.deploy(SquareVerifier);
  await deployer.deploy(SolnSquareVerifier, SquareVerifier.address, name, symbol, baseTokenURI);
};
