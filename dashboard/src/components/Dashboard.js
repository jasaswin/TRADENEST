
// import React from "react";
// import { Route, Routes } from "react-router-dom";

// import Apps from "./Apps";
// import Funds from "./Funds";
// import Holdings from "./Holdings";

// import Orders from "./Orders";
// import Positions from "./Positions";
// import Summary from "./Summary";
// import WatchList from "./WatchList";
// import { GeneralContextProvider } from "./GeneralContext";

// const Dashboard = () => {
//   return (
//     <div className="dashboard-container">
//       <GeneralContextProvider>
//         <WatchList />
//       </GeneralContextProvider>
//       <div className="content">
//         <Routes>
//           <Route exact path="/" element={<Summary />} />
//           <Route path="/orders" element={<Orders />} />
//           <Route path="/holdings" element={<Holdings />} />
//           <Route path="/positions" element={<Positions />} />
//           <Route path="/funds" element={<Funds />} />
//           <Route path="/apps" element={<Apps />} />
//         </Routes>
//       </div>
//     </div>
//   );
// };


// const user = JSON.parse(localStorage.getItem("user"));
// const token = localStorage.getItem("token");

// if (!token || !user) {
//   window.location.href = "http://localhost:3001/signup";
// }


// export default Dashboard;




// import React, { useState, useEffect } from "react";
// import { Route, Routes } from "react-router-dom";

// import Apps from "./Apps";
// import Funds from "./Funds";
// import Holdings from "./Holdings";
// import Orders from "./Orders";
// import Positions from "./Positions";
// import Summary from "./Summary";
// import WatchList from "./WatchList";
// import { GeneralContextProvider } from "./GeneralContext";

// const Dashboard = () => {
//   const username = localStorage.getItem("username") || "Guest";

//   const [balance, setBalance] = useState(0);
//   const [equityValue, setEquityValue] = useState(0);
//   const [PL, setPL] = useState(0);

//   // ✅ Fetch live updates every 5 seconds
//   useEffect(() => {
//     const fetchUserSummary = async () => {
//       try {
//         const res = await fetch(`http://localhost:3002/user/${username}/summary`);
//         if (!res.ok) return;
//         const data = await res.json();
//         setBalance(data.balance || 0);
//         setEquityValue(data.equityValue || 0);
//         setPL(data.totalPL || 0);
//       } catch (err) {
//         console.error("Error fetching user summary:", err);
//       }
//     };

//     // Initial load
//     fetchUserSummary();

//     // Update every 5 seconds
//     const interval = setInterval(fetchUserSummary, 5000);
//     return () => clearInterval(interval);
//   }, [username]);

//   return (
//     <div className="dashboard-container">
//       {/* ✅ Top Summary Bar */}
//       <div className="dashboard-header" style={styles.header}>
//         <h2>Welcome, {username}</h2>
//         <div style={styles.stats}>
//           <p><strong>💰 Balance:</strong> ₹{balance.toLocaleString()}</p>
//           <p><strong>📊 Equity Value:</strong> ₹{equityValue.toLocaleString()}</p>
//           <p><strong>📈 Total P&L:</strong> ₹{PL.toLocaleString()}</p>
//         </div>
//       </div>

//       {/* ✅ WatchList + Routes */}
//       <GeneralContextProvider>
//         <WatchList />
//       </GeneralContextProvider>

//       <div className="content">
//         <Routes>
//           <Route exact path="/" element={<Summary />} />
//           <Route path="/orders" element={<Orders />} />
//           <Route path="/holdings" element={<Holdings />} />
//           <Route path="/positions" element={<Positions />} />
//           <Route path="/funds" element={<Funds />} />
//           <Route path="/apps" element={<Apps />} />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// // ✅ Simple inline styles (you can move this to CSS if preferred)
// const styles = {
//   header: {
//     backgroundColor: "#f3f3f3",
//     padding: "15px 25px",
//     borderBottom: "2px solid #ddd",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   stats: {
//     display: "flex",
//     gap: "20px",
//     fontSize: "16px",
//   },
// };

// export default Dashboard;


// dashboard/src/components/Dashboard.js
// import React from "react";
// import { Route, Routes } from "react-router-dom";

// import Apps from "./Apps";
// import Funds from "./Funds";
// import Holdings from "./Holdings";
// import Orders from "./Orders";
// import Positions from "./Positions";
// import Summary from "./Summary";
// import WatchList from "./WatchList";
// import { GeneralContextProvider } from "../GeneralContext";

// const Dashboard = () => {
//   return (
//     <div className="dashboard-container">
//       <GeneralContextProvider>
//         <WatchList />
//       </GeneralContextProvider>

//       <div className="content">
//         <Routes>
//           <Route exact path="/" element={<Summary />} />
//           <Route path="/orders" element={<Orders />} />
//           <Route path="/holdings" element={<Holdings />} />
//           <Route path="/positions" element={<Positions />} />
//           <Route path="/funds" element={<Funds />} />
//           <Route path="/apps" element={<Apps />} />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;




// dashboard/src/components/Dashboard.js
// import React from "react";
// import { Route, Routes } from "react-router-dom";

// import Apps from "./Apps";
// import Funds from "./Funds";
// import Holdings from "./Holdings";
// import Orders from "./Orders";
// import Positions from "./Positions";
// import Summary from "./Summary";
// import WatchList from "./WatchList";

// // ✅ Import the context provider (important)
// import { GeneralContextProvider } from "../GeneralContext";

// const Dashboard = () => {
//   return (
//     // ✅ Wrap the entire dashboard inside the context provider
//     <GeneralContextProvider>
//       <div className="dashboard-container">
//         {/* Sidebar / Watchlist */}
//         <WatchList />

//         {/* Main dashboard content */}
//         <div className="content">
//           <Routes>
//             <Route exact path="/" element={<Summary />} />
//             <Route path="/orders" element={<Orders />} />
//             <Route path="/holdings" element={<Holdings />} />
//             <Route path="/positions" element={<Positions />} />
//             <Route path="/funds" element={<Funds />} />
//             <Route path="/apps" element={<Apps />} />
//           </Routes>
//         </div>
//       </div>
//     </GeneralContextProvider>
//   );
// };

// export default Dashboard;






// dashboard/src/components/Dashboard.js
// import React from "react";
// import { Route, Routes } from "react-router-dom";

// import Apps from "./Apps";
// import Funds from "./Funds";
// import Holdings from "./Holdings";
// import Orders from "./Orders";
// import Positions from "./Positions";
// import Summary from "./Summary";
// import WatchList from "./WatchList";

// import BuyActionWindow from "./BuyActionWindow";   // <-- important
// import SellActionWindow from "./SellActionWindow"; // <-- important

// import { GeneralContextProvider } from "../GeneralContext";

// const Dashboard = () => {
//   return (
//     <GeneralContextProvider
//       buyWindow={<BuyActionWindow />}
//       sellWindow={<SellActionWindow />}
//     >
//       <div className="dashboard-container">
//         <WatchList />

//         <div className="content">
//           <Routes>
//             <Route exact path="/" element={<Summary />} />
//             <Route path="/orders" element={<Orders />} />
//             <Route path="/holdings" element={<Holdings />} />
//             <Route path="/positions" element={<Positions />} />
//             <Route path="/funds" element={<Funds />} />
//             <Route path="/apps" element={<Apps />} />
//           </Routes>
//         </div>
//       </div>
//     </GeneralContextProvider>
//   );
// };

// export default Dashboard;






// dashboard/src/components/Dashboard.js
import React from "react";
import { Route, Routes } from "react-router-dom";

import Apps from "./Apps";
// import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";

import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

import { GeneralContextProvider } from "../GeneralContext";

const Dashboard = () => {
  return (
    <GeneralContextProvider
      buyWindow={<BuyActionWindow />}
      sellWindow={<SellActionWindow />}
    >
      <div className="dashboard-container">
        {/* Sidebar / Watchlist */}
        <WatchList />

        {/* Main dashboard content */}
        <div className="content">
          <Routes>
            <Route exact path="/" element={<Summary />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/holdings" element={<Holdings />} />
            <Route path="/positions" element={<Positions />} />
            {/* <Route path="/funds" element={<Funds />} /> */}
            <Route path="/apps" element={<Apps />} />
          </Routes>
        </div>
      </div>
    </GeneralContextProvider>
  );
};

export default Dashboard;
