import Web3 from "web3";
import abi from "../contracts/index.json";
import { config } from "../config";

export const web3 = new Web3(config.provider);
export const contract = new web3.eth.Contract(abi, config.contractAddress);

export const getAccountBalance = (address) => web3.eth.getBalance(address);
export const getTokenBalance = (address) =>
  contract.methods.balanceOf(address).call();
export const getTokenSymbol = () => contract.methods.symbol().call();
export const getTokenDecimal = () => contract.methods.decimals().call();
export const getGasPrice = () =>
  web3.eth.getGasPrice().then((gas) => {
    const price = web3.utils.fromWei(gas, "Gwei");
    return +price;
  });
export const isAddress = (address) => web3.utils.isAddress(address);
export const toBN = (value) => web3.utils.toBN(value).toNumber();
