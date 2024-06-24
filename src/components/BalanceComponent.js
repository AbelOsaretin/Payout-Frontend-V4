import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { contractABI, contractAddress } from "../utils/ABI";
import { useState } from "react"; // Import useState
import "./styles.css"; // Assuming styles.css is in the same directory

export function BalanceComponent() {
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [balance, setBalance] = useState(null); // Initialize balance as null

  async function getBalance() {
    if (!isConnected) throw Error("User disconnected");

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const USDTContract = new Contract(contractAddress, contractABI, signer);
    const Balance = await USDTContract.balance();

    setBalance(formatUnits(Balance, 6)); // Update the balance state
  }

  return (
    <div>
      <p>Current Balance: {balance ? balance : ""}</p>{" "}
      <button className="all-buttons" onClick={getBalance}>
        Get Balance
      </button>{" "}
    </div>
  );
}
