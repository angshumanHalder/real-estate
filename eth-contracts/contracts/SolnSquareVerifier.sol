// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./ERC721Mintable.sol";
import "./verifier.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class

// TODO define a solutions struct that can hold an index & an address

// TODO define an array of the above struct

// TODO define a mapping to store unique solutions submitted

// TODO Create an event to emit when a solution is added

// TODO Create a function to add the solutions to the array and emit the event

// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly

contract SolnSquareVerifier is CustomERC721Token {
    Verifier verifierCont;

    struct Solution {
        uint256[2] a;
        uint256[2][2] b;
        uint256[2] c;
        uint256[2] input;
        address to;
        uint256 tokenId;
        bool used;
    }

    mapping(uint256 => Solution) solutions;

    mapping(bytes32 => bool) existingSolutions;

    event SolutionAdded(address owner);

    constructor(
        address verifierAddress,
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) public CustomERC721Token(name, symbol, baseTokenURI) {
        verifierCont = Verifier(verifierAddress);
    }

    function addSolution(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input,
        address to,
        uint256 tokenId
    ) public {
        bytes32 key = keccak256(abi.encodePacked(a, b, c, input, to, tokenId));

        bool exist = existingSolutions[key];
        require(!exist, "The solution exists");

        Solution memory sol = Solution(a, b, c, input, to, tokenId, true);
        Pairing.G1Point memory point_a = Pairing.G1Point(sol.a[0], sol.a[1]);
        Pairing.G2Point memory point_b = Pairing.G2Point(sol.b[0], sol.b[1]);
        Pairing.G1Point memory point_c = Pairing.G1Point(sol.c[0], sol.c[1]);
        Verifier.Proof memory proof = Verifier.Proof(point_a, point_b, point_c);

        bool verified = verifierCont.verifyTx(proof, input);

        require(verified, "Should be a valid proof");
        solutions[tokenId] = sol;
        existingSolutions[key] = true;
        emit SolutionAdded(msg.sender);
    }

    function mintVerify(address to, uint256 tokenId) public returns (bool) {
        Solution memory sol = solutions[tokenId];
        if (sol.used != true) {
            return super.mint(to, tokenId);
        }
        return false;
    }
}
