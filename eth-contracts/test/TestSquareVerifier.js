// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
const Verifier = artifacts.require("Verifier");
const proof = require("../../zokrates/code/square/proof1.json");

// Test verification with correct proof
// - use the contents from proof.json generated from zokrates steps

// Test verification with incorrect proof
contract("Verifier", (accounts) => {
  before("setup", async () => {
    this.contract = await Verifier.new();
  });
  it("should verify with correct proof", async () => {
    const res = await this.contract.verifyTx(Object.values(proof.proof), proof.inputs);
    console.log("Verification result", res);
    assert(res, "Invalid result");
  });
  it("should verify with incorrect proof", async () => {
    let inputs = [
      "0x0000000000000000000000000000000000000000000000000000000000000001",
      "0x0000000000000000000000000000000000000000000000000000000000000001",
    ];
    const res = await this.contract.verifyTx(Object.values(proof.proof), inputs);
    console.log("Verification result", res);
    assert(!res, "Invalid result");
  });
});
