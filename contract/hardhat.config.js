// hardhat.config.js
require("dotenv/config")
require("@nomiclabs/hardhat-etherscan")

require("hardhat-abi-exporter")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("hardhat-gas-reporter")
require("hardhat-spdx-license-identifier")
require("hardhat-watcher")
require("solidity-coverage")
require("@nomicfoundation/hardhat-toolbox");
const { task } = require("hardhat/config")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

const { removeConsoleLog } = require("hardhat-preprocessor")

const accounts = {
  mnemonic: ""
}

module.exports = {
  abiExporter: {
    path: "./build/abi",
    //clear: true,
    flat: true,
    // only: [],
    // except: []
  },
  defaultNetwork: "hardhat",
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey:{
      //ethereum
      mainnet: 'H2EPP8FBXTDEDAAN93Z4975HU6FZYSFQY8',
      ropsten: 'H2EPP8FBXTDEDAAN93Z4975HU6FZYSFQY8',
      rinkeby: 'H2EPP8FBXTDEDAAN93Z4975HU6FZYSFQY8',
      goerli: 'H2EPP8FBXTDEDAAN93Z4975HU6FZYSFQY8',
      kovan: 'H2EPP8FBXTDEDAAN93Z4975HU6FZYSFQY8',
      sepolia: 'H2EPP8FBXTDEDAAN93Z4975HU6FZYSFQY8',

      //polygon
      polygon: 'NHKRRX8TVHS6W918QJQVGK99TRWKU5FERQ',
      polygonMumbai: 'NHKRRX8TVHS6W918QJQVGK99TRWKU5FERQ',
    }, ////'82I9WI5C9SVS9E85HJKRUQFUGVRFI2K7XH'//process.env.ETHERSCAN_API_KEY
    customChains: []  
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    excludeContracts: ["contracts/mocks/", "contracts/libraries/"],
  },
  hardhat: {
    forking: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
      accounts,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/d936a575133e4dea8714cc109056237c`,
      accounts,
      from: "",
      chainId: 1,
      live: true,
      saveDeployments: true,
      tags: ["mainnet"],
      gasPrice: 20000000000,
      gasMultiplier: 5,
      timeout : 200000
    },
    goerli: {
        url: `https://goerli.infura.io/v3/d936a575133e4dea8714cc109056237c`,
        accounts: [""], //add private key in this
        chainId: 5,
        live: true,
        saveDeployments: true,
        tags: ["staging"],
        gasPrice: 20000000000,
        gasMultiplier: 2,
      },
    mumbai: {
        url: `https://rpc-mumbai.maticvigil.com/`,
        accounts: [""], //add private key in this
        chainId: 80001,
        live: true,
        saveDeployments: true,
        tags: ["staging"],
        gasPrice: 20000000000,
        gasMultiplier: 2,
      },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/d936a575133e4dea8714cc109056237c`,
      accounts,
      from: "",
      chainId: 4,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasPrice: 20000000000,
      gasMultiplier: 2,
    }
  },
  preprocess: {
    eachLine: removeConsoleLog(bre => bre.network.name !== "hardhat" && bre.network.name !== "localhost"),
  },
  solidity: {
    compilers: [
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.7.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },      
      {
        version: "0.7.5",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.1",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.2",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ],

  },
  spdxLicenseIdentifier: {
    overwrite: false,
    runOnCompile: true,
  },
  watcher: {
    compile: {
      tasks: ["compile"],
      files: ["./contracts"],
      verbose: true,
    },
  },
}
