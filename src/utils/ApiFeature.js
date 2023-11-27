import {ethers}  from "ethers";
import Web3Modal from 'web3modal';
import {ChatAppAddress,ChatAppABI} from '../context/Constants';

const { ethereum } = window;

export const CheckIfWalletConnected = async() => {
    try {
        if(!ethereum) return alert('Install Ethereum or Metamask');

        //Making request to metamask
        const accounts = await window.ethereum.request({
            method:"eth_accounts",
        });
        
        const firstAccount = accounts[0];
        return firstAccount;
    } 
    catch (error) {
        console.log("Install Metamask");
    }
}

export const connectWallet = async()=>{
    try {
        if(!ethereum) return alert('Install Ethereum or Metamask');

        //Making request to metamask
        const accounts = await window.ethereum.request({
            method:"eth_requestAccounts",
        });
        
        const firstAccount = accounts[0];
        return firstAccount;
    } 
    catch (error) {
        console.log("Install Metamask");
    }
}

const fetchContract = (signerOrProvider)=> new ethers.Contract(ChatAppABI,ChatAppAddress,signerOrProvider);

export const connectingWithContract = async()=>{
    try {
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);

        return contract;
    } 
    catch (error) {
        console.log(error);
    }
}

export const convertTime = (time)=>{
    const newTime = new Date(time.toNumber());

    const realTime = newTime.getHours() + "/" + newTime.getMinutes() + "/" + newTime.getSeconds() + " Date : " + newTime.getDate() + "/" + (newTime.getMonth() + 1) + "/" + newTime.getFullYear() ;
    return realTime;
}
