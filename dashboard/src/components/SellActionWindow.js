// // dashboard/src/components/SellActionWindow.js
// import React, { useState, useContext, useMemo, useEffect } from "react";
// import axios from "axios";
// import { GeneralContext } from "../GeneralContext";
// import { useAuth } from "../AuthContext";

// const toNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

// export default function SellActionWindow({ stock, onClose }) {
//   const { holdings, refreshData, upsertHolding, setHoldings, setUserSummary } =
//     useContext(GeneralContext) || {};

//   const { user: authUser, token, logout } = useAuth() || {};
//   const username = authUser?.username || "";

//   const userHolding = useMemo(() => {
//     if (!stock?.name) return null;
//     return holdings.find((h) => (h.username || "") === username && h.name === stock.name) || null;
//   }, [holdings, stock, username]);

//   const initialPrice = toNum(userHolding?.price) || toNum(stock?.price);
//   const [qty, setQty] = useState(userHolding?.qty || 1);
//   const [price, setPrice] = useState(initialPrice);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setQty(userHolding?.qty ?? 1);
//     setPrice(toNum(userHolding?.price) || toNum(stock?.price));
//   }, [userHolding, stock]);

//   const handleSell = async () => {
//     setError("");

//     if (!token || !authUser) {
//       setError("You must be logged in to place orders.");
//       return;
//     }

//     if (!userHolding) return setError("You don't hold this stock.");

//     const name = stock?.name;
//     const q = Math.floor(toNum(qty));
//     const p = toNum(price);

//     if (!name) return setError("Invalid stock name.");
//     if (q <= 0) return setError("Qty must be > 0");
//     if (p <= 0) return setError("Price must be > 0");
//     if (q > userHolding.qty) return setError("You don't have enough quantity");

//     setLoading(true);
//     try {
//       const res = await axios.post(
//         "http://localhost:3002/newOrder",
//         {
//           name,
//           qty: q,
//           price: p,
//           mode: "SELL",
//           username,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("sell newOrder response:", res.data);

//       const updated = res.data?.updatedHolding ?? null;
//       const summary = res.data?.userSummary ?? null;

//       if (updated) {
//         upsertHolding && upsertHolding(updated);
//       } else {
//         // fully sold: remove from holdings array
//         setHoldings &&
//           setHoldings((prev) => prev.filter((h) => !(h.username === username && h.name === name)));
//       }

//       if (summary) setUserSummary && setUserSummary(summary);

//       await refreshData();

//       alert("Sell placed!");
//       onClose?.();
//     } catch (err) {
//       console.error("Sell error:", err);
//       const status = err?.response?.status;
//       const serverMsg = err?.response?.data?.error || err?.response?.data?.message;
//       if (status === 401) {
//         logout && logout();
//         setError("Session expired. Please login again.");
//         alert("Session expired — please login again.");
//       } else {
//         setError(serverMsg || "Sell failed");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         position: "fixed",
//         right: 24,
//         top: 80,
//         zIndex: 99999,
//         width: 360,
//         background: "#fff",
//         padding: 16,
//         borderRadius: 8,
//         boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
//       }}
//     >
//       <div style={{ display: "flex", justifyContent: "space-between" }}>
//         <strong>Sell — {stock?.name}</strong>
//         <button onClick={onClose}>Close</button>
//       </div>

//       {userHolding ? (
//         <div style={{ marginTop: 10, fontSize: 13 }}>
//           <div>Holding qty: {userHolding.qty}</div>
//           <div>Avg cost: {Number(userHolding.avg || 0).toFixed(2)}</div>
//           <div>LTP: {Number(userHolding.price || 0).toFixed(2)}</div>
//         </div>
//       ) : (
//         <p style={{ color: "#c62828" }}>You don't hold this stock.</p>
//       )}

//       <div style={{ marginTop: 12 }}>
//         <label>Price</label>
//         <input
//           type="number"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           style={{ width: "100%", padding: 8, marginTop: 6 }}
//         />
//       </div>

//       <div style={{ marginTop: 12 }}>
//         <label>Qty (max {userHolding?.qty || 0})</label>
//         <input
//           type="number"
//           value={qty}
//           min={1}
//           max={userHolding?.qty || 1}
//           onChange={(e) => setQty(e.target.value)}
//           style={{ width: "100%", padding: 8, marginTop: 6 }}
//         />
//       </div>

//       {error && <p style={{ color: "#c62828" }}>{error}</p>}

//       <div style={{ marginTop: 14, textAlign: "right" }}>
//         <button onClick={onClose} style={{ marginRight: 6 }}>
//           Cancel
//         </button>
//         <button
//           onClick={handleSell}
//           style={{ background: "#c62828", color: "white", padding: "6px 16px" }}
//           disabled={!userHolding || loading}
//         >
//           {loading ? "Please wait..." : "Sell"}
//         </button>
//       </div>
//     </div>
//   );
// }








// dashboard/src/components/SellActionWindow.js
import React, { useState, useContext, useMemo } from "react";
import axios from "axios";
import { GeneralContext } from "../GeneralContext";

const toNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

export default function SellActionWindow({ stock, onClose }) {
  const {
    holdings,
    refreshData,
    upsertHolding,
    setHoldings,
    setUserSummary,
  } = useContext(GeneralContext) || {};

  // ✅ REMOVE AUTH — only localStorage username
  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const username = stored?.username || stored?.user || stored?.name || "";

  const userHolding = useMemo(() => {
    if (!stock?.name) return null;
    return holdings.find(
      (h) => h.username === username && h.name === stock.name
    );
  }, [holdings, stock, username]);

  const initialPrice = toNum(userHolding?.price) || toNum(stock?.price);
  const [qty, setQty] = useState(userHolding?.qty || 1);
  const [price, setPrice] = useState(initialPrice);
  const [error, setError] = useState("");

  const handleSell = async () => {
    setError("");

    const name = stock?.name;
    const q = Math.floor(toNum(qty));
    const p = toNum(price);

    if (!username) return setError("No username found.");
    if (!name) return setError("Invalid stock name.");
    if (!userHolding) return setError("You don't hold this stock.");
    if (q <= 0) return setError("Qty must be > 0");
    if (p <= 0) return setError("Price must be > 0");
    if (q > userHolding.qty) return setError("Not enough quantity.");

    try {
      const res = await axios.post("http://localhost:3002/newOrder", {
        name,
        qty: q,
        price: p,
        mode: "SELL",
        username,
      });

      console.log("SELL response:", res.data);

      const updated = res.data?.updatedHolding ?? null;
      const summary = res.data?.userSummary ?? null;

      if (updated) {
        upsertHolding(updated);
      } else {
        setHoldings((prev) =>
          prev.filter((h) => !(h.username === username && h.name === name))
        );
      }

      if (summary) setUserSummary(summary);

      await refreshData();

      alert("Sell Successful!");
      onClose?.();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || "Sell failed");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        right: 24,
        top: 80,
        zIndex: 99999,
        width: 360,
        background: "#fff",
        padding: 16,
        borderRadius: 8,
        boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>Sell — {stock?.name}</strong>
        <button onClick={onClose}>Close</button>
      </div>

      {userHolding ? (
        <div style={{ marginTop: 10, fontSize: 13 }}>
          <div>Holding qty: {userHolding.qty}</div>
          <div>Avg cost: {userHolding.avg.toFixed(2)}</div>
          <div>LTP: {userHolding.price.toFixed(2)}</div>
        </div>
      ) : (
        <p style={{ color: "#c62828" }}>You don't hold this stock.</p>
      )}

      <div style={{ marginTop: 12 }}>
        <label>Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Qty (max {userHolding?.qty || 0})</label>
        <input
          type="number"
          value={qty}
          min={1}
          max={userHolding?.qty || 1}
          onChange={(e) => setQty(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
      </div>

      {error && <p style={{ color: "#c62828" }}>{error}</p>}

      <div style={{ marginTop: 14, textAlign: "right" }}>
        <button onClick={onClose} style={{ marginRight: 6 }}>
          Cancel
        </button>
        <button
          onClick={handleSell}
          style={{ background: "#c62828", color: "white", padding: "6px 16px" }}
          disabled={!userHolding}
        >
          Sell
        </button>
      </div>
    </div>
  );
}








// // dashboard/src/components/SellActionWindow.js
// import React, { useState, useContext, useMemo } from "react";
// import axios from "axios";
// import { GeneralContext } from "../GeneralContext";

// const toNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

// export default function SellActionWindow({ stock, onClose }) {
//   const {
//     holdings,
//     refreshData,
//     upsertHolding,
//     setHoldings,
//     setUserSummary,
//   } = useContext(GeneralContext) || {};

//   const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
//   const username = storedUser?.username || "";

//   const userHolding = useMemo(() => {
//     if (!stock?.name) return null;
//     return (
//       holdings.find(
//         (h) => h.username === username && h.name === stock.name
//       ) || null
//     );
//   }, [holdings, stock, username]);

//   const initialPrice = toNum(userHolding?.price) || toNum(stock?.price);
//   const [qty, setQty] = useState(userHolding?.qty || 1);
//   const [price, setPrice] = useState(initialPrice);
//   const [error, setError] = useState("");

//   const handleSell = async () => {
//     setError("");

//     const name = stock?.name;
//     const q = Math.floor(toNum(qty));
//     const p = toNum(price);

//     if (!name) return setError("Invalid stock name.");
//     if (q <= 0) return setError("Qty must be > 0");
//     if (p <= 0) return setError("Price must be > 0");
//     if (!userHolding) return setError("You don't hold this stock.");
//     if (q > userHolding.qty) return setError("You don't have enough quantity");

//     try {


//       const res = await axios.post("http://localhost:3002/newOrder", {
//   name,
//   qty: q,
//   price: p,
//   mode: "SELL",
//   username,
// });

// console.log("sell newOrder response:", res.data);

// const updated = res.data?.updatedHolding ?? null;
// const summary = res.data?.userSummary ?? null;

// if (updated) {
//   upsertHolding(updated);
// } else {
//   // fully sold case — remove holding
//   setHoldings((prev) =>
//     prev.filter((h) => !(h.username === username && h.name === name))
//   );
// }

// if (summary) setUserSummary(summary);

// await refreshData();
// alert("Sell placed!");
// onClose?.();

      
//     } catch (err) {
//       console.error(err);
//       setError(err?.response?.data?.error || "Sell failed");
//     }
//   };

//   return (
//     <div
//       style={{
//         position: "fixed",
//         right: 24,
//         top: 80,
//         zIndex: 99999,
//         width: 360,
//         background: "#fff",
//         padding: 16,
//         borderRadius: 8,
//         boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
//       }}
//     >
//       <div style={{ display: "flex", justifyContent: "space-between" }}>
//         <strong>Sell — {stock?.name}</strong>
//         <button onClick={onClose}>Close</button>
//       </div>

//       {userHolding ? (
//         <div style={{ marginTop: 10, fontSize: 13 }}>
//           <div>Holding qty: {userHolding.qty}</div>
//           <div>Avg cost: {userHolding.avg.toFixed(2)}</div>
//           <div>LTP: {userHolding.price.toFixed(2)}</div>
//         </div>
//       ) : (
//         <p style={{ color: "#c62828" }}>You don't hold this stock.</p>
//       )}

//       <div style={{ marginTop: 12 }}>
//         <label>Price</label>
//         <input
//           type="number"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           style={{ width: "100%", padding: 8, marginTop: 6 }}
//         />
//       </div>

//       <div style={{ marginTop: 12 }}>
//         <label>Qty (max {userHolding?.qty || 0})</label>
//         <input
//           type="number"
//           value={qty}
//           min={1}
//           max={userHolding?.qty || 1}
//           onChange={(e) => setQty(e.target.value)}
//           style={{ width: "100%", padding: 8, marginTop: 6 }}
//         />
//       </div>

//       {error && <p style={{ color: "#c62828" }}>{error}</p>}

//       <div style={{ marginTop: 14, textAlign: "right" }}>
//         <button onClick={onClose} style={{ marginRight: 6 }}>
//           Cancel
//         </button>
//         <button
//           onClick={handleSell}
//           style={{ background: "#c62828", color: "white", padding: "6px 16px" }}
//           disabled={!userHolding}
//         >
//           Sell
//         </button>
//       </div>
//     </div>
//   );
// }
