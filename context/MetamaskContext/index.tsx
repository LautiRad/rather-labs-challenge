import { createContext, ReactNode, useEffect, useState } from "react";
import Web3 from "web3";

interface CustomWindow extends Window {
  ethereum?: any;
}

export type MetamaskContextType = {
  isConnected: boolean;
  web3: Web3 | null;
  account: string | null;
  connect: () => void;
  disconnect: () => void;
  handleDisconnect: () => void;
};

export const MetamaskContext = createContext<MetamaskContextType>({
  isConnected: false,
  web3: null,
  account: null,
  connect: () => {},
  disconnect: () => {},
  handleDisconnect: () => {},
});

type MetamaskProviderProps = {
  children: ReactNode;
};

export const MetamaskProvider = ({ children }: MetamaskProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    if (typeof (window as CustomWindow).ethereum !== "undefined") {
      const newWeb3 = new Web3((window as CustomWindow).ethereum);
      setWeb3(newWeb3);

      const updateAccount = (accounts: string[]) => {
        if (accounts.length > 0) {
          setIsConnected(true);
          setAccount(accounts[0]);
        } else {
          setIsConnected(false);
          setAccount(null);
        }
      };

      const handleAccountsChanged = (accounts: string[]) => {
        updateAccount(accounts);
      };

      const handleDisconnect = () => {
        setIsConnected(false);
        setAccount(null);
      };

      (window as CustomWindow).ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          updateAccount(accounts);
        });

      (window as CustomWindow).ethereum.on(
        "accountsChanged",
        handleAccountsChanged
      );

      (window as CustomWindow).ethereum.on("disconnect", handleDisconnect);
    }
  }, []);

  const connect = async (): Promise<void> => {
    try {
      await (window as CustomWindow).ethereum.request({
        method: "eth_requestAccounts",
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to connect to Metamask.");
    }
  };

  const disconnect = () => {
    if (
      (window as CustomWindow).ethereum &&
      (window as CustomWindow).ethereum.isConnected()
    ) {
      const provider = (window as CustomWindow).ethereum;
      try {
        if ("disconnect" in provider) {
          provider.disconnect();
        } else if ("close" in provider) {
          provider.close();
        }
        setIsConnected(false);
        setAccount(null);
        setWeb3(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWeb3(null);
    setAccount(null);
  };

  return (
    <MetamaskContext.Provider
      value={{
        web3,
        account,
        isConnected,
        connect,
        disconnect,
        handleDisconnect,
      }}
    >
      {children}
    </MetamaskContext.Provider>
  );
};
