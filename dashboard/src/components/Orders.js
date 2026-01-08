// import React from "react";
// import { Link } from "react-router-dom";

// const Orders = () => {
//   return (
//     <div className="orders">
//       <div className="no-orders">
//         <p>You haven't placed any orders today</p>

//         <Link to={"/"} className="btn">
//           Get started
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Orders;






// dashboard/src/components/Orders.js  (debug version)
import React, { useEffect, useState } from "react";
import "./Orders.css";

function formatDate(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleString();
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const username = storedUser?.username || storedUser?.user || "";

    if (!username) {
      setErr("Please login to see your orders.");
      setLoading(false);
      return;
    }

    const endpoints = [
      `/orders?username=${encodeURIComponent(username)}`,
      `/api/orders?username=${encodeURIComponent(username)}`,
      `/api/trade/orders?username=${encodeURIComponent(username)}`,
      `/user/${encodeURIComponent(username)}/orders`,
      `/user/${encodeURIComponent(username)}/orders`, // duplicate to keep pattern
      `/api/user/${encodeURIComponent(username)}/orders`,
      `/api/trade/getOrders?username=${encodeURIComponent(username)}`,
    ];

    const fetchOrders = async () => {
      setLoading(true);
      setErr("");
      let found = null;
      console.groupCollapsed("Orders debug - trying endpoints");
      for (const url of endpoints) {
        try {
          console.log("Trying:", url);
          const r = await fetch(url);
          console.log("  status:", r.status, r.statusText);
          const text = await r.text();
          console.log("  body (raw):", text);

          // try to parse JSON
          let json = null;
          try { json = JSON.parse(text); } catch(e) { /* not JSON */ }

          // Interpret the shape
          if (Array.isArray(json)) {
            found = json;
            console.log("  -> found array of orders");
            break;
          } else if (json && Array.isArray(json.orders)) {
            found = json.orders;
            console.log("  -> found json.orders");
            break;
          } else if (json && Array.isArray(json.data)) {
            found = json.data;
            console.log("  -> found json.data");
            break;
          } else {
            console.log("  -> not recognized shape");
          }
        } catch (e) {
          console.error("fetch error for", url, e);
        }
      }
      console.groupEnd();

      if (!found) {
        setErr("No orders returned (check backend endpoint). See console for details.");
        setOrders([]);
        setLoading(false);
        return;
      }

      // normalize items
      const normalized = found.map((o) => ({
        _id: o._id || o.id || `${o.name}-${o.createdAt || o.date || Math.random()}`,
        name: o.name || o.stock || o.symbol || "Unknown",
        side: (o.mode || o.side || o.type || "BUY").toUpperCase(),
        qty: Number(o.qty || o.quantity || 0),
        price: Number(o.price || o.rate || 0),
        createdAt: o.createdAt || o.date || o.timestamp || null,
        status: o.status || "EXECUTED",
        raw: o
      }));

      normalized.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setOrders(normalized);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="orders-loading">Loading orders…</div>;
  if (err) return <div className="orders-error">{err}</div>;
  if (!orders.length) return <div className="orders-empty">You have no orders yet.</div>;

  return (
    <div className="orders-page">
      <h2 className="orders-title">Order History</h2>
      <div className="orders-grid">
        {orders.map((o) => (
          <div key={o._id} className={`order-card ${o.side === "BUY" ? "buy" : "sell"}`}>
            <div className="order-card-head">
              <div className="order-stock">
                <div className="stock-name">{o.name}</div>
                <div className="stock-sub">{o.raw?.symbol || o.raw?.exchange || ""}</div>
              </div>
              <div className="order-meta">
                <span className={`side-badge ${o.side === "BUY" ? "side-buy" : "side-sell"}`}>{o.side}</span>
                <div className="order-date">{formatDate(o.createdAt)}</div>
              </div>
            </div>

            <div className="order-body">
              <div className="order-row">
                <div className="label">Price</div>
                <div className="value">₹{o.price?.toFixed(2)}</div>
              </div>
              <div className="order-row">
                <div className="label">Quantity</div>
                <div className="value">{o.qty}</div>
              </div>
              <div className="order-row">
                <div className="label">Status</div>
                <div className="value">{o.status}</div>
              </div>
            </div>

            <div className="order-footer">
              <div className="footer-left">Order ID: {String(o._id).slice(-6)}</div>
              <div className="footer-right">
                <button
                  className="mini-btn"
                  onClick={() => {
                    navigator.clipboard?.writeText(JSON.stringify(o.raw, null, 2));
                    alert("Order details copied to clipboard.");
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
