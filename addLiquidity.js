const Web3 = require('web3');
const fetch = require('node-fetch');
const {checkImpermanentLoss} = require('./checkImpermanentLoss');
const config = require("./utils/config.json")
const contractABI = require("./utils/contractABI.json");
const uniswapv3PosManager = require("./utils/uniswapv3PosManager.json")
const uniswapv3factory = require("./utils/uniswapv3factory.json")
const poolAbi = require("./utils/poolAbi.json")
const privateKey = config.privateKey;
const LPPvtKey = config.LPPvtKey;
const tokenDAI = config.tokenDAI;
const tokenUSDC = config.tokenUSDC;
const contractAddress = config.contractAddress;
const id = config.id;
const uniswapV3PositionManager = config.uniswapV3PositionManager;
const uniswapV3Factory = config.uniswapV3Factory;
const ethHttpEndPoint = config.connectionURL;
let web3 = new Web3(new Web3.providers.HttpProvider(ethHttpEndPoint));
const { BigNumber } = require('bignumber.js')

const Q192 = BigNumber(2).exponentiatedBy(192)



function getNearestUsableTick(currentTick,space) {
    // 0 is always a valid tick
    if(currentTick == 0){
        return 0
    }
    // Determines direction
    direction = (currentTick >= 0) ? 1 : -1
    // Changes direction
    currentTick *= direction
    // Calculates nearest tick based on how close the current tick remainder is to space / 2
    nearestTick = (currentTick%space <= space/2) ? currentTick - (currentTick%space) : currentTick + (space-(currentTick%space))
    // Changes direction back
    nearestTick *= direction
    
    return nearestTick
}
async function main(){
    try {
        let erc20Address = [tokenDAI,tokenUSDC];
        let pairFee = 3000;

        let token0Dec = 6;
        let token1Dec = 18;
        // let price = 1/50;
        const {address: admin} = web3.eth.accounts.wallet.add(LPPvtKey);

        const contractInstance = new web3.eth.Contract(uniswapv3factory, uniswapV3Factory);
        const deployedPairAddress = await contractInstance.methods.getPool(erc20Address[0], erc20Address[1], pairFee).call();
        const deployedPairContract = new web3.eth.Contract(poolAbi, deployedPairAddress);
        
        let slot0 = await deployedPairContract.methods.slot0().call()
        let tickSpacing = parseInt(await deployedPairContract.methods.tickSpacing().call())

        console.log("slot0 & tickSpacing: ", slot0, tickSpacing)
        // Get correct token order for deployed contract pair
        let token0 = await deployedPairContract.methods.token0().call()
        let token1 = await deployedPairContract.methods.token1().call()
        let nearestTick = getNearestUsableTick(parseInt(slot0.tick),tickSpacing)

        let tick_lower = nearestTick - tickSpacing * 10;
        let tick_upper = nearestTick + tickSpacing * 10;

        console.log("nearest tick: ", nearestTick, tick_lower, "-", tick_upper)
        // minting NFT and adding liquidity
        let params = {
            token0: token0,
            token1: token1,
            fee: pairFee,
            tickLower: tick_lower,
            tickUpper: tick_upper,
            amount0Desired: BigNumber(500).shiftedBy(token0Dec).toFixed(0),
            amount1Desired: BigNumber(500).shiftedBy(token1Dec).toFixed(0),
            amount0Min: 0,
            amount1Min: 0,
            recipient: admin,
            deadline: Math.floor(Date.now() / 1000) + 20
          }
      
          const uniswapV3PositionManagerInstance = new web3.eth.Contract(uniswapv3PosManager, uniswapV3PositionManager);

         const trxn = uniswapV3PositionManagerInstance.methods.mint(params)
        const [gasPrice, gasCost] = await Promise.all([
            web3.eth.getGasPrice(),
            trxn.estimateGas({from: admin})
        ]);
        
        // console.log("gas cost & price: ", gasPrice, gasCost, " = ", gasPrice*gasCost, gasPrice*gasCost/1000000000000000000)
        const data = trxn.encodeABI();


        const txData = {
            from: admin,
            to: uniswapV3PositionManager,
            data,
            gas: gasCost,
            gasPrice
        };
        const receipt = await web3.eth.sendTransaction(txData); //trxn send
        console.log("Trxn Hash: ", receipt.transactionHash);

        // getting NFT tokenId from the logs to approve it for our exitliquidity contract
        let obj = receipt.logs.find(o => o.data === '0x');
        console.log("obj: ",web3.utils.hexToNumber(obj.topics[3]))
        const tokenId = await web3.utils.hexToNumber(obj.topics[3]);
        console.log("tokenId: ",tokenId)

        //approving tokenId for our ExitLiquidity contractAddress
        const approveTrxn = uniswapV3PositionManagerInstance.methods.approve(contractAddress, tokenId)
        const approveData = approveTrxn.encodeABI();
        const aproveGasCost = await trxn.estimateGas({from: admin});

        const approveTxData = {
            from: admin,
            to: uniswapV3PositionManager,
            data: approveData,
            gas: aproveGasCost,
            gasPrice
        };
        const approveReceipt = await web3.eth.sendTransaction(approveTxData);
        console.log("Approve Trxn Hash: ", approveReceipt.transactionHash);
        console.log("Successfully exited from position");
    } catch (error) {
        console.log("Error in exitPosition : ", error);
    }
}



main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
