import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, parseUnits } from "ethers";
import { contractABI, contractAddress } from "../utils/ABI";
import "./styles.css";

export function PayoutComponent() {
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  async function sendPayout() {
    if (!isConnected) throw Error("User disconnected");
    const provider = new BrowserProvider(walletProvider);
    const signer = await provider.getSigner();

    try {
      // Fetch JSON data from an external source
      const response = await fetch(
        "https://promptearn.com/adm/dataj/data35.json"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();

      // Extract addresses and amounts from JSON
      const addresses = jsonData.addresses;
      const amounts = jsonData.amounts;
      console.log("Address and amount", addresses, amounts);

      try {
        const contract = new Contract(contractAddress, contractABI, signer);
        // const formattedDeposit = new ethers.parseUnits(`${newDeposit}`, "6");
        const transaction = await contract.sendUSDC(addresses, amounts);
        await transaction.wait();
        console.log("Payout Transaction Successful!", transaction);

        // Display a notification after successful transaction
        alert("Payout Transaction Successful!"); // You can use a more sophisticated notification library here
      } catch (error) {
        console.log(error);
        // Display an error notification
        alert("Payout failed. Please try again.");
      }
    } catch (e) {
      console.log(e);
      // Display an error notification
      alert("An error occurred. Please try again.");
    }
  }
  return (
    <div>
      <p>Send Payout to Payees</p>
      <button className="all-buttons" onClick={sendPayout}>
        Send Payout
      </button>
    </div>
  );
}
