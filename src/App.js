import "./App.css";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { BalanceComponent } from "./components/BalanceComponent.js";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import react-router-dom
import AdminDash from "./AdminDash.js";
import { useState } from "react";

import { DepositComponent } from "./components/DepositComponent.js";
import { PayoutComponent } from "./components/PayoutComponent.js";
import { PayeeTableComponent } from "./components/PayeeTableComponent.js";

///------------------ Wallet Connection Configuration --------------------------------

// 1. Get projectId
const projectId = process.env.REACT_APP_PROJECT_ID;

// 2. Set chains
const Mainnet = {
  chainId: 137,
  name: "Polygon POS",
  currency: "MATIC",
  explorerUrl: "https://polygonscan.com/",
  rpcUrl: process.env.REACT_APP_RPC_URL,
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
  chains: [Mainnet],
  projectId,
  enableAnalytics: false, // Optional - defaults to your Cloud configuration
});

///------------------ Wallet Connection Configuration End--------------------------------

function App() {
  const [showAdminDash, setShowAdminDash] = useState(false); // State for AdminDash visibility
  const handleAdminClick = () => {
    setShowAdminDash(!showAdminDash); // Toggle AdminDash visibility
  };
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          {" "}
          {/* Wrap everything in a column container */}
          <div>PayNow</div>
          <br />
          <w3m-button></w3m-button>
          <br />
          <w3m-network-button> </w3m-network-button>
          <br />
          <div className="column-container">
            <BalanceComponent />
            <DepositComponent />
          </div>
          <PayoutComponent />
          <PayeeTableComponent />
          <br />
          <button onClick={handleAdminClick}>Admin</button>{" "}
          {/* Button to toggle AdminDash */}
          {showAdminDash && ( // Show AdminDash only if showAdminDash is true
            <AdminDash />
          )}
          <Routes>
            {" "}
            {/* Define your routes */}
            <Route path="/AdminDash" element={<AdminDash />} />{" "}
            {/* Route for the new page */}
          </Routes>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
