// import React, { useState } from "react";

// import BuyActionWindow from "./BuyActionWindow";

// const GeneralContext = React.createContext({
//   openBuyWindow: (uid) => {},
//   closeBuyWindow: () => {},
// });

// export const GeneralContextProvider = (props) => {
//   const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
//   const [selectedStockUID, setSelectedStockUID] = useState("");

//   const handleOpenBuyWindow = (uid) => {
//     setIsBuyWindowOpen(true);
//     setSelectedStockUID(uid);
//   };

//   const handleCloseBuyWindow = () => {
//     setIsBuyWindowOpen(false);
//     setSelectedStockUID("");
//   };

//   return (
//     <GeneralContext.Provider
//       value={{
//         openBuyWindow: handleOpenBuyWindow,
//         closeBuyWindow: handleCloseBuyWindow,
//       }}
//     >
//       {props.children}
//       {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} />}
//     </GeneralContext.Provider>
//   );
// };

// export default GeneralContext;




// import React, { useState } from "react";
// import BuyActionWindow from "./BuyActionWindow";
// import SellActionWindow from "./SellActionWindow";

// const GeneralContext = React.createContext({
//   openBuyWindow: (uid) => {},
//   closeBuyWindow: () => {},
//   openSellWindow: (uid) => {},
//   closeSellWindow: () => {},
// });

// export const GeneralContextProvider = (props) => {
//   const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
//   const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
//   const [selectedStockUID, setSelectedStockUID] = useState("");

//   // ✅ Buy
//   const handleOpenBuyWindow = (uid) => {
//     setIsBuyWindowOpen(true);
//     setIsSellWindowOpen(false);
//     setSelectedStockUID(uid);
//   };

//   const handleCloseBuyWindow = () => {
//     setIsBuyWindowOpen(false);
//     setSelectedStockUID("");
//   };

//   // ✅ Sell
//   const handleOpenSellWindow = (uid) => {
//     setIsSellWindowOpen(true);
//     setIsBuyWindowOpen(false);
//     setSelectedStockUID(uid);
//   };

//   const handleCloseSellWindow = () => {
//     setIsSellWindowOpen(false);
//     setSelectedStockUID("");
//   };

//   return (
//     <GeneralContext.Provider
//       value={{
//         openBuyWindow: handleOpenBuyWindow,
//         closeBuyWindow: handleCloseBuyWindow,
//         openSellWindow: handleOpenSellWindow,
//         closeSellWindow: handleCloseSellWindow,
//       }}
//     >
//       {props.children}

//       {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} />}
//       {isSellWindowOpen && <SellActionWindow uid={selectedStockUID} />}
//     </GeneralContext.Provider>
//   );
// };

// export default GeneralContext;


// import React, { useState } from "react";
// import BuyActionWindow from "./BuyActionWindow";
// import SellActionWindow from "./SellActionWindow";

// const GeneralContext = React.createContext({
//   openBuyWindow: (stock) => {},
//   closeBuyWindow: () => {},
//   openSellWindow: (stock) => {},
//   closeSellWindow: () => {},
// });

// export const GeneralContextProvider = (props) => {
//   const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
//   const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
//   const [selectedStock, setSelectedStock] = useState(null);

//   // ✅ Buy
//   const handleOpenBuyWindow = (stock) => {
//     setIsBuyWindowOpen(true);
//     setIsSellWindowOpen(false);
//     setSelectedStock(stock);
//   };

//   const handleCloseBuyWindow = () => {
//     setIsBuyWindowOpen(false);
//     setSelectedStock(null);
//   };

//   // ✅ Sell
//   const handleOpenSellWindow = (stock) => {
//     setIsSellWindowOpen(true);
//     setIsBuyWindowOpen(false);
//     setSelectedStock(stock);
//   };

//   const handleCloseSellWindow = () => {
//     setIsSellWindowOpen(false);
//     setSelectedStock(null);
//   };

//   return (
//     <GeneralContext.Provider
//       value={{
//         openBuyWindow: handleOpenBuyWindow,
//         closeBuyWindow: handleCloseBuyWindow,
//         openSellWindow: handleOpenSellWindow,
//         closeSellWindow: handleCloseSellWindow,
//       }}
//     >
//       {props.children}

//       {isBuyWindowOpen && <BuyActionWindow stock={selectedStock} />}
//       {isSellWindowOpen && <SellActionWindow stock={selectedStock} />}
//     </GeneralContext.Provider>
//   );
// };

// export default GeneralContext;



// dashboard/src/GeneralContext.js
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const GeneralContext = React.createContext({
//   holdings: [],
//   summary: null,
//   openBuyWindow: (stock) => {},
//   closeBuyWindow: () => {},
//   openSellWindow: (stock) => {},
//   closeSellWindow: () => {},
//   handleOrderUpdate: (updatedHolding, userSummary) => {},
// });

// export const GeneralContextProvider = (props) => {
//   const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
//   const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
//   const [selectedStock, setSelectedStock] = useState(null);

//   // new state: holdings & summary
//   const [holdings, setHoldings] = useState([]);
//   const [summary, setSummary] = useState(null);

//   // Open/close windows (existing)
//   const handleOpenBuyWindow = (stock) => {
//     setIsBuyWindowOpen(true);
//     setIsSellWindowOpen(false);
//     setSelectedStock(stock);
//   };

//   const handleCloseBuyWindow = () => {
//     setIsBuyWindowOpen(false);
//     setSelectedStock(null);
//   };

//   const handleOpenSellWindow = (stock) => {
//     setIsSellWindowOpen(true);
//     setIsBuyWindowOpen(false);
//     setSelectedStock(stock);
//   };

//   const handleCloseSellWindow = () => {
//     setIsSellWindowOpen(false);
//     setSelectedStock(null);
//   };

//   // utility: load initial holdings & summary for logged-in user
//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         const storedUser = localStorage.getItem("user");
//         if (!storedUser) {
//           setHoldings([]);
//           setSummary(null);
//           return;
//         }
//         const user = JSON.parse(storedUser);
//         const username = user.username;

//         // fetch all holdings and filter client-side by username (unprotected)
//         const res = await axios.get("http://localhost:3002/allHoldings");
//         const allHoldings = Array.isArray(res.data) ? res.data : [];
//         const userHoldings = allHoldings.filter((h) => h.username === username);
//         setHoldings(userHoldings);

//         // fetch user summary (server-side stored fields or fallback compute)
//         // Your backend has /user/:username/summary that returns some user fields
//         try {
//           const sumRes = await axios.get(`http://localhost:3002/user/${encodeURIComponent(username)}/summary`);
//           // prefer server-provided values if present
//           setSummary({
//             balance: sumRes.data.balance ?? null,
//             equityValue: sumRes.data.equityValue ?? null,
//             totalPL: sumRes.data.totalPL ?? null,
//           });
//         } catch (err) {
//           // fallback compute from holdings with default balance (if server summary not available)
//           const totalInvestment = userHoldings.reduce((acc, h) => acc + (h.avg || 0) * (h.qty || 0), 0);
//           const currentValue = userHoldings.reduce((acc, h) => acc + (h.price || 0) * (h.qty || 0), 0);
//           setSummary({
//             balance: (user.balance ?? 100000),
//             totalInvestment,
//             currentValue,
//             equity: (user.balance ?? 100000) + currentValue,
//             totalPL: currentValue - totalInvestment,
//           });
//         }
//       } catch (err) {
//         console.error("Error loading initial holdings/summary:", err);
//       }
//     };

//     loadInitialData();
//   }, []);

//   // function to upsert a single holding and set summary (called after order)
//   const handleOrderUpdate = (updatedHolding, userSummary) => {
//     if (updatedHolding) {
//       // upsert into holdings array by name (or _id)
//       setHoldings((prev) => {
//         const idx = prev.findIndex((h) => h.name === updatedHolding.name);
//         if (idx === -1) {
//           return [...prev, updatedHolding];
//         } else {
//           const copy = [...prev];
//           copy[idx] = { ...copy[idx], ...updatedHolding };
//           return copy;
//         }
//       });
//     } else {
//       // if updatedHolding is null => removed (sold out). We'll remove by name
//       // but backend didn't send the name if null; if you want removal, backend should send removedName; for now assume client will re-fetch if null
//       setHoldings((prev) => prev.filter((h) => h.name !== (updatedHolding && updatedHolding.name)));
//     }

//     // update summary if provided
//     if (userSummary) {
//       setSummary(userSummary);
//     }
//   };

//   return (
//     <GeneralContext.Provider
//       value={{
//         holdings,
//         summary,
//         openBuyWindow: handleOpenBuyWindow,
//         closeBuyWindow: handleCloseBuyWindow,
//         openSellWindow: handleOpenSellWindow,
//         closeSellWindow: handleCloseSellWindow,
//         handleOrderUpdate,
//       }}
//     >
//       {props.children}

//       {isBuyWindowOpen && <props.children.type {...props.children.props} />}
//       {/* Note: we still render BuyActionWindow/SellActionWindow from earlier code in your provider JSX */}
//     </GeneralContext.Provider>
//   );
// };

// export default GeneralContext;
// export { GeneralContext };






// dashboard/src/GeneralContext.js
import React, { useState, useEffect, useCallback } from "react";

export const GeneralContext = React.createContext({});

export const GeneralContextProvider = ({ children, buyWindow, sellWindow }) => {
  const [holdings, setHoldings] = useState([]);
  const [userSummary, setUserSummary] = useState({
    balance: 0,
    totalInvestment: 0,
    currentValue: 0,
    equity: 0,
    totalPL: 0,
  });

  const [loading, setLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);

  // ---------------------------
  // Refresh holdings + summary
  // ---------------------------
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const username = storedUser?.username || "";
      if (!username) {
        setHoldings([]);
        setUserSummary(prev => prev);
        return;
      }

      // Fetch holdings (adjust endpoints if needed)
      const h = await fetch("http://localhost:3002/allHoldings").then((r) =>
        r.json()
      );
      const filtered = Array.isArray(h) ? h.filter((x) => x.username === username) : [];
      setHoldings(filtered);

      // Fetch summary
      const s = await fetch(`http://localhost:3002/user/${username}/summary`).then((r) =>
        r.json()
      );
      if (s) setUserSummary(s);
    } catch (e) {
      console.error("refreshData error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------------------------
  // Update or add a holding
  // ---------------------------
  const upsertHolding = (updated) => {
    if (!updated) return;

    setHoldings((prev) => {
      const i = prev.findIndex((h) => h._id === updated._id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = updated;
        return copy;
      }
      return [...prev, updated];
    });
  };

  // ---------------------------
  // Remove holding fully (qty=0)
  // ---------------------------
  const removeHolding = (username, stockName) => {
    setHoldings((prev) =>
      prev.filter((h) => !(h.username === username && h.name === stockName))
    );
  };

  // ---------------------------
  // Open/Close Windows
  // ---------------------------
  const openBuyWindow = (stock) => {
    setSelectedStock(stock);
    setIsBuyWindowOpen(true);
    setIsSellWindowOpen(false);
  };

  const openSellWindow = (stock) => {
    setSelectedStock(stock);
    setIsSellWindowOpen(true);
    setIsBuyWindowOpen(false);
  };

  const closeBuyWindow = () => setIsBuyWindowOpen(false);
  const closeSellWindow = () => setIsSellWindowOpen(false);

  // ---------------------------
  // Load on mount
  // ---------------------------
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <GeneralContext.Provider
      value={{
        holdings,
        setHoldings,
        userSummary,
        setUserSummary,
        loading,

        refreshData,
        upsertHolding,
        removeHolding,

        openBuyWindow,
        openSellWindow,
        closeBuyWindow,
        closeSellWindow,
      }}
    >
      {children}

      {/* BUY WINDOW */}
      {isBuyWindowOpen && selectedStock && buyWindow ? (
        <div style={{ position: "relative", zIndex: 999999 }}>
          {React.cloneElement(buyWindow, {
            stock: selectedStock,
            onClose: closeBuyWindow,
          })}
        </div>
      ) : null}

      {/* SELL WINDOW */}
      {isSellWindowOpen && selectedStock && sellWindow ? (
        <div style={{ position: "relative", zIndex: 999999 }}>
          {React.cloneElement(sellWindow, {
            stock: selectedStock,
            onClose: closeSellWindow,
          })}
        </div>
      ) : null}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
