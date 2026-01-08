// import React, { useState, useContext } from "react";

// import axios from "axios";

// import GeneralContext from "./GeneralContext";

// import { Tooltip, Grow } from "@mui/material";

// import {
//   BarChartOutlined,
//   KeyboardArrowDown,
//   KeyboardArrowUp,
//   MoreHoriz,
// } from "@mui/icons-material";

// import { watchlist } from "../data/data";
// import { DoughnutChart } from "./DoughnoutChart";

// const labels = watchlist.map((subArray) => subArray["name"]);

// const WatchList = () => {
//   const data = {
//     labels,
//     datasets: [
//       {
//         label: "Price",
//         data: watchlist.map((stock) => stock.price),
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.5)",
//           "rgba(54, 162, 235, 0.5)",
//           "rgba(255, 206, 86, 0.5)",
//           "rgba(75, 192, 192, 0.5)",
//           "rgba(153, 102, 255, 0.5)",
//           "rgba(255, 159, 64, 0.5)",
//         ],
//         borderColor: [
//           "rgba(255, 99, 132, 1)",
//           "rgba(54, 162, 235, 1)",
//           "rgba(255, 206, 86, 1)",
//           "rgba(75, 192, 192, 1)",
//           "rgba(153, 102, 255, 1)",
//           "rgba(255, 159, 64, 1)",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };




  // export const data = {
  //   labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  // datasets: [
  //   {
  //     label: "# of Votes",
  //     data: [12, 19, 3, 5, 2, 3],
  //     backgroundColor: [
  //       "rgba(255, 99, 132, 0.2)",
  //       "rgba(54, 162, 235, 0.2)",
  //       "rgba(255, 206, 86, 0.2)",
  //       "rgba(75, 192, 192, 0.2)",
  //       "rgba(153, 102, 255, 0.2)",
  //       "rgba(255, 159, 64, 0.2)",
  //     ],
  //     borderColor: [
  //       "rgba(255, 99, 132, 1)",
  //       "rgba(54, 162, 235, 1)",
  //       "rgba(255, 206, 86, 1)",
  //       "rgba(75, 192, 192, 1)",
  //       "rgba(153, 102, 255, 1)",
  //       "rgba(255, 159, 64, 1)",
  //     ],
  //     borderWidth: 1,
  //   },
  // ],
  // };

//   return (
//     <div className="watchlist-container">
//       <div className="search-container">
//         <input
//           type="text"
//           name="search"
//           id="search"
//           placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
//           className="search"
//         />
//         <span className="counts"> {watchlist.length} / 50</span>
//       </div>

//       <ul className="list">
//         {watchlist.map((stock, index) => {
//           return <WatchListItem stock={stock} key={index} />;
//         })}
//       </ul>

//       <DoughnutChart data={data} />
//     </div>
//   );
// };

// export default WatchList;

// const WatchListItem = ({ stock }) => {
//   const [showWatchlistActions, setShowWatchlistActions] = useState(false);

//   const handleMouseEnter = (e) => {
//     setShowWatchlistActions(true);
//   };

//   const handleMouseLeave = (e) => {
//     setShowWatchlistActions(false);
//   };

//   return (
//     <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
//       <div className="item">
//         <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
//         <div className="itemInfo">
//           <span className="percent">{stock.percent}</span>
//           {stock.isDown ? (
//             <KeyboardArrowDown className="down" />
//           ) : (
//             <KeyboardArrowUp className="down" />
//           )}
//           <span className="price">{stock.price}</span>
//         </div>
//       </div>
//       {showWatchlistActions && <WatchListActions uid={stock.name} />}
//     </li>
//   );
// };

// const WatchListActions = ({ uid }) => {
//   const generalContext = useContext(GeneralContext);

//   // const handleBuyClick = () => {
//   //   generalContext.openBuyWindow(uid);
//   // };




//   const handleBuyClick = () => {
//   const stock = watchlist.find((s) => s.name === uid);
//   generalContext.openBuyWindow(stock);
// };



//   return (
//     <span className="actions">
//       <span>
//         <Tooltip
//           title="Buy (B)"
//           placement="top"
//           arrow
//           TransitionComponent={Grow}
//           onClick={handleBuyClick}
//         >
//           <button className="buy">Buy</button>
//         </Tooltip>
//         {/* <Tooltip
//           title="Sell (S)"
//           placement="top"
//           arrow
//           TransitionComponent={Grow}
//         >
//           <button className="sell">Sell</button>
//         </Tooltip> */}

//         <Tooltip
//   title="Sell (S)"
//   placement="top"
//   arrow
//   TransitionComponent={Grow}
//   // onClick={() => generalContext.openSellWindow(uid)}

//   onClick={() => generalContext.openBuyWindow(watchlist.find(s => s.name === uid))}

// >
//   <button className="sell">Sell</button>
// </Tooltip>

//         <Tooltip
//           title="Analytics (A)"
//           placement="top"
//           arrow
//           TransitionComponent={Grow}
//         >
//           <button className="action">
//             <BarChartOutlined className="icon" />
//           </button>
//         </Tooltip>
//         <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
//           <button className="action">
//             <MoreHoriz className="icon" />
//           </button>
//         </Tooltip>
//       </span>
//     </span>
//   );
// };




// dashboard/src/components/WatchList.js
import React, { useContext, useState } from "react";
import { Tooltip, Grow } from "@mui/material";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";

import { watchlist } from "../data/data";
import { DoughnutChart } from "./DoughnoutChart";

// IMPORTANT: use named import for the context (matches GeneralContext.js)
import { GeneralContext } from "../GeneralContext";

const labels = watchlist.map((subArray) => subArray["name"]);

const WatchList = () => {
  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: watchlist.map((stock) => stock.price),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
          className="search"
        />
        <span className="counts"> {watchlist.length} / 50</span>
      </div>

      <ul className="list">
        {watchlist.map((stock, index) => {
          return <WatchListItem stock={stock} key={index} />;
        })}
      </ul>

      <DoughnutChart data={data} />
    </div>
  );
};

export default WatchList;

/* ---------------- WatchListItem ---------------- */
const WatchListItem = ({ stock }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  const handleMouseEnter = () => setShowWatchlistActions(true);
  const handleMouseLeave = () => setShowWatchlistActions(false);

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="up" />
          )}
          <span className="price">{stock.price}</span>
        </div>
      </div>

      {showWatchlistActions && <WatchListActions uid={stock.name} />}
    </li>
  );
};

/* ---------------- WatchListActions ---------------- */
// const WatchListActions = ({ uid }) => {
//   // use the named GeneralContext export
//   const ctx = useContext(GeneralContext);

//   // defensive checks
//   const openBuyWindow = ctx?.openBuyWindow;
//   const openSellWindow = ctx?.openSellWindow;

//   const handleBuyClick = () => {
//     const stock = watchlist.find((s) => s.name === uid);
//     if (typeof openBuyWindow === "function") {
//       openBuyWindow(stock);
//     } else {
//       console.error("openBuyWindow is not available on GeneralContext:", openBuyWindow);
//       alert("Buy window unavailable. Ensure the dashboard is wrapped with GeneralContextProvider.");
//     }
//   };

//   const handleSellClick = () => {
//     const stock = watchlist.find((s) => s.name === uid);
//     if (typeof openSellWindow === "function") {
//       openSellWindow(stock);
//     } else if (typeof openBuyWindow === "function") {
//       // fallback: if sell window not implemented, reuse buy to show modal (optional)
//       openBuyWindow(stock);
//     } else {
//       console.error("openSellWindow / openBuyWindow unavailable on GeneralContext.");
//       alert("Sell window unavailable.");
//     }
//   };

//   return (
//     <span className="actions">
//       <span>
//         <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
//           <button className="buy" onClick={handleBuyClick}>
//             Buy
//           </button>
//         </Tooltip>

//         <Tooltip title="Sell (S)" placement="top" arrow TransitionComponent={Grow}>
//           <button className="sell" onClick={handleSellClick}>
//             Sell
//           </button>
//         </Tooltip>

//         <Tooltip title="Analytics (A)" placement="top" arrow TransitionComponent={Grow}>
//           <button className="action">
//             <BarChartOutlined className="icon" />
//           </button>
//         </Tooltip>

//         <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
//           <button className="action">
//             <MoreHoriz className="icon" />
//           </button>
//         </Tooltip>
//       </span>
//     </span>
//   );
// };


/* ---------------- WatchListActions ---------------- */
// const WatchListActions = ({ uid }) => {
//   // use the named GeneralContext export
//   const ctx = useContext(GeneralContext);

//   // defensive checks
//   const openBuyWindow = ctx?.openBuyWindow;
//   const openSellWindow = ctx?.openSellWindow;

//   const handleBuyClick = () => {
//     const stock = watchlist.find((s) => s.name === uid);
//     if (typeof openBuyWindow === "function") {
//       openBuyWindow(stock);
//     } else {
//       console.error("openBuyWindow is not available on GeneralContext:", openBuyWindow);
//       alert("Buy window unavailable. Ensure the dashboard is wrapped with GeneralContextProvider.");
//     }
//   };

//   const handleSellClick = () => {
//     const stock = watchlist.find((s) => s.name === uid);
//     if (typeof openSellWindow === "function") {
//       openSellWindow(stock);
//     } else if (typeof openBuyWindow === "function") {
//       // fallback: if sell window not implemented, reuse buy to show modal (optional)
//       openBuyWindow(stock);
//     } else {
//       console.error("openSellWindow / openBuyWindow unavailable on GeneralContext.");
//       alert("Sell window unavailable.");
//     }
//   };

//   return (
//     <span className="actions">
//       <span>
//         <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
//           {/* put onClick on the button, not on Tooltip */}
//           <button className="buy" onClick={handleBuyClick}>
//             Buy
//           </button>
//         </Tooltip>

//         <Tooltip title="Sell (S)" placement="top" arrow TransitionComponent={Grow}>
//           <button className="sell" onClick={handleSellClick}>
//             Sell
//           </button>
//         </Tooltip>

//         <Tooltip title="Analytics (A)" placement="top" arrow TransitionComponent={Grow}>
//           <button className="action">
//             <BarChartOutlined className="icon" />
//           </button>
//         </Tooltip>

//         <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
//           <button className="action">
//             <MoreHoriz className="icon" />
//           </button>
//         </Tooltip>
//       </span>
//     </span>
//   );
// };



/* ---------------- WatchListActions ---------------- */
// const WatchListActions = ({ uid }) => {
//   // use the named GeneralContext export
//   const ctx = useContext(GeneralContext);

//   // defensive checks
//   const openBuyWindow = ctx?.openBuyWindow;
//   const openSellWindow = ctx?.openSellWindow;

//   const handleBuyClick = () => {
//     const stock = watchlist.find((s) => s.name === uid);
//     if (typeof openBuyWindow === "function") {
//       openBuyWindow(stock);
//     } else {
//       console.error("openBuyWindow is not available on GeneralContext:", openBuyWindow);
//       alert("Buy window unavailable. Ensure the dashboard is wrapped with GeneralContextProvider.");
//     }
//   };

//   const handleSellClick = () => {
//     const stock = watchlist.find((s) => s.name === uid);
//     if (typeof openSellWindow === "function") {
//       openSellWindow(stock);
//     } else if (typeof openBuyWindow === "function") {
//       // fallback: if sell window not implemented, reuse buy to show modal (optional)
//       openBuyWindow(stock);
//     } else {
//       console.error("openSellWindow / openBuyWindow unavailable on GeneralContext.");
//       alert("Sell window unavailable.");
//     }
//   };

//   return (
//     <span className="actions">
//       <span>
//         {/* disablePortal + wrap button in span ensure MUI Popper sees a real DOM anchor */}
//         {/* <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow} disablePortal>
//           <span>
//             <button className="buy" onClick={handleBuyClick}>
//               Buy
//             </button>
//           </span>
//         </Tooltip> */}



// <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
//   <span>
//     <button className="buy" onClick={handleBuyClick}>Buy</button>
//   </span>
// </Tooltip>

//         <Tooltip title="Sell (S)" placement="top" arrow TransitionComponent={Grow} >
//           <span>
//             <button className="sell" onClick={handleSellClick}>
//               Sell
//             </button>
//           </span>
//         </Tooltip>

//         <Tooltip title="Analytics (A)" placement="top" arrow TransitionComponent={Grow} disablePortal>
//           <span>
//             <button className="action">
//               <BarChartOutlined className="icon" />
//             </button>
//           </span>
//         </Tooltip>

//         <Tooltip title="More" placement="top" arrow TransitionComponent={Grow} disablePortal>
//           <span>
//             <button className="action">
//               <MoreHoriz className="icon" />
//             </button>
//           </span>
//         </Tooltip>
//       </span>
//     </span>
//   );
// };



/* ---------------- WatchListActions (simple, no MUI Tooltip) ---------------- */
const WatchListActions = ({ uid }) => {
  // use the named GeneralContext export
  const ctx = useContext(GeneralContext);

  // defensive checks
  const openBuyWindow = ctx?.openBuyWindow;
  const openSellWindow = ctx?.openSellWindow;

  const handleBuyClick = () => {
    const stock = watchlist.find((s) => s.name === uid);
    if (typeof openBuyWindow === "function") {
      openBuyWindow(stock);
    } else {
      console.error("openBuyWindow is not available on GeneralContext:", openBuyWindow);
      alert("Buy window unavailable. Ensure the dashboard is wrapped with GeneralContextProvider.");
    }
  };

  const handleSellClick = () => {
    const stock = watchlist.find((s) => s.name === uid);
    if (typeof openSellWindow === "function") {
      openSellWindow(stock);
    } else if (typeof openBuyWindow === "function") {
      // fallback: if sell window not implemented, reuse buy to show modal (optional)
      openBuyWindow(stock);
    } else {
      console.error("openSellWindow / openBuyWindow unavailable on GeneralContext.");
      alert("Sell window unavailable.");
    }
  };

  return (
    <span className="actions" style={{ display: "inline-flex", gap: 8 }}>
      <button
        className="buy"
        onClick={handleBuyClick}
        title="Buy (B)"          /* native tooltip */
        aria-label={`Buy ${uid}`}
      >
        Buy
      </button>

      <button
        className="sell"
        onClick={handleSellClick}
        title="Sell (S)"
        aria-label={`Sell ${uid}`}
      >
        Sell
      </button>

      <button
        className="action"
        onClick={() => console.log("Analytics clicked for", uid)}
        title="Analytics (A)"
        aria-label={`Analytics ${uid}`}
      >
        <BarChartOutlined className="icon" />
      </button>

      <button
        className="action"
        onClick={() => console.log("More clicked for", uid)}
        title="More"
        aria-label={`More ${uid}`}
      >
        <MoreHoriz className="icon" />
      </button>
    </span>
  );
};
