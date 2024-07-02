

import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, parseUnits } from "ethers";
import { contractABI, contractAddress } from "../utils/ABI";
import "./styles.css";
import { usdcContractABI, usdcContractAddress } from "../utils/usdcABI";

export function DepositComponent() {
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  async function addDeposit() {
    if (!isConnected) throw Error("User disconnected");
    const provider = new BrowserProvider(walletProvider);
    const signer = await provider.getSigner();

    try {
      const newDeposit = document.getElementById("depositAmount").value;
      console.log("New Deposit : ", newDeposit);
      const formattedDeposit = parseUnits(newDeposit, 6);
      console.log("Formatted Deposit : ", formattedDeposit);

      const allowanceContract = new Contract(
        contractAddress,
        contractABI,
        signer
      );
      const allowance = await allowanceContract.contractAllowance();

      console.log("Current Allowance : ", allowance);
      if (allowance < newDeposit) {
        const usdcContract = new Contract(
          usdcContractAddress,
          usdcContractABI,
          signer
        );
        const approveTransaction = await usdcContract.approve(
          contractAddress,
          formattedDeposit
        );
        await approveTransaction.wait();
        console.log("Allowance Approved!", approveTransaction);
      }

      const contract = new Contract(contractAddress, contractABI, signer);
      const transaction = await contract.deposit(formattedDeposit);
      await transaction.wait();
      // Display a notification after successful transaction
      alert("Deposit Transaction Successful!"); // You can use a more sophisticated notification library here
      console.log("Amount Deposited!", transaction);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="component-container">
      <div className="deposit-container">
        <label htmlFor="depositAmount">Enter Deposit Amount</label>
        <br />
        <input
          id="depositAmount"
          type="number"
          style={{
            width: "200px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <br />
        <button className="all-buttons" onClick={addDeposit}>
          Deposit
        </button>
      </div>
    </div>
  );
}
