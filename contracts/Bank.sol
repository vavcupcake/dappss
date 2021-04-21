// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract Bank {

  mapping (address => uint) balances;

  function deposit() public payable {
  	require(msg.value > 0, "Amount not valid");
    balances[msg.sender] += msg.value;
  }

  function withdraw(uint amount) public {
  	require(balances[msg.sender] >= amount, "Balance not enough");
    balances[msg.sender] -= amount;
    msg.sender.transfer(amount);
  }

  function get() public returns(uint) {
    return balances[msg.sender];
  }

}
