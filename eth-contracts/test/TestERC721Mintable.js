var ERC721MintableComplete = artifacts.require("CustomERC721Token");

contract("TestERC721Mintable", (accounts) => {
  const account_one = accounts[0];
  const account_two = accounts[1];
  let name = "RealEstateToken";
  let symbol = "RET_ERC721";
  let baseTokenURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";

  describe("match erc721 spec", function () {
    before(async function () {
      this.contract = await ERC721MintableComplete.new(name, symbol, baseTokenURI, { from: account_one });

      // TODO: mint multiple tokens

      for (let i = 1; i <= 5; i++) {
        await this.contract.mint(account_one, i, { from: account_one });
      }
    });

    it("should return total supply", async function () {
      let supply = await this.contract.totalSupply();
      assert.equal(parseInt(supply), 5, "Supply quantity does not match");
    });

    it("should get token balance", async function () {
      let balance = await this.contract.balanceOf(account_one);
      assert.equal(parseInt(balance), 5, "balanceOf  is  not  correct");
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it("should return token uri", async function () {
      let token_uri = await this.contract.tokenURI(1, { from: account_one });
      assert.equal(
        token_uri,
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1",
        "TokenURI does not match"
      );
    });

    it("should transfer token from one owner to another", async function () {
      let ownerOfToken1 = await this.contract.ownerOf(1);
      assert.equal(ownerOfToken1, account_one, "Original token owner does not match");
      await this.contract.safeTransferFrom(account_one, account_two, 1, { from: account_one });
      let newOwnerOfToken1 = await this.contract.ownerOf(1);
      assert.equal(newOwnerOfToken1, account_two, "New token owner does not match");
    });
  });

  describe("have ownership properties", function () {
    before(async function () {
      this.contract = await ERC721MintableComplete.new(name, symbol, baseTokenURI, { from: account_one });
    });

    it("should fail when minting when address is not contract owner", async function () {
      let error = false;
      try {
        await this.contract.mint(account_two, 6, { from: account_two });
      } catch (err) {
        error = true;
      }
      assert.equal(error, true, "Should fail minting");
    });

    it("should return contract owner", async function () {
      let owner = await this.contract._owner.call();
      assert.equal(owner, account_one, "Contract owner does not match");
    });
  });
});
