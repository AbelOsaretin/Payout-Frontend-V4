import logo from "./logo.svg";
import "./App.css";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { BrowserProvider, Contract, parseUnits } from "ethers";
import { contractABI, contractAddress } from "./utils/constants.js";
import { usdcContractABI } from "./utils/constantsToken.js";

///------------------ Wallet Connection Configuration --------------------------------

// 1. Get projectId
const projectId = "e1399140821c5499d4f45eadfddd74aa";

// 2. Set chains
const amoy = {
  chainId: 80002,
  name: "Amoy",
  currency: "MATIC",
  explorerUrl: "https://www.oklink.com/amoy",
  rpcUrl: "https://rpc-amoy.polygon.technology",
};

// 3. Create a metadata object
const metadata = {
  name: "My Website",
  description: "My Website description",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,
});

// 5. Create a Web3Modal instance
const modal = createWeb3Modal({
  ethersConfig,
  chains: [amoy],
  projectId,
  enableAnalytics: false, // Optional - defaults to your Cloud configuration
});

///------------------ Wallet Connection Configuration --------------------------------

///------------------Deposit Button---------------------------------------------------

async function Deposit() {
  const ethersProvider = new BrowserProvider(walletProvider);
  const signer = await ethersProvider.getSigner();
  try {
    const newDeposit = document.getElementById("depositAmount").value;
    const allowanceContract = new Contract(
      contractAddress,
      contractABI,
      signer
    );
    const allowance = await allowanceContract.contractAllowance();

    console.log("Current Allowance : ", allowance);
    if (allowance < newDeposit) {
      const usdcAddress = "0xba348090ee37c31ff447a556b59d733ad549d65a";
      const usdcContract = new Contract(usdcAddress, usdcContractABI, signer);
      const approveTransaction = await usdcContract.approve(
        contractAddress,
        newDeposit
      );
      await approveTransaction.wait();
      console.log("Allowance Approved!", approveTransaction);
    }

    // const formattedDeposit = parseUnits(`${newDeposit}`, "6");
    const contract = new Contract(contractAddress, contractABI, signer);
    const transaction = await contract.deposit(newDeposit);
    await transaction.wait();
    console.log("Amount Deposited!", transaction);
  } catch (error) {
    console.log(error);
  }
}

///------------------Deposit Button---------------------------------------------------

const walletProvider = modal.getWalletProvider();

///------------------Balance Button---------------------------------------------------
async function getBalance() {
  const ethersProvider = new BrowserProvider(walletProvider);
  const signer = await ethersProvider.getSigner();

  const contract = new Contract(contractAddress, contractABI, signer);
  const balance = await contract.balance();

  console.log("Current Balance : ", balance);

  const allowance = await contract.contractAllowance();

  console.log("Current Allowance : ", allowance);
}

///------------------Balance Button---------------------------------------------------

///------------------Payout Button---------------------------------------------------
async function PayoutV2() {
  const ethersProvider = new BrowserProvider(walletProvider);
  const signer = await ethersProvider.getSigner();

  // const jsonData = {
  //   addresses: [
  //     "0x2fd1AFA939eFD359a302D757740d6eC15b820bC2",
  //     "0x725b33A7d6344744bb1bAbbF8D11F204d018a586",
  //     "0xF7c371Ea75F648cC3070B3f538e0Bd68359FEDc2",
  //   ],
  //   amounts: [1000000, 4000000, 2000000],
  // };

  try {
    // Fetch JSON data from an external source
    const response = await fetch(
      "https://raw.githubusercontent.com/AbelOsaretin/Payout-Frontend-V3/main/src/data.json"
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
      console.log("Payout Transaction!", transaction);
    } catch (error) {
      console.log(error);
    }
  } catch (e) {
    console.log(e);
  }
}

///------------------Payout Button---------------------------------------------------

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>Sample Implementation</div>
        <br />
        {/* <w3m-button /> */}

        <w3m-button></w3m-button>
        <w3m-network-button> </w3m-network-button>

        <br />

        <label for="depositAmount">Enter Deposit Amount</label>
        <input id="depositAmount"></input>
        <button onClick={Deposit}>Deposit</button>
        <br />
        <label for="contractBalance">Contract Balance</label>
        <button onClick={getBalance}>Balance</button>
        <br />
        <h1> Payout </h1>

        <button onClick={PayoutV2}>Payout</button>
      </header>
    </div>
  );
}

export default App;
