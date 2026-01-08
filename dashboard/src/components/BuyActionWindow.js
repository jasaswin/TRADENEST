






// // dashboard/src/components/BuyActionWindow.js
// import React, { useState, useContext } from "react";
// import axios from "axios";
// import { GeneralContext } from "../GeneralContext";

// export default function BuyActionWindow({ stock, onClose }) {
//   const [qty, setQty] = useState(1);
//   const [price, setPrice] = useState(stock?.price || 0);

//   const { refreshData, upsertHolding, setUserSummary } =
//     useContext(GeneralContext) || {};








// const handleBuy = async () => {
//   try {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     const username = user?.username || "";
//     if (!username) return alert("Please log in.");

//     const q = Math.max(1, Math.floor(Number(qty) || 0));
//     const p = Number(price) || 0;
//     if (q <= 0 || p <= 0) return alert("Enter valid qty & price");

//     const res = await axios.post("http://localhost:3002/newOrder", {
//       name: stock?.name,
//       qty: q,
//       price: p,
//       mode: "BUY",
//       username,
//     });

//     console.log("newOrder response:", res.data);

//     const updated = res.data?.updatedHolding ?? null;
//     const summary = res.data?.userSummary ?? null;

//     if (updated) {
//       upsertHolding(updated);
//       console.log("Skipping refresh — updatedHolding used");
//     } else {
//       console.warn("No updatedHolding returned — refreshing");
//       await refreshData();
//     }

//     if (summary) setUserSummary(summary);

//     alert("Buy placed!");
//     onClose?.();
//   } catch (err) {
//     console.error("Buy error:", err);
//     alert(err?.response?.data?.error || "Order failed");
//   }
// };



//   return (
//     <div
//       style={{
//         position: "fixed",
//         right: 24,
//         top: 80,
//         zIndex: 99999,
//         width: 360,
//         background: "#fff",
//         boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
//         borderRadius: 8,
//         padding: 16,
//       }}
//     >
//       <div style={{ display: "flex", justifyContent: "space-between" }}>
//         <strong>Buy — {stock?.name}</strong>
//         <button onClick={onClose}>Close</button>
//       </div>

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
//         <label>Qty</label>
//         <input
//           type="number"
//           min={1}
//           value={qty}
//           onChange={(e) => setQty(e.target.value)}
//           style={{ width: "100%", padding: 8, marginTop: 6 }}
//         />
//       </div>

//       <div style={{ marginTop: 14, textAlign: "right" }}>
//         <button onClick={onClose} style={{ marginRight: 6 }}>
//           Cancel
//         </button>
//         <button
//           onClick={handleBuy}
//           style={{ background: "#2e7d32", color: "white", padding: "6px 16px" }}
//         >
//           Buy
//         </button>
//       </div>
//     </div>
//   );
// }










// // dashboard/src/components/BuyActionWindow.js
// import React, { useState, useContext } from "react";
// import axios from "axios";
// import { GeneralContext } from "../GeneralContext";

// export default function BuyActionWindow({ stock, onClose }) {
//   const [qty, setQty] = useState(1);
//   const [price, setPrice] = useState(stock?.price || 0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const { refreshData, upsertHolding, setUserSummary } = useContext(GeneralContext) || {};

//   const handleBuy = async () => {
//     setError("");
//     // read user from localStorage
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     const username = user?.username || "";
//     if (!username) {
//       alert("Please log in.");
//       return;
//     }

//     const q = Math.max(1, Math.floor(Number(qty) || 0));
//     const p = Number(price) || 0;
//     if (q <= 0 || p <= 0) return alert("Enter valid qty & price");

//     const token = localStorage.getItem("token") || "";
//     if (!token) {
//       alert("You must be logged in to place orders.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post(
//         "http://localhost:3002/newOrder",
//         {
//           name: stock?.name,
//           qty: q,
//           price: p,
//           mode: "BUY",
//           username,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("newOrder response:", res.data);

//       const updated = res.data?.updatedHolding ?? null;
//       const summary = res.data?.userSummary ?? null;

//       if (updated) {
//         upsertHolding(updated);
//         console.log("Using updatedHolding from server");
//       } else {
//         // fallback: refresh front-end state
//         await refreshData();
//       }

//       if (summary) setUserSummary(summary);

//       alert("Buy placed!");
//       onClose?.();
//     } catch (err) {
//       console.error("Buy error:", err);
//       const status = err?.response?.status;
//       const serverMsg = err?.response?.data?.error || err?.response?.data?.message;
//       if (status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         alert("Session expired — please log in again.");
//         window.location.reload();
//       } else {
//         alert(serverMsg || "Order failed");
//         setError(serverMsg || "Order failed");
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
//         boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
//         borderRadius: 8,
//         padding: 16,
//       }}
//     >
//       <div style={{ display: "flex", justifyContent: "space-between" }}>
//         <strong>Buy — {stock?.name}</strong>
//         <button onClick={onClose}>Close</button>
//       </div>

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
//         <label>Qty</label>
//         <input
//           type="number"
//           min={1}
//           value={qty}
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
//           onClick={handleBuy}
//           style={{ background: "#2e7d32", color: "white", padding: "6px 16px" }}
//           disabled={loading}
//         >
//           {loading ? "Please wait..." : "Buy"}
//         </button>
//       </div>
//     </div>
//   );
// }




// // dashboard/src/components/BuyActionWindow.js
// import React, { useState, useContext } from "react";
// import axios from "axios";
// import { GeneralContext } from "../GeneralContext";
// import { useAuth } from "../AuthContext";

// export default function BuyActionWindow({ stock, onClose }) {
//   const [qty, setQty] = useState(1);
//   const [price, setPrice] = useState(stock?.price || 0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const { refreshData, upsertHolding, setUserSummary } = useContext(GeneralContext) || {};
//   const { user: authUser, token, logout } = useAuth() || {};
//   const username = authUser?.username || "";

//   const handleBuy = async () => {
//     setError("");
//     if (!token || !authUser) {
//       alert("You must be logged in to place orders.");
//       return;
//     }

//     const q = Math.max(1, Math.floor(Number(qty) || 0));
//     const p = Number(price) || 0;
//     if (q <= 0 || p <= 0) {
//       alert("Enter valid qty & price");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post(
//         "http://localhost:3002/newOrder",
//         {
//           name: stock?.name,
//           qty: q,
//           price: p,
//           mode: "BUY",
//           username,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("newOrder response:", res.data);

//       const updated = res.data?.updatedHolding ?? null;
//       const summary = res.data?.userSummary ?? null;

//       if (updated) {
//         upsertHolding && upsertHolding(updated);
//       } else {
//         // fallback refresh if server didn't return holding
//         await refreshData();
//       }

//       if (summary) setUserSummary && setUserSummary(summary);

//       alert("Buy placed!");
//       onClose?.();
//     } catch (err) {
//       console.error("Buy error:", err);
//       const status = err?.response?.status;
//       const serverMsg = err?.response?.data?.error || err?.response?.data?.message;
//       if (status === 401) {
//         // token expired or invalid
//         logout && logout();
//         alert("Session expired — please log in again.");
//       } else {
//         alert(serverMsg || "Order failed");
//         setError(serverMsg || "Order failed");
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
//         boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
//         borderRadius: 8,
//         padding: 16,
//       }}
//     >
//       <div style={{ display: "flex", justifyContent: "space-between" }}>
//         <strong>Buy — {stock?.name}</strong>
//         <button onClick={onClose}>Close</button>
//       </div>

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
//         <label>Qty</label>
//         <input
//           type="number"
//           min={1}
//           value={qty}
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
//           onClick={handleBuy}
//           style={{ background: "#2e7d32", color: "white", padding: "6px 16px" }}
//           disabled={loading}
//         >
//           {loading ? "Please wait..." : "Buy"}
//         </button>
//       </div>
//     </div>
//   );
// }





// dashboard/src/components/BuyActionWindow.js
import React, { useState, useContext } from "react";
import axios from "axios";
import { GeneralContext } from "../GeneralContext";

export default function BuyActionWindow({ stock, onClose }) {
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(stock?.price || 0);

  const { refreshData, upsertHolding, setUserSummary } =
    useContext(GeneralContext) || {};

  // ✅ NO AUTH — JUST GET USERNAME FROM LOCAL STORAGE
  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const username = stored?.username || stored?.name || stored?.user || "";

  const handleBuy = async () => {
    if (!username) return alert("No username found in local storage.");

    const q = Math.max(1, Math.floor(Number(qty) || 0));
    const p = Number(price) || 0;

    if (q <= 0 || p <= 0) return alert("Enter valid qty & price");

    try {
      const res = await axios.post("http://localhost:3002/newOrder", {
        name: stock?.name,
        qty: q,
        price: p,
        mode: "BUY",
        username,
      });

      console.log("BUY response:", res.data);

      const updated = res.data?.updatedHolding ?? null;
      const summary = res.data?.userSummary ?? null;

      if (updated) upsertHolding(updated);
      if (summary) setUserSummary(summary);

      await refreshData();

      alert("Buy Successful!");
      onClose?.();
    } catch (err) {
      console.error("Buy error:", err);
      alert(err?.response?.data?.error || "Order failed");
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
        boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
        borderRadius: 8,
        padding: 16,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>Buy — {stock?.name}</strong>
        <button onClick={onClose}>Close</button>
      </div>

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
        <label>Qty</label>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />
      </div>

      <div style={{ marginTop: 14, textAlign: "right" }}>
        <button onClick={onClose} style={{ marginRight: 6 }}>
          Cancel
        </button>
        <button
          onClick={handleBuy}
          style={{ background: "#2e7d32", color: "white", padding: "6px 16px" }}
        >
          Buy
        </button>
      </div>
    </div>
  );
}

