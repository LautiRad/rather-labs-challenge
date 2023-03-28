import { useState, useEffect } from "react";
import Web3 from "web3";
import QUIZ_ABI from "../../utils/web3/QuizTokenABI.json";

function QuizBalance({
  web3,
  account,
}: {
  web3: Web3 | null;
  account: string | null;
}) {
  const [balance, setBalance] = useState<number | null>(null);
  const contractAddress = "0x437eF217203452317C3C955Cf282b1eE5F6aaF72";

  useEffect(() => {
    async function updateBalance() {
      if (!web3 || !account) {
        setBalance(null);
        return;
      }

      const contract = new web3.eth.Contract(QUIZ_ABI as any, contractAddress);

      const balance = await contract.methods.balanceOf(account).call();
      setBalance(balance);
    }

    updateBalance();
  }, [web3, account]);

  return balance;
}

export default QuizBalance;
