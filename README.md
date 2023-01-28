# exit-position
 IL monitoring service which exits a particular position if loss more than 50%
//change config
//change hardhat.config

IL Montioring serice

Contract and scripts are present in contract folder

index.js is main service which should be run by `node index.js`

two other scripts are also present for testing purposes
-caipin: In case you want to create a new pool and initialize it, run this script
-addLiquidity: this can add liquidity to the pool

Note: define token addresses and pvt key in config.json first
Also add required RPC URL, currently mumbai network has been set

ExitLiquidity.sol is the smart-contract wrapped around uniswap V3. 
it has deploy & verify scripts.
Commmand: 
`npm run deploy:exitLiquidity`
`npm run verify:exitLiquidity`

Note: define private key to deploy in hardhat.config.js under respective networks

Currently, it is configureed for mumbai(polygon) network. To change, define the required network in contract/package.json. (check scripts for deploy/verify:exitLiquidity)