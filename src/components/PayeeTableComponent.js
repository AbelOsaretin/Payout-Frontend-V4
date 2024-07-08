import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, parseUnits } from "ethers";
import { contractABI, contractAddress } from "../utils/ABI";
import "./styles.css";
import { useState } from "react"; // Import useState

export function PayeeTableComponent() {
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [payoutData, setPayoutData] = useState(null); // State to store payout data

  async function PayeeList() {
    try {
      // Fetch JSON data from an external source

      // const response = await fetch(
      //   "https://promptearn.com/adm/dataj/data35.php"
      // );

      const response = await fetch(
        "https://raw.githubusercontent.com/AbelOsaretin/Payout-Frontend-V3/main/src/data.json"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();
      setPayoutData(jsonData); // Update the payoutData state

      // Extract addresses and amounts from JSON and format using parseUints
      const addresses = jsonData.addresses;
      const amounts = jsonData.amounts;

      // Map over the amounts array and convert each element to a string
      const formattedAmounts = amounts.map((amount) =>
        parseUnits(amount.toString(), 6)
      );

      console.log("Address and amount", addresses, amounts);
    } catch (e) {
      console.log(e);
      // Display an error notification
      alert("An error occurred with payees list. Please try again.");
    }
  }

  return (
    <div className="component-container">
      <div className="payout-container">
        <p>Payees</p>

        <button className="all-buttons" onClick={PayeeList}>
          Get Payees
        </button>
        <br />
        {/* Display the payout data in a table if available */}
        {payoutData && (
          <div className="table-container">
            {" "}
            {/* Add a container for scrolling */}
            <table className="payout-table">
              <thead>
                <tr>
                  <th className="column-header">Address</th>
                  <th className="column-header">Amount</th>
                </tr>
              </thead>
              <tbody>
                {payoutData.addresses.map((address, index) => (
                  <tr key={index}>
                    <td className="column-data">
                      <div className="address-wrapper">{address}</div>
                    </td>
                    <td className="column-data">{payoutData.amounts[index]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
