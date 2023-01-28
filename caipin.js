const Web3 = require('web3');
const fetch = require('node-fetch');
const {checkImpermanentLoss} = require('./checkImpermanentLoss');
const config = require("./utils/config.json")
const contractABI = require("./utils/contractABI.json");
const uniswapv3PosManager = require("./utils/uniswapv3PosManager.json")
const privateKey = config.privateKey;
const LPPvtKey = config.LPPvtKey;
const contractAddress = config.contractAddress;
const id = config.id;
const tokenDAI = config.tokenDAI;
const tokenUSDC = config.tokenUSDC;
const uniswapV3PositionManager = config.uniswapV3PositionManager;
const ethHttpEndPoint = config.connectionURL;
let web3 = new Web3(new Web3.providers.HttpProvider(ethHttpEndPoint));
const { BigNumber } = require('bignumber.js')

const Q192 = BigNumber(2).exponentiatedBy(192)

function calculateSqrtPriceX96 (price, token0Dec, token1Dec) {
    price = BigNumber(price).shiftedBy(token1Dec - token0Dec)
    ratioX96 = price.multipliedBy(Q192)
    sqrtPriceX96 = ratioX96.sqrt()
    return sqrtPriceX96
}
// Script to call createAndInitializePoolIfNecessary from uniswap v3 positions manager contract
// incase deploying new pool token pool - for testing purposes
async function main(){
    try {
        let erc20Address = [tokenDAI,tokenUSDC];
        let pairFee = 3000;
        erc20Address = erc20Address.sort()
        console.log("erc20 sorted: ", erc20Address)
        let token0Dec = 6;
        let token1Dec = 18;
        let price = 1
        let sqrtPrice
        // Determine price based on token positions
        if(erc20Address[0] == tokenDAI){
          sqrtPrice = calculateSqrtPriceX96(price, token0Dec,token1Dec)
        }else{
          sqrtPrice = calculateSqrtPriceX96(1/price, token0Dec,token1Dec)
        }
        let sqrtPriceX96 = sqrtPrice;


        // const sqrtPrice = calculateSqrtPriceX96(1, token0Dec, token1Dec);
        console.log("sqrtPrice: ",sqrtPriceX96, sqrtPriceX96.toNumber());
        const {address: admin} = web3.eth.accounts.wallet.add(LPPvtKey);

        const contractInstance = new web3.eth.Contract(uniswapv3PosManager, uniswapV3PositionManager);
        const trxn = contractInstance.methods.createAndInitializePoolIfNecessary(erc20Address[0], erc20Address[1], pairFee, sqrtPriceX96);
        const [gasPrice, gasCost] = await Promise.all([
            web3.eth.getGasPrice(),
            trxn.estimateGas({from: admin})
        ]);
        
        console.log("gas cost & price: ", gasPrice, gasCost, " = ", gasPrice*gasCost, gasPrice*gasCost/1000000000000000000)
        const data = trxn.encodeABI();

        const txData = {
            from: admin,
            to: uniswapV3PositionManager,
            data,
            gas: gasCost,
            gasPrice
        };
        const receipt = await web3.eth.sendTransaction(txData);
        console.log("Trxn Hash: ", receipt.transactionHash);

        console.log("Successfully exited from position");
    } catch (error) {
        console.log("Error in exitPosition : ", error);
    }
}



main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
