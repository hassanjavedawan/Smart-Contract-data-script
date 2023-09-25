// node scripts/update_debt.js

const fs = require('fs');
const readline = require('readline');
const ethers = require('ethers');
const log = console.log;
const loge = console.log;
require('dotenv').config();

const IS_TESTNET = true;
const CONTRACT_ADDRESS = '0x000000000000000000000000000000000';

const Web3 = require('web3');
const rootDir = process.cwd() + '/abis';
const contractAbi = require(`${rootDir}/nft.json`);
const web3ProviderHttpsMainnet = process.env.BSC_WEB3_PROVIDER_MAINNET_HTTPS;
const web3Mainnet = new Web3(new Web3.providers.HttpProvider(web3ProviderHttpsMainnet));
const web3ProviderHttpsTestnet = process.env.BSC_WEB3_PROVIDER_TESTNET_HTTPS;
const web3Testnet = new Web3(new Web3.providers.HttpProvider(web3ProviderHttpsTestnet));
const bscScanTestnet = 'https://testnet.bscscan.com/tx';
const bscScanMainnet = 'https://bscscan.com/tx';
let web3, bscScan;
if (IS_TESTNET) {
  web3 = web3Testnet;
  bscScan = bscScanTestnet;
} else {
  web3 = web3Mainnet;
  bscScan = bscScanMainnet;
}

const toWei = (value, unit = 'ether') => {
  return web3.utils.toWei(value, unit)
}

const fromWei = (value, unit = 'ether') => {
  return web3.utils.fromWei(value, unit)
}

const processContract = async () => {
  // Init contract instance
  const contractInstance = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);

  const totalNfts = await contractInstance.methods.totalNFTs().call()
  console.log(totalNfts)

  for (let j = 0; j < Number(totalNfts); j++) {
    const id = j+1
    const hashInfo = await contractInstance.methods.hashInfo(id).call()
    const owner = await contractInstance.methods.ownerOf(id).call()
    console.log('NFT: ' + id, "hash type: " + hashInfo.hashType === "0"? "Neon": hashInfo.hashType === "1"? "Gold": "Silver ", "HashRate " + hashInfo.hashRate, "Owner " + owner)
  }
}

processContract().then(() => {
  log('DONE');
});
