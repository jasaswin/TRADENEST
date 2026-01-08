
// dashboard/src/GeneralContext.js
// import React, { useState, useEffect, useCallback } from "react";

// export const GeneralContext = React.createContext({});

// export const GeneralContextProvider = ({ children, buyWindow, sellWindow }) => {
//   const [holdings, setHoldings] = useState([]);
//   const [userSummary, setUserSummary] = useState({
//     balance: 0,
//     totalInvestment: 0,
//     currentValue: 0,
//     equity: 0,
//     totalPL: 0,
//   });

//   const [loading, setLoading] = useState(false);
//   const [selectedStock, setSelectedStock] = useState(null);
//   const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
//   const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);

//   // Helper: compute summary from a holdings array
//   const computeSummaryFromHoldings = (list = []) => {
//     const totalInvestment = list.reduce((acc, it) => {
//       const qty = Number(it.qty || 0);
//       const avg = Number(it.avg || 0);
//       return acc + qty * avg;
//     }, 0);

//     const currentValue = list.reduce((acc, it) => {
//       const qty = Number(it.qty || 0);
//       // wrap nullish chain in parens before using || to satisfy parser rules
//       const price = Number(((it.price ?? it.ltp ?? it.curVal) || 0));
//       return acc + qty * price;
//     }, 0);

//     const totalPL = currentValue - totalInvestment;

//     return { totalInvestment, currentValue, totalPL };
//   };

//   // Refresh holdings + summary
//   const refreshData = useCallback(async () => {
//     try {
//       setLoading(true);

//       const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
//       const username = (storedUser?.username || storedUser?.user || "").toString().trim();
//       if (!username) {
//         setHoldings([]);
//         // keep existing userSummary as-is (or reset if you prefer)
//         return;
//       }

//       // fetch holdings
//       const hResp = await fetch("http://localhost:3002/allHoldings");
//       const h = await hResp.json();

//       // normalize holdings to ensure username property exists
//       const normalized = Array.isArray(h)
//         ? h.map((item) => {
//             const name =
//               item.username ??
//               item.user ??
//               item.User ??
//               item.owner ??
//               item.userName ??
//               "";
//             return { ...item, username: name };
//           })
//         : [];

//       // case-insensitive filter by username
//       const filtered = normalized.filter((x) => {
//         if (!x.username) return false;
//         return x.username.toString().toLowerCase() === username.toLowerCase();
//       });

//       setHoldings(filtered);

//       // Try to fetch server summary; if fails, compute from holdings
//       try {
//         const sResp = await fetch(
//           `http://localhost:3002/user/${encodeURIComponent(username)}/summary`
//         );
//         if (sResp.ok) {
//           const s = await sResp.json();
//           // keep computed holdings-derived fields in sync if server doesn't provide them
//           const computed = computeSummaryFromHoldings(filtered);
//           setUserSummary((prev) => ({
//             ...prev,
//             ...s,
//             // prefer server values but fallback to computed if server doesn't include them
//             totalInvestment: Number(s.totalInvestment ?? computed.totalInvestment),
//             currentValue: Number(s.currentValue ?? computed.currentValue),
//             totalPL: Number(s.totalPL ?? computed.totalPL),
//           }));
//         } else {
//           // fallback: compute summary from holdings
//           const computed = computeSummaryFromHoldings(filtered);
//           setUserSummary((prev) => ({
//             ...prev,
//             totalInvestment: computed.totalInvestment,
//             currentValue: computed.currentValue,
//             totalPL: computed.totalPL,
//           }));
//         }
//       } catch (e) {
//         // summary fetch failed — compute from holdings
//         const computed = computeSummaryFromHoldings(filtered);
//         setUserSummary((prev) => ({
//           ...prev,
//           totalInvestment: computed.totalInvestment,
//           currentValue: computed.currentValue,
//           totalPL: computed.totalPL,
//         }));
//         console.warn("summary fetch failed, using computed summary", e);
//       }
//     } catch (e) {
//       console.error("refreshData error:", e);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Update or add a holding
//   const upsertHolding = (updated) => {
//     // basic guard
//     if (!updated) return;

//     setHoldings((prev) => {
//       // match by _id or by (name + username) if _id missing
//       const idx = prev.findIndex(
//         (h) =>
//           (h._id && updated._id && h._id === updated._id) ||
//           (h.name === updated.name && (h.username || "") === (updated.username || ""))
//       );

//       let newList;
//       if (idx >= 0) {
//         const copy = [...prev];
//         copy[idx] = { ...copy[idx], ...updated };
//         newList = copy;
//       } else {
//         newList = [...prev, updated];
//       }

//       // immediately compute and update summary based on the new holdings list
//       const computed = computeSummaryFromHoldings(newList);
//       setUserSummary((prevSum) => ({
//         ...prevSum,
//         totalInvestment: computed.totalInvestment,
//         currentValue: computed.currentValue,
//         totalPL: computed.totalPL,
//       }));

//       return newList;
//     });
//   };

//   // Remove holding fully (by username + stockName)
//   const removeHolding = (username, stockName) => {
//     setHoldings((prev) => {
//       const newList = prev.filter((h) => !(h.username === username && h.name === stockName));
//       const computed = computeSummaryFromHoldings(newList);
//       setUserSummary((prevSum) => ({
//         ...prevSum,
//         totalInvestment: computed.totalInvestment,
//         currentValue: computed.currentValue,
//         totalPL: computed.totalPL,
//       }));
//       return newList;
//     });
//   };

//   const openBuyWindow = (stock) => {
//     setSelectedStock(stock);
//     setIsBuyWindowOpen(true);
//     setIsSellWindowOpen(false);
//   };

//   const openSellWindow = (stock) => {
//     setSelectedStock(stock);
//     setIsSellWindowOpen(true);
//     setIsBuyWindowOpen(false);
//   };

//   const closeBuyWindow = () => setIsBuyWindowOpen(false);
//   const closeSellWindow = () => setIsSellWindowOpen(false);

//   // Recompute summary when holdings are set/updated elsewhere (extra safety)
//   useEffect(() => {
//     const computed = computeSummaryFromHoldings(holdings);
//     setUserSummary((prev) => ({
//       ...prev,
//       totalInvestment: computed.totalInvestment,
//       currentValue: computed.currentValue,
//       totalPL: computed.totalPL,
//     }));
//   }, [holdings]);

//   // Load on mount
//   useEffect(() => {
//     refreshData();
//   }, [refreshData]);

//   return (
//     <GeneralContext.Provider
//       value={{
//         holdings,
//         setHoldings,
//         userSummary,
//         setUserSummary,
//         loading,

//         refreshData,
//         upsertHolding,
//         removeHolding,

//         openBuyWindow,
//         openSellWindow,
//         closeBuyWindow,
//         closeSellWindow,
//       }}
//     >
//       {children}

//       {/* BUY WINDOW */}
//       {isBuyWindowOpen && selectedStock && buyWindow ? (
//         <div style={{ position: "relative", zIndex: 999999 }}>
//           {React.cloneElement(buyWindow, {
//             stock: selectedStock,
//             onClose: closeBuyWindow,
//           })}
//         </div>
//       ) : null}

//       {/* SELL WINDOW */}
//       {isSellWindowOpen && selectedStock && sellWindow ? (
//         <div style={{ position: "relative", zIndex: 999999 }}>
//           {React.cloneElement(sellWindow, {
//             stock: selectedStock,
//             onClose: closeSellWindow,
//           })}
//         </div>
//       ) : null}
//     </GeneralContext.Provider>
//   );
// };

// export default GeneralContext;










// dashboard/src/GeneralContext.js
// import React, { useState, useEffect, useCallback, useRef } from "react";

// export const GeneralContext = React.createContext({});

// export const GeneralContextProvider = ({ children, buyWindow, sellWindow }) => {
//   const [holdings, setHoldings] = useState([]);
//   const [userSummary, setUserSummary] = useState({
//     balance: 0,
//     totalInvestment: 0,
//     currentValue: 0,
//     equity: 0,
//     totalPL: 0,
//   });

//   const [loading, setLoading] = useState(false);
//   const [selectedStock, setSelectedStock] = useState(null);
//   const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
//   const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);

//   // ---- Simulation config (change for faster/slower or disable)
//   const SIMULATE_PRICES = true; // set false to disable simulation
//   const SIM_INTERVAL_MS = 10000; // how often to nudge prices (milliseconds)
//   const SIM_MAX_PCT = 1.0; // maximum percent change on each tick (e.g., 1.0 = 1%)

//   const simIntervalRef = useRef(null);

//   // Helper: compute summary from a holdings array
//   const computeSummaryFromHoldings = (list) => {
//     const totalInvestment = list.reduce((acc, it) => {
//       const qty = Number(it.qty || 0);
//       const avg = Number(it.avg || 0);
//       return acc + qty * avg;
//     }, 0);

//     const currentValue = list.reduce((acc, it) => {
//       const qty = Number(it.qty || 0);
//       // prefer price, then ltp, then curVal, else 0
//       const raw = (it.price !== undefined && it.price !== null)
//         ? it.price
//         : (it.ltp !== undefined && it.ltp !== null) ? it.ltp : (it.curVal || 0);
//       const price = Number(raw || 0);
//       return acc + qty * price;
//     }, 0);

//     const totalPL = currentValue - totalInvestment;

//     return { totalInvestment, currentValue, totalPL };
//   };

//   // ---- Price simulation: gently change LTP/price for demo when backend not providing updates
//   const simulatePriceTick = useCallback(() => {
//     setHoldings((prev) => {
//       if (!Array.isArray(prev) || prev.length === 0) return prev;

//       const next = prev.map((h) => {
//         const qty = Number(h.qty || 0);
//         const avg = Number(h.avg || 0);
//         const price = Number(h.price || h.ltp || h.curVal || 0);

//         // if price absent or equal to avg (which causes zero P&L), nudge it.
//         // Otherwise we still apply a small random change so values move.
//         const mustNudge = !price || price === avg;
//         // random percent between -SIM_MAX_PCT and +SIM_MAX_PCT
//         const randSign = Math.random() < 0.5 ? -1 : 1;
//         const randPct = Math.random() * SIM_MAX_PCT * randSign / 100.0; // convert to fraction

//         // If mustNudge, make a slightly larger difference (avoid 0)
//         const basePct = mustNudge ? ((Math.random() * 0.8 + 0.3) / 100.0) * (Math.random() < 0.5 ? -1 : 1) : randPct;

//         const newPrice = +(price * (1 + basePct)).toFixed(2);

//         // If newPrice equals avg (rare), force a small +1 rupee change
//         const finalPrice = (Number.isNaN(newPrice) ? price : (newPrice === avg ? newPrice + 1 : newPrice));

//         // return updated holding (do not mutate original object)
//         return {
//           ...h,
//           price: finalPrice,
//         };
//       });

//       // update summary based on new prices immediately
//       const computed = computeSummaryFromHoldings(next);
//       setUserSummary((prevSum) => ({
//         ...prevSum,
//         totalInvestment: computed.totalInvestment,
//         currentValue: computed.currentValue,
//         totalPL: computed.totalPL,
//       }));

//       return next;
//     });
//   }, [SIM_MAX_PCT]);

//   // Refresh holdings + summary (fetches from server if you have one; otherwise keep as-is)
//   const refreshData = useCallback(async () => {
//     try {
//       setLoading(true);

//       const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
//       const username = (storedUser && (storedUser.username || storedUser.user) ? (storedUser.username || storedUser.user).toString().trim() : "");
//       if (!username) {
//         setHoldings([]);
//         return;
//       }

//       // Try to fetch server holdings; if your project has no backend, fallback to existing holdings
//       try {
//         const hResp = await fetch("http://localhost:3002/allHoldings");
//         if (hResp.ok) {
//           const h = await hResp.json();
//           // normalize holdings to ensure username exists
//           const normalized = Array.isArray(h)
//             ? h.map((item) => {
//                 const name =
//                   item.username ??
//                   item.user ??
//                   item.User ??
//                   item.owner ??
//                   item.userName ??
//                   "";
//                 return { ...item, username: name };
//               })
//             : [];
//           const filtered = normalized.filter((x) => {
//             if (!x.username) return false;
//             return x.username.toString().toLowerCase() === username.toLowerCase();
//           });

//           setHoldings(filtered);
//           const computed = computeSummaryFromHoldings(filtered);
//           setUserSummary((prev) => ({
//             ...prev,
//             totalInvestment: computed.totalInvestment,
//             currentValue: computed.currentValue,
//             totalPL: computed.totalPL,
//           }));
//         } else {
//           // server responded but not ok — keep current holdings and compute summary
//           const computed = computeSummaryFromHoldings(holdings);
//           setUserSummary((prev) => ({
//             ...prev,
//             totalInvestment: computed.totalInvestment,
//             currentValue: computed.currentValue,
//             totalPL: computed.totalPL,
//           }));
//         }
//       } catch (e) {
//         // fetch failed (likely no backend). compute summary from whatever holdings exist client-side
//         const computed = computeSummaryFromHoldings(holdings);
//         setUserSummary((prev) => ({
//           ...prev,
//           totalInvestment: computed.totalInvestment,
//           currentValue: computed.currentValue,
//           totalPL: computed.totalPL,
//         }));
//       }
//     } catch (e) {
//       console.error("refreshData error:", e);
//     } finally {
//       setLoading(false);
//     }
//   }, [holdings]);

//   // Update or add a holding
//   const upsertHolding = (updated) => {
//     if (!updated) return;

//     setHoldings((prev) => {
//       const idx = prev.findIndex(
//         (h) =>
//           (h._id && updated._id && h._id === updated._id) ||
//           (h.name === updated.name && (h.username || "") === (updated.username || ""))
//       );

//       let newList;
//       if (idx >= 0) {
//         const copy = [...prev];
//         copy[idx] = { ...copy[idx], ...updated };
//         newList = copy;
//       } else {
//         newList = [...prev, updated];
//       }

//       // recompute summary
//       const computed = computeSummaryFromHoldings(newList);
//       setUserSummary((prevSum) => ({
//         ...prevSum,
//         totalInvestment: computed.totalInvestment,
//         currentValue: computed.currentValue,
//         totalPL: computed.totalPL,
//       }));

//       return newList;
//     });
//   };

//   // Remove holding fully (by username + stockName)
//   const removeHolding = (username, stockName) => {
//     setHoldings((prev) => {
//       const newList = prev.filter((h) => !(h.username === username && h.name === stockName));
//       const computed = computeSummaryFromHoldings(newList);
//       setUserSummary((prevSum) => ({
//         ...prevSum,
//         totalInvestment: computed.totalInvestment,
//         currentValue: computed.currentValue,
//         totalPL: computed.totalPL,
//       }));
//       return newList;
//     });
//   };

//   const openBuyWindow = (stock) => {
//     setSelectedStock(stock);
//     setIsBuyWindowOpen(true);
//     setIsSellWindowOpen(false);
//   };

//   const openSellWindow = (stock) => {
//     setSelectedStock(stock);
//     setIsSellWindowOpen(true);
//     setIsBuyWindowOpen(false);
//   };

//   const closeBuyWindow = () => setIsBuyWindowOpen(false);
//   const closeSellWindow = () => setIsSellWindowOpen(false);

//   // Extra safety: recompute summary when holdings change externally
//   useEffect(() => {
//     const computed = computeSummaryFromHoldings(holdings);
//     setUserSummary((prev) => ({
//       ...prev,
//       totalInvestment: computed.totalInvestment,
//       currentValue: computed.currentValue,
//       totalPL: computed.totalPL,
//     }));
//   }, [holdings]);

//   // Start / stop simulation timer
//   useEffect(() => {
//     if (!SIMULATE_PRICES) return;

//     // Start interval if not already running
//     if (!simIntervalRef.current) {
//       simIntervalRef.current = setInterval(() => {
//         simulatePriceTick();
//       }, SIM_INTERVAL_MS);
//     }

//     return () => {
//       if (simIntervalRef.current) {
//         clearInterval(simIntervalRef.current);
//         simIntervalRef.current = null;
//       }
//     };
//   }, [simulatePriceTick]);

//   // Initial load on mount
//   useEffect(() => {
//     refreshData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <GeneralContext.Provider
//       value={{
//         holdings,
//         setHoldings,
//         userSummary,
//         setUserSummary,
//         loading,

//         refreshData,
//         upsertHolding,
//         removeHolding,

//         openBuyWindow,
//         openSellWindow,
//         closeBuyWindow,
//         closeSellWindow,
//       }}
//     >
//       {children}

//       {/* BUY WINDOW */}
//       {isBuyWindowOpen && selectedStock && buyWindow ? (
//         <div style={{ position: "relative", zIndex: 999999 }}>
//           {React.cloneElement(buyWindow, {
//             stock: selectedStock,
//             onClose: closeBuyWindow,
//           })}
//         </div>
//       ) : null}

//       {/* SELL WINDOW */}
//       {isSellWindowOpen && selectedStock && sellWindow ? (
//         <div style={{ position: "relative", zIndex: 999999 }}>
//           {React.cloneElement(sellWindow, {
//             stock: selectedStock,
//             onClose: closeSellWindow,
//           })}
//         </div>
//       ) : null}
//     </GeneralContext.Provider>
//   );
// };

// export default GeneralContext;






// dashboard/src/GeneralContext.js
import React, { useState, useEffect, useCallback, useRef } from "react";

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
  // PRICE SIMULATION SETTINGS
  // ---------------------------
  const SIMULATE_PRICES = true;
  const SIM_INTERVAL_MS = 10000;
  const SIM_MAX_PCT = 1.0;
  const simIntervalRef = useRef(null);

  // ---------------------------
  // Compute summary from holdings
  // ---------------------------
  const computeSummaryFromHoldings = (list = []) => {
    const totalInvestment = list.reduce((acc, it) => {
      const qty = Number(it.qty || 0);
      const avg = Number(it.avg || 0);
      return acc + qty * avg;
    }, 0);

    const currentValue = list.reduce((acc, it) => {
      const qty = Number(it.qty || 0);
      const price =
        Number(it.price || it.ltp || it.curVal || 0);
      return acc + qty * price;
    }, 0);

    const totalPL = currentValue - totalInvestment;
    return { totalInvestment, currentValue, totalPL };
  };

  // ---------------------------
  // Simulate market price changes
  // ---------------------------
  const simulatePriceTick = useCallback(() => {
    setHoldings((prev) => {
      if (!prev.length) return prev;

      const updated = prev.map((h) => {
        const price = Number(h.price || h.ltp || h.curVal || 0);
        const avg = Number(h.avg || 0);

        const randSign = Math.random() < 0.5 ? -1 : 1;
        const randPct =
          (Math.random() * SIM_MAX_PCT * randSign) / 100;

        const mustNudge = price === avg;

        const adjustPct = mustNudge
          ? ((Math.random() * 0.5 + 0.3) * randSign) / 100
          : randPct;

        let newPrice = price * (1 + adjustPct);
        newPrice = Number(newPrice.toFixed(2));

        if (newPrice === avg) newPrice += 1;

        return {
          ...h,
          price: newPrice,
        };
      });

      const computed = computeSummaryFromHoldings(updated);
      setUserSummary((prev) => ({
        ...prev,
        totalInvestment: computed.totalInvestment,
        currentValue: computed.currentValue,
        totalPL: computed.totalPL,
      }));

      return updated;
    });
  }, []);

  // ---------------------------
  // Refresh holdings (backend or fallback)
  // ---------------------------
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const username =
        (storedUser.username || storedUser.user || "").toString().trim();

      if (!username) {
        setHoldings([]);
        return;
      }

      // Try backend call
      try {
        const hResp = await fetch("http://localhost:3002/allHoldings");

        if (hResp.ok) {
          const h = await hResp.json();

          const normalized = h.map((item) => ({
            ...item,
            username:
              item.username ||
              item.user ||
              item.User ||
              item.owner ||
              item.userName ||
              "",
          }));

          const filtered = normalized.filter(
            (x) =>
              x.username?.toLowerCase() === username.toLowerCase()
          );

          setHoldings(filtered);

          const computed = computeSummaryFromHoldings(filtered);
          setUserSummary((prev) => ({
            ...prev,
            totalInvestment: computed.totalInvestment,
            currentValue: computed.currentValue,
            totalPL: computed.totalPL,
          }));
        }
      } catch (err) {
        console.warn("Backend holdings fetch failed, using local state.");
        const computed = computeSummaryFromHoldings(holdings);

        setUserSummary((prev) => ({
          ...prev,
          totalInvestment: computed.totalInvestment,
          currentValue: computed.currentValue,
          totalPL: computed.totalPL,
        }));
      }
    } finally {
      setLoading(false);
    }
  }, [holdings]);

  // ---------------------------
  // Upsert Holding
  // ---------------------------
  const upsertHolding = (updated) => {
    if (!updated) return;

    setHoldings((prev) => {
      const idx = prev.findIndex(
        (h) =>
          h._id === updated._id ||
          (h.name === updated.name &&
            h.username === updated.username)
      );

      let newList;
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...updated };
        newList = copy;
      } else {
        newList = [...prev, updated];
      }

      const computed = computeSummaryFromHoldings(newList);
      setUserSummary((prev) => ({
        ...prev,
        totalInvestment: computed.totalInvestment,
        currentValue: computed.currentValue,
        totalPL: computed.totalPL,
      }));

      return newList;
    });
  };

  // ---------------------------
  // Remove Holding
  // ---------------------------
  const removeHolding = (username, stockName) => {
    setHoldings((prev) => {
      const newList = prev.filter(
        (h) => !(h.username === username && h.name === stockName)
      );

      const computed = computeSummaryFromHoldings(newList);
      setUserSummary((prev) => ({
        ...prev,
        totalInvestment: computed.totalInvestment,
        currentValue: computed.currentValue,
        totalPL: computed.totalPL,
      }));

      return newList;
    });
  };

  // ---------------------------
  // Windows
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
  // Recompute summary on holdings change
  // ---------------------------
  useEffect(() => {
    const computed = computeSummaryFromHoldings(holdings);

    setUserSummary((prev) => ({
      ...prev,
      totalInvestment: computed.totalInvestment,
      currentValue: computed.currentValue,
      totalPL: computed.totalPL,
    }));
  }, [holdings]);

  // ---------------------------
  // NEW: Compute Equity
  // ---------------------------
  useEffect(() => {
    const { currentValue } = computeSummaryFromHoldings(holdings);
    const balance = Number(userSummary.balance || 0);

    const computedEquity = Number((balance + currentValue).toFixed(2));

    setUserSummary((prev) => {
      if (prev.equity === computedEquity) return prev;
      return { ...prev, equity: computedEquity };
    });
  }, [holdings, userSummary.balance]);

  // ---------------------------
  // Start Price Simulation
  // ---------------------------
  useEffect(() => {
    if (!SIMULATE_PRICES) return;

    simIntervalRef.current = setInterval(
      simulatePriceTick,
      SIM_INTERVAL_MS
    );

    return () => clearInterval(simIntervalRef.current);
  }, []);

  // ---------------------------
  // Initial load
  // ---------------------------
  useEffect(() => {
    refreshData();
  }, []);

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

      {isBuyWindowOpen && selectedStock && buyWindow && (
        <div style={{ position: "relative", zIndex: 999999 }}>
          {React.cloneElement(buyWindow, {
            stock: selectedStock,
            onClose: closeBuyWindow,
          })}
        </div>
      )}

      {isSellWindowOpen && selectedStock && sellWindow && (
        <div style={{ position: "relative", zIndex: 999999 }}>
          {React.cloneElement(sellWindow, {
            stock: selectedStock,
            onClose: closeSellWindow,
          })}
        </div>
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
