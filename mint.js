const { mnemonic, infuraKey, owner, contract } = require("./eth-contracts/secrets.json");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const proofs = [
  require("./zokrates/code/square/proof1.json"),
  require("./zokrates/code/square/proof2.json"),
  require("./zokrates/code/square/proof3.json"),
  require("./zokrates/code/square/proof4.json"),
  require("./zokrates/code/square/proof5.json"),
  require("./zokrates/code/square/proof6.json"),
  require("./zokrates/code/square/proof7.json"),
  require("./zokrates/code/square/proof8.json"),
  require("./zokrates/code/square/proof9.json"),
  require("./zokrates/code/square/proof10.json"),
];

const web3 = require("web3");
const network = "rinkeby";

if (!mnemonic || !infuraKey || !owner || !network) {
  console.error("Please set a mnemonic, infura key, owner, network, and contract address.");
  return;
}

const abi = require("./eth-contracts/build/contracts/SolnSquareVerifier").abi;

const init = async () => {
  const provider = new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`);
  const web3Inst = new web3(provider);

  if (contract) {
    const token = new web3Inst.eth.Contract(abi, contract, { gasLimit: "1000000" });
    console.log(token);
    try {
      for (let i = 0; i < 10; i++) {
        console.log("proofs " + i, proofs[i]);
        let tx = await token.methods
          .addSolution(proofs[i].proof.a, proofs[i].proof.b, proofs[i].proof.c, proofs[i].inputs, owner, i * 10)
          .send({ from: owner, gas: 3000000 });
        console.log("solution added", tx);
        tx = await token.methods.mintVerify(owner, i).send({ from: owner, gas: 3000000 });
        console.log("Token mint", tx);
      }
    } catch (err) {
      console.log(err);
    }
  }
};

init();
