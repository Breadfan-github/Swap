const ETHswap = artifacts.require("ETHswap");
const HINtoken = artifacts.require("HINtoken");

require ('chai')
.use(require('chai-as-promised'))
.should()

contract('ETHswap', ([deployer, investor]) => {
	let token 
	let swap 

	function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

	before(async() => {
		token = await HINtoken.new()
		swap = await ETHswap.new(token.address)
		await token.transfer(swap.address, tokens('1000000'))
	})

	describe('Token deployment', async () => {
		it('has a name', async() =>{
			const name = await token.name()
			assert.equal(name, 'HIN token')
		})
	})

	describe('ETHswap deployment', async () => {
		it('has a name', async() =>{
			const name = await swap.name()
			assert.equal(name, 'ETHswap')
		})
		it('contract has tokens', async () => {
			const balance = await token.balanceOf(swap.address)
			assert.equal(balance.toString(), tokens('1000000'))
		})
	})

	describe('Buy Tokens', async () =>{

		let result

		before(async () => {
			result = await swap.buyTokens({ from: investor, value: web3.utils.toWei('1', 'ether')})
		})

		it('allows users to buy tokens instantly from ethswap', async() => {
			
			let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'))

            let swapBalance 

            //check HIN token balance in swap contract
            swapBalance = await token.balanceOf(swap.address)
            assert.equal(swapBalance.toString(), tokens('999900'))

            //check eth balance in swap contract went up
            swapBalance = await web3.eth.getBalance(swap.address)
            assert.equal(swapBalance.toString(), tokens('1'))

            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100'))
            assert.equal(event.rate.toString(), '100')

		})

	})

	describe('Sell tokens', async () =>{

		let result

		before(async () => {
			await token.approve(swap.address, tokens('100'), {from: investor})
			result = await swap.sellTokens(tokens('100'), {from: investor})
		})

		it('allows users to sell tokens instantly to ethswap', async() => {
			let investorBalance = await token.balanceOf(investor)
			assert.equal(investorBalance.toString(), tokens('0'))

			let swapBalance = await web3.eth.getBalance(swap.address)
            assert.equal(swapBalance.toString(), tokens('0'))

            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100'))
            assert.equal(event.rate.toString(), '100')

            //investor cant sell more tokens than they have
            await swap.sellTokens(tokens('500'), {from: investor}).should.be.rejected;
            

	
		})
	})







})