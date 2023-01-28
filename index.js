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


const exitPosition = async () => {
    try {
        const {address: admin} = web3.eth.accounts.wallet.add(privateKey);

        const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
        const trxn = contractInstance.methods.exitLiquidity(id);
        const [gasPrice, gasCost] = await Promise.all([
            web3.eth.getGasPrice(),
            trxn.estimateGas({from: admin})
        ]);
        const data = trxn.encodeABI();
        const txData = {
            from: admin,
            to: contractAddress,
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


async function main() {
    console.log("monitoring service started");
    var monitoringService = setInterval(async() => {
        console.log("interval started");
        const loss = await checkImpermanentLoss();
        console.log("loss recieved: ", loss)
        if (loss <= 0.5) {
            console.log("exiting position")
            await exitPosition();
            clearInterval(monitoringService);
            console.log("Position exit done");
        }
    }, 5000);

}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
