// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LPToken is ERC20 {
    address owner;

    constructor(address _addr) ERC20("Liquidity Token", "LDT") {
        owner = msg.sender;
        _mint(_addr, 2000000e18);
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "no permission!");
        _;
    }

    function transferFromContract(address _to, uint256 amount) external onlyOwner {
        uint bal = balanceOf(address(this));
        // require(bal >= amount, "You are transferring more than the amount available!");
        assert(bal >= amount);
        _transfer(address(this), _to, amount);
    }

    function mint(uint _amount) external onlyOwner {
        _mint(msg.sender, _amount);
    }
}