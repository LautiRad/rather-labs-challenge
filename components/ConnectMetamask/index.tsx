import React, { useState, useContext } from "react";
import { Button } from "antd";
import Web3 from "web3";
import Trivia from "../Trivia";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import QuizBalance from "../QuizBalance";

const inter = Inter({ subsets: ["latin"] });
interface CustomWindow extends Window {
  ethereum?: any;
}

const ConnectMetamask = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      if (
        typeof window !== "undefined" &&
        (window as CustomWindow).ethereum !== undefined
      ) {
        const newWeb3 = web3 || new Web3((window as CustomWindow).ethereum);

        await (window as CustomWindow).ethereum.request({
          method: "eth_requestAccounts",
        });
        const chainId = await newWeb3.eth.getChainId();
        if (chainId !== 5) {
          const networkName = chainId === 1 ? "Goerli Testnet" : "Mainnet";
          const result = window.confirm(
            `Please switch to the ${networkName} network to continue. | Por Favor cambia a la red ${networkName} para continuar.`
          );
          if (result) {
            await (window as CustomWindow).ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x5" }],
            });
          }
        }
        setWeb3(newWeb3);
        const accounts = await newWeb3.eth.getAccounts();
        setAccount(accounts[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDisconnect = () => {
    try {
      if (
        typeof web3 !== "undefined" &&
        web3 &&
        web3.currentProvider !== null &&
        typeof web3.currentProvider !== "string"
      ) {
        const provider = web3.currentProvider;
        if ("disconnect" in provider) {
          provider.disconnect();
        }
      }
      setWeb3(null);
      setAccount(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {account ? (
        <div>
          <div className={styles.center}>
            <Button type="primary" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>
          <div className={styles.center}>
            <QuizBalance web3={web3} account={account} />
          </div>
          <Trivia />
        </div>
      ) : (
        <div>
          <div className={styles.center}>
            <Button type="primary" onClick={handleConnect}>
              Connect Wallet
            </Button>
          </div>
          <h1 className={inter.className}>
            Connect your Metamask Wallet to start
          </h1>
        </div>
      )}
    </div>
  );
};

export default ConnectMetamask;
