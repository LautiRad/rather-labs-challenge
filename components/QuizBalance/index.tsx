import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import QUIZ_ABI from "../../utils/web3/QuizTokenABI.json";
import { Button } from "antd";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

function QuizBalance({
  web3,
  account,
}: {
  web3: Web3 | null;
  account: string | null;
}) {
  const [balance, setBalance] = useState<number | null>(null);
  const contractAddress = "0x437eF217203452317C3C955Cf282b1eE5F6aaF72";

  const updateBalance = useCallback(async () => {
    if (!web3 || !account) {
      setBalance(null);
      return;
    }

    const contract = new web3.eth.Contract(QUIZ_ABI as any, contractAddress);

    const quizBalance = await contract.methods.balanceOf(account).call();
    const decimals = 18;
    const balance = Math.round(quizBalance / 10 ** decimals);
    setBalance(balance);
  }, [web3, account, contractAddress]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);

  return (
    <div>
      <div className={inter.className}>
        <h2>$QUIZ Balance: {balance}</h2>
      </div>
      <div className={styles.center}>
        <Button onClick={updateBalance} type="primary">
          Refresh
        </Button>
      </div>
    </div>
  );
}

export default QuizBalance;
