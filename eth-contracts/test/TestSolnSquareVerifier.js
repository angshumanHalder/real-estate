const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
const Verifier = artifacts.require("Verifier");
const proof = require("../../zokrates/code/square/proof1.json");
// Test if a new solution can be added for contract - SolnSquareVerifier
// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
contract("TestSolnSquareVerifier", (accounts) => {
  let name = "RealEstateToken";
  let symbol = "RET_ERC721";
  let baseTokenURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";
  describe("Test functionality", () => {
    before(async () => {
      const verifier = await Verifier.new();
      this.contract = await SolnSquareVerifier.new(verifier.address, name, symbol, baseTokenURI);
    });
    it("should add solutions", async () => {
      let transaction = await this.contract.addSolution(
        proof.proof.a,
        proof.proof.b,
        proof.proof.c,
        proof.inputs,
        accounts[0],
        1,
        { from: accounts[0] }
      );
      let added = transaction.logs[0].event;
      assert.equal(added, "SolutionAdded", "Event does not match");
    });

    it("should mint token", async () => {
      await this.contract.mintVerify(accounts[0], 1);
    });
  });
});
