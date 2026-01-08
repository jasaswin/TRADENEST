







// // dashboard/src/components/Summary.js
// import React, { useContext } from "react";
// import { GeneralContext } from "../GeneralContext";

// export default function Summary() {
//   const { userSummary = {}, loading } = useContext(GeneralContext) || {};

//   const balance = Number(userSummary.balance || 0);
//   const totalInvestment = Number(userSummary.totalInvestment || 0);
//   const currentValue = Number(userSummary.currentValue || 0);
//   const totalPL = Number(userSummary.totalPL || 0);
//   const equity = Number(userSummary.equity || 0);

//   const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
//   const username = storedUser?.username || "User";

//   return (
//     <>
//       <div className="username">
//         <h6>Hi, {username}!</h6>
//         <hr className="divider" />
//       </div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           {/* Equity Section */}
//           <div className="section">
//             <span>
//               <p>Equity</p>
//             </span>

//             <div className="data">
//               <div className="first">
//                 <h3>{equity.toFixed(2)}</h3>
//                 <p>Margin available</p>
//               </div>
//               <hr />
//               <div className="second">
//                 <p>Margins used <span>0</span></p>
//                 <p>Opening balance <span>{balance.toFixed(2)}</span></p>
//               </div>
//             </div>
//             <hr className="divider" />
//           </div>

//           {/* Holdings Section */}
//           <div className="section">
//             <span>
//               <p>Holdings</p>
//             </span>

//             <div className="data">
//               <div className="first">
//                 <h3 className={totalPL >= 0 ? "profit" : "loss"}>
//                   {totalPL.toFixed(2)}
//                   <small>
//                     {totalInvestment
//                       ? ` (${((totalPL / totalInvestment) * 100).toFixed(2)}%)`
//                       : ""}
//                   </small>
//                 </h3>
//                 <p>P&L</p>
//               </div>
//               <hr />

//               <div className="second">
//                 <p>Current Value <span>{currentValue.toFixed(2)}</span></p>
//                 <p>Investment <span>{totalInvestment.toFixed(2)}</span></p>
//               </div>
//             </div>
//             <hr className="divider" />
//           </div>
//         </>
//       )}
//     </>
//   );
// }








// dashboard/src/components/Summary.js
import React, { useContext, useMemo } from "react";
import { GeneralContext } from "../GeneralContext";

import PortfolioMovement from "./PortfolioMovement";



export default function Summary() {
  // Now read holdings too so summary can be computed reliably from holdings
  const { userSummary = {}, loading, holdings = [] } = useContext(GeneralContext) || {};

  // Prefer computing summary from holdings if available, otherwise fallback to userSummary
  const computed = useMemo(() => {
    if (Array.isArray(holdings) && holdings.length > 0) {
      const totalInvestment = holdings.reduce((acc, h) => {
        const qty = Number(h.qty) || 0;
        const avg = Number(h.avg) || 0;
        return acc + qty * avg;
      }, 0);

      const currentValue = holdings.reduce((acc, h) => {
        const qty = Number(h.qty) || 0;
        const price = Number(h.price ?? h.ltp ?? h.curVal) || 0;
        return acc + qty * price;
      }, 0);

      const totalPL = currentValue - totalInvestment;

      return {
        fromHoldings: true,
        totalInvestment,
        currentValue,
        totalPL,
      };
    }

    // fallback to userSummary (when holdings not present)
    return {
      fromHoldings: false,
      totalInvestment: Number(userSummary.totalInvestment || 0),
      currentValue: Number(userSummary.currentValue || 0),
      totalPL: Number(userSummary.totalPL || 0),
    };
  }, [holdings, userSummary]);


  // <PortfolioMovement days={30} />


  const balance = Number(userSummary.balance || 0);
  const equity = Number(userSummary.equity || 0);

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch (e) {
      return {};
    }
  })();

  const username = storedUser?.username || "User";

  // helper for percent display, guard division by zero
  const pct = computed.totalInvestment !== 0 ? (computed.totalPL / computed.totalInvestment) * 100 : 0;

  return (
    <>
      <div className="username">
        <h6>Hi, {username}!</h6>
        <hr className="divider" />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Equity Section */}
          <div className="section">
            <span>
              <p>Equity</p>
            </span>

            <div className="data">
              <div className="first">
                <h3>{Number(equity || 0).toFixed(2)}</h3>
                <p>Margin available</p>
              </div>
              <hr />
              <div className="second">
                <p>Margins used <span>0</span></p>
                <p>Opening balance <span>{balance.toFixed(2)}</span></p>
              </div>
            </div>
            <hr className="divider" />
          </div>



            <div className="section">
            <PortfolioMovement days={30} />
          </div>

          {/* Holdings Section */}
          <div className="section">
            <span>
              <p>Holdings</p>
            </span>

            <div className="data">
              <div className="first">
                <h3 className={computed.totalPL >= 0 ? "profit" : "loss"}>
                  {computed.totalPL.toFixed(2)}
                  <small>
                    {computed.totalInvestment
                      ? ` (${pct.toFixed(2)}%)`
                      : " (0.00%)"}
                  </small>
                </h3>
                <p>P&L</p>
                {computed.fromHoldings ? (
                  <small style={{ color: "#666" }}>Calculated from holdings</small>
                ) : null}
              </div>
              <hr />

              <div className="second">
                <p>Current Value <span>{computed.currentValue.toFixed(2)}</span></p>
                <p>Investment <span>{computed.totalInvestment.toFixed(2)}</span></p>
              </div>
            </div>
            <hr className="divider" />
          </div>
        </>
      )}
    </>
  );
}
