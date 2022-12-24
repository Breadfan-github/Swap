// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import './HINtoken.sol';

contract ETHswap {
	string public name = 'ETHswap';
	HINtoken public token;
	uint public rate = 100;
	address payable public user;

	//event = a function to subsribe/listen to blockchain events giving u access to transaction
	//history, logs
	event tokenPurchased(
		address account,
		//who purchased
		address token,
		//address of the token (what token was purchased)
		uint amount,
		uint rate
);
	event tokenSold(
		address account,
		//who sold
		address token,
		//address of the token (what token was purchased)
		uint amount,
		uint rate
);

	constructor(HINtoken _token) {
		token = _token;
		user = payable(msg.sender);
	}

	function buyTokens() public payable {
		uint tokenAmount = msg.value * rate;
		require(token.balanceOf(address(this)) >= tokenAmount);
		token.transfer(msg.sender, tokenAmount);
		emit tokenPurchased(msg.sender, address(token), tokenAmount, rate);
	}

	function sellTokens(uint _amount) public payable{
		require(token.balanceOf(msg.sender) >= _amount);
		uint etherAmount = _amount / rate;
		require(address(this).balance >= etherAmount);

		token.transferFrom(msg.sender, address(this), _amount);
		user.transfer(etherAmount);
		
		emit tokenPurchased(msg.sender, address(token), _amount, rate);




	}
}