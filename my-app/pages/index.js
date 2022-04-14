import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { useState, useRef, useEffect } from "react";

import { Contract, providers } from "ethers";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";
// import { walletconnect } from "web3modal/dist/providers/connectors";
export default function Home() {
  const[numberOfWhitelisted,setNumberOfWhitelisted] =useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist,setJoinedWhitelist] =useState(false);
  const [loading,setLoading] =useState(false);
  const web3ModalRef =useRef();
  //now we need to make provider or singner for wallet connect

  const getProviderOrSigner = async(needSigner= false) => {
    try {
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);
      const {chainId} = await web3Provider.getNetwork();
      if(chainId !==4){
        window.alert("change the network to rinkeny ");
        throw new error("Change to rinkeby");
      }
      if(needSigner){
        const signer = web3Provider.getSigner();
        return signer;
      }
      return web3Provider;
    } catch (err) {
      console.error(err);
    }
  }

  const addAddressToWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract =new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
      
    } catch (err) {
      console.error(err);
      
    }
  }

  //now second funciton check address is whitelisted or not

  const checkIfAddressIsWhitelisted = async() =>{
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const address = await signer.getAddress();
      const _joinedWhitelist = await whitelistContract.WhitelistedAddresses(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (error) {
     console.error(error); 
    }
  };
  const getNumberOfWhitelisted = async() =>{
    try {
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      const _numOfWhitelisted=
      await whitelistContract.numAddressesWhitelisted();
          setNumberOfWhitelisted(_numOfWhitelisted);
    } catch (error) {
      console.error(error);
    }
  }
  const renderButton =() =>{
    if(walletConnected){
      if(joinedWhitelist){
        return(
          <div className="styles description">Thanks for whitelist</div>
        );
      }else if(loading){
        return (
          <button className={styles.button}>
            Loading
          </button>
        );
        
      }
      else {
        return(
          <button onClick={addAddressToWhitelist} className={styles.button}>
          join the Whitelist
          </button>
        );
      }
    }
    else{
      <button onClick={ConnectWallet} className={styles.button}>
        Connect your wallat
      </button>
    }



  }


  const ConnectWallet = async() =>{
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressIsWhitelisted();
      getNumberOfWhitelisted();
      
    } catch (error) {
      console.error(error);
      
    }
    
  }
  useEffect(()=>{
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if(!walletConnected){
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions : {},
        disabledInjectedProvider: false
      });
      ConnectWallet();
    }
  },[walletConnected]);
  
  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numberOfWhitelisted} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>
      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
     
    </div>
  );
}
