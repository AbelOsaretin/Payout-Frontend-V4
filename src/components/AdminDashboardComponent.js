import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { contractABI, contractAddress } from "../utils/ABI";
import "./styles.css";
import { usdcContractABI, usdcContractAddress } from "../utils/usdcABI";

export function AdminDashboardComponent() {
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  async function withdrawDeposit() {
    if (!isConnected) throw Error("User disconnected");
    const provider = new BrowserProvider(walletProvider);
    const signer = await provider.getSigner();

    try {
      const newWithdrawalAddress =
        document.getElementById("withdrawAddress").value;
      console.log("Withdrawal Address : ", newWithdrawalAddress);
      const newWithdrawalAmount =
        document.getElementById("withdrawAmount").value;
      console.log("New Deposit : ", newWithdrawalAmount);
      const formattedWithdrawal = formatUnits(newWithdrawalAmount, 6);
      console.log("Formatted Withdrawal : ", formattedWithdrawal);

      const contract = new Contract(contractAddress, contractABI, signer);
      const transaction = await contract.withdraw(
        newWithdrawalAddress,
        formattedWithdrawal
      );
      await transaction.wait();
      console.log(
        `Amount Withdrawn to ${newWithdrawalAddress}: !", ${transaction}`
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <label for="withdrawAddress">Enter Receivers Address</label>
      <br />
      <input
        id="withdrawAddress"
        style={{
          width: "200px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      ></input>
      <br />
      <label for="withdrawAmount">Enter Withdrawal Amount</label>
      <br />
      <input
        id="withdrawAmount"
        type="number"
        style={{
          width: "200px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      ></input>
      <br />
      <button className="all-buttons" onClick={withdrawDeposit}>
        Withdraw
      </button>{" "}
    </div>
  );
}
