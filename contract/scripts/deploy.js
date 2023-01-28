const fs = require('fs');
const {ethers} = require("hardhat");
let config = require("../../utils/config.json");
const fileName = '../utils/config.json';
async function main() {
    console.log("start deploy....");

    const ExitLiquidity = await ethers.getContractFactory("ExitLiquidity");
    const exitLiquidity = await ExitLiquidity.deploy()
    await exitLiquidity.deployed();

    console.log("Exit Pool Uniswap contract deployed: ", exitLiquidity.address);

    config.contractAddress = exitLiquidity.address;
    fs.writeFileSync(fileName, JSON.stringify(config, null, 2), function writeJSON(err) {
        if (err) return console.log(err);
        console.log(JSON.stringify(config));
        console.log('writing to ' + fileName);
      });
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });