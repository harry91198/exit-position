// const { ethers } = require("hardhat");
let config = require("../../utils/config.json");

async function verifyExitLiquidity() {
    try{
        await run("verify:verify", {
            constructorArguments: [],
            contract: "contracts/ExitLiquidity.sol:ExitLiquidity",
            address: config.contractAddress
          });
    } catch (err) {
        console.log("verifyFactory error: ", err)
    }
    
}

async function main() {
    console.log("start verify", config);

    await verifyExitLiquidity();

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });