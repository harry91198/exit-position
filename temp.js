const Web3 = require('web3');
const fetch = require('node-fetch');
const {checkImpermanentLoss} = require('./checkImpermanentLoss');
const config = require("./utils/config.json")
const contractABI = require("./utils/contractABI.json");
const privateKey = config.privateKey;
const contractAddress = config.contractAddress;
const id = config.id;
const ethHttpEndPoint = config.connectionURL;
let web3 = new Web3(new Web3.providers.HttpProvider(ethHttpEndPoint));
const { BigNumber } = require('bignumber.js')

const Q192 = BigNumber(2).exponentiatedBy(192)

async function main(){
    try {
        // let erc20Address = ["0x27Ba4F938a90d06Caa42c111f6189b9182204039", "0x4a8283A01Ae2e5Ac99cf533fa4c4A97e8d277A12"]
        // erc20Address = erc20Address.sort()
        // console.log("erc20 sorted: ", erc20Address)
        // let price = 50
        // let sqrtPrice
        // // Determine price based on token positions
        // if(erc20Address[0] == "0x27Ba4F938a90d06Caa42c111f6189b9182204039"){
        //   sqrtPrice = calculateSqrtPriceX96(price, decimals,decimals)
        // }else{
        //   sqrtPrice = calculateSqrtPriceX96(1/price, decimals,decimals)
        // }
        // let sqrtPriceX96 = sqrtPrice;
 
        // let ratioX96 = BigNumber(sqrtPriceX96).exponentiatedBy(2)
        // //Get token0 by dividing ratioX96 / Q192 and shifting decimal 
        // //values of the coins to put in human readable format.
        // let sqrtPriceprice = ratioX96.dividedBy(Q192)
        // sqrtPriceprice = sqrtPriceprice.shiftedBy(token0Dec - token1Dec)
        // let token0Dec = 6;
        // let token1Dec = 18;
        // let price = 1/50;
        // price = BigNumber(price).shiftedBy(token1Dec - token0Dec)
        // ratioX96 = price.multipliedBy(Q192)
        // sqrtPriceX96 = ratioX96.sqrt()

        // console.log("sqrtPrice: ",sqrtPriceX96.toNumber() * Math.pow(10,34));
        // const {address: admin} = web3.eth.accounts.wallet.add(privateKey);

        // const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
        // const trxn = contractInstance.methods.mintNewPosition();
        // const [gasPrice, gasCost] = await Promise.all([
        //     web3.eth.getGasPrice(),
        //     trxn.estimateGas({from: admin})
        // ]);
        
        // console.log("gas cost & price: ", gasPrice, gasCost, " = ", gasPrice*gasCost, gasPrice*gasCost/1000000000000000000)
        // const data = trxn.encodeABI();

        // var resultGasPrice = await web3.eth.getGasPrice();
        // var result = await web3.eth.estimateGas({
        //     to: contractAddress, 
        //     data: data
        //  });
        // console.log("gas cost & price: ", resultGasPrice, result, " = ", resultGasPrice*result, resultGasPrice*result/1000000000000000000)

        // const txData = {
        //     from: admin,
        //     to: contractAddress,
        //     data,
        //     gas: gasCost,
        //     gasPrice
        // };
        // const receipt = await web3.eth.sendTransaction(txData);
        // console.log("Trxn Hash: ", receipt.transactionHash);

        console.log("Successfully exited from position");
    } catch (error) {
        console.log("Error in exitPosition : ", error);
    }
}



main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
// main()
//     .then(() => process.exit(0))
//     .catch(error => {
//         console.error(error);
//         process.exit(1);
//     });