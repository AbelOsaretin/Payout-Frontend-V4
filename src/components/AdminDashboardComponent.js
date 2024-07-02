import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, parseUnits } from "ethers";
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
      const formattedWithdrawal = parseUnits(newWithdrawalAmount, 6);
      console.log("Formatted Withdrawal : ", formattedWithdrawal);

      const contract = new Contract(contractAddress, contractABI, signer);
      const transaction = await contract.withdraw(
        newWithdrawalAddress,
        formattedWithdrawal
      );
      await transaction.wait();
      console.log(
        `Successfully Withdrawn ${formattedWithdrawal} to ${newWithdrawalAddress}"`
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function addAdminAddress() {
    if (!isConnected) throw Error("User disconnected");
    const provider = new BrowserProvider(walletProvider);
    const signer = await provider.getSigner();

    try {
      const newAddress = document.getElementById("addAdminAddress").value;
      console.log("New Admin Address : ", newAddress);

      const contract = new Contract(contractAddress, contractABI, signer);
      const transaction = await contract.addAdmin(newAddress);
      await transaction.wait();

      console.log(`Successfully added ${newAddress}`);
      alert(`Successfully added ${newAddress}`);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  }

  async function removeAdminAddress() {
    if (!isConnected) throw Error("User disconnected");
    const provider = new BrowserProvider(walletProvider);
    const signer = await provider.getSigner();

    try {
      const removeAddress = document.getElementById("removeAdminAddress").value;
      console.log("Removing Admin Address : ", removeAddress);

      const contract = new Contract(contractAddress, contractABI, signer);
      const transaction = await contract.removeAdmin(removeAddress);
      await transaction.wait();
      console.log(`Successfully Removed ${removeAddress}`);
      alert(`Successfully Removed ${removeAddress}`);
    } catch (error) {
      alert(error);
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
      <br />
      <h2>Add Admins</h2>
      <label for="addAdminAddress">Enter New Admin Address</label>
      <br />
      <input
        id="addAdminAddress"
        style={{
          width: "200px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      ></input>
      <br />
      <button className="all-buttons" onClick={addAdminAddress}>
        Add Admin
      </button>{" "}
      <br />
      <h2>Remove Admin</h2>
      <label for="removeAdminAddress">Enter Admin Address to Remove</label>
      <br />
      <input
        id="removeAdminAddress"
        style={{
          width: "200px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      ></input>
      <br />
      <button className="all-buttons" onClick={removeAdminAddress}>
        Remove Admin
      </button>{" "}
    </div>
  );
}
