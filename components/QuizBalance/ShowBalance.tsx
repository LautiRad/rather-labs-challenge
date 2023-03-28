import Web3 from "web3";
import QuizBalance from "./index";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

function ShowBalance({
  web3,
  account,
}: {
  web3: Web3 | null;
  account: string | null;
}) {
  const balance = QuizBalance({ web3, account });

  return <div className={inter.className}>$QUIZ Balance: {balance}</div>;
}

export default ShowBalance;
