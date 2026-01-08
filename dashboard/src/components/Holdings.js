
// import React, { useState, useEffect } from "react";
// import axios, { all } from "axios";
// import { VerticalGraph } from "./VerticalGraph";

// import { Holdings } from "..data/data";

// const Holdings = () => {
//   const [allHoldings, setAllHoldings] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:3002/allHoldings").then((res) => {
//       // console.log(res.data);
//       setAllHoldings(res.data);
//     });
//   }, []);

//   // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
//   const labels = allHoldings.map((subArray) => subArray["name"]);

//   const data = {
//     labels,
//     datasets: [
//       {
//         label: "Stock Price",
//         data: allHoldings.map((stock) => stock.price),
//         backgroundColor: "rgba(255, 99, 132, 0.5)",
//       },
//     ],
//   };

//   // export const data = {
//   //   labels,
//   //   datasets: [
//   // {
//   //   label: 'Dataset 1',
//   //   data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//   //   backgroundColor: 'rgba(255, 99, 132, 0.5)',
//   // },
//   //     {
//   //       label: 'Dataset 2',
//   //       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//   //       backgroundColor: 'rgba(53, 162, 235, 0.5)',
//   //     },
//   //   ],
//   // };

//   return (
//     <>
//       <h3 className="title">Holdings ({allHoldings.length})</h3>

//       <div className="order-table">
//         <table>
//           <tr>
//             <th>Instrument</th>
//             <th>Qty.</th>
//             <th>Avg. cost</th>
//             <th>LTP</th>
//             <th>Cur. val</th>
//             <th>P&L</th>
//             <th>Net chg.</th>
//             <th>Day chg.</th>
//           </tr>

//           {allHoldings.map((stock, index) => {
//             const curValue = stock.price * stock.qty;
//             const isProfit = curValue - stock.avg * stock.qty >= 0.0;
//             const profClass = isProfit ? "profit" : "loss";
//             const dayClass = stock.isLoss ? "loss" : "profit";

//             return (
//               <tr key={index}>
//                 <td>{stock.name}</td>
//                 <td>{stock.qty}</td>
//                 <td>{stock.avg.toFixed(2)}</td>
//                 <td>{stock.price.toFixed(2)}</td>
//                 <td>{curValue.toFixed(2)}</td>
//                 <td className={profClass}>
//                   {(curValue - stock.avg * stock.qty).toFixed(2)}
//                 </td>
//                 <td className={profClass}>{stock.net}</td>
//                 <td className={dayClass}>{stock.day}</td>
//               </tr>
//             );
//           })}
//         </table>
//       </div>

//       <div className="row">
//         <div className="col">
//           <h5>
//             29,875.<span>55</span>{" "}
//           </h5>
//           <p>Total investment</p>
//         </div>
//         <div className="col">
//           <h5>
//             31,428.<span>95</span>{" "}
//           </h5>
//           <p>Current value</p>
//         </div>
//         <div className="col">
//           <h5>1,553.40 (+5.20%)</h5>
//           <p>P&L</p>
//         </div>
//       </div>
//       <VerticalGraph data={data} />
//     </>
//   );
// };

// export default Holdings;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { VerticalGraph } from "./VerticalGraph";


// const token = localStorage.getItem("token");

// const response = await fetch("http://localhost:3002/allHoldings", {
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// });

// const data = await response.json();
// console.log(data);


// const Holdings = () => {
//   const [allHoldings, setAllHoldings] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:3002/allHoldings").then((res) => {
//       setAllHoldings(res.data);
//     });
//   }, []);

//   const labels = allHoldings.map((stock) => stock.name);

//   const data = {
//     labels,
//     datasets: [
//       {
//         label: "Stock Price",
//         data: allHoldings.map((stock) => stock.price),
//         backgroundColor: "rgba(255, 99, 132, 0.5)",
//       },
//     ],
//   };

//   return (
//     <>
//       <h3 className="title">Holdings ({allHoldings.length})</h3>

//       <div className="order-table">
//         <table>
//           <thead>
//             <tr>
//               <th>Instrument</th>
//               <th>Qty.</th>
//               <th>Avg. cost</th>
//               <th>LTP</th>
//               <th>Cur. val</th>
//               <th>P&L</th>
//               <th>Net chg.</th>
//               <th>Day chg.</th>
//             </tr>
//           </thead>
//           <tbody>
//             {allHoldings.map((stock, index) => {
//               const curValue = stock.price * stock.qty;
//               const isProfit = curValue - stock.avg * stock.qty >= 0.0;
//               const profClass = isProfit ? "profit" : "loss";
//               const dayClass = stock.isLoss ? "loss" : "profit";

//               return (
//                 <tr key={index}>
//                   <td>{stock.name}</td>
//                   <td>{stock.qty}</td>
//                   <td>{stock.avg.toFixed(2)}</td>
//                   <td>{stock.price.toFixed(2)}</td>
//                   <td>{curValue.toFixed(2)}</td>
//                   <td className={profClass}>
//                     {(curValue - stock.avg * stock.qty).toFixed(2)}
//                   </td>
//                   <td className={profClass}>{stock.net}</td>
//                   <td className={dayClass}>{stock.day}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       <div className="row">
//         <div className="col">
//           <h5>
//             29,875.<span>55</span>
//           </h5>
//           <p>Total investment</p>
//         </div>
//         <div className="col">
//           <h5>
//             31,428.<span>95</span>
//           </h5>
//           <p>Current value</p>
//         </div>
//         <div className="col">
//           <h5>1,553.40 (+5.20%)</h5>
//           <p>P&L</p>
//         </div>
//       </div>

//       <VerticalGraph data={data} />
//     </>
//   );
// };

// export default Holdings;




// // dashboard/src/components/Holdings.js
// import React, { useContext } from "react";
// import { VerticalGraph } from "./VerticalGraph";
// // import  GeneralContext  from "../GeneralContext";

// import { GeneralContext } from "../GeneralContext";


// const Holdings = () => {
//   const { holdings } = useContext(GeneralContext);

//   const labels = holdings.map((stock) => stock.name);
//   const chartData = {
//     labels,
//     datasets: [
//       {
//         label: "Stock Price",
//         data: holdings.map((stock) => stock.price || 0),
//         backgroundColor: "rgba(255, 99, 132, 0.5)",
//       },
//     ],
//   };

//   return (
//     <>
//       <h3 className="title">Holdings ({holdings.length})</h3>

//       <div className="order-table">
//         <table>
//           <thead>
//             <tr>
//               <th>Instrument</th>
//               <th>Qty.</th>
//               <th>Avg. cost</th>
//               <th>LTP</th>
//               <th>Cur. val</th>
//               <th>P&L</th>
//               <th>Net chg.</th>
//               <th>Day chg.</th>
//             </tr>
//           </thead>
//           <tbody>
//             {holdings.map((stock, index) => {
//               const qty = stock.qty || 0;
//               const avg = stock.avg || 0;
//               const price = stock.price || 0;
//               const curValue = price * qty;
//               const isProfit = curValue - avg * qty >= 0;
//               const profClass = isProfit ? "profit" : "loss";
//               const dayClass = stock.isLoss ? "loss" : "profit";

//               return (
//                 <tr key={stock._id || index}>
//                   <td>{stock.name}</td>
//                   <td>{qty}</td>
//                   <td>{avg.toFixed(2)}</td>
//                   <td>{price.toFixed(2)}</td>
//                   <td>{curValue.toFixed(2)}</td>
//                   <td className={profClass}>
//                     {(curValue - avg * qty).toFixed(2)}
//                   </td>
//                   <td className={profClass}>{stock.net}</td>
//                   <td className={dayClass}>{stock.day}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       <div className="row">
//         <div className="col">
//           <h5>
//             29,875.<span>55</span>
//           </h5>
//           <p>Total investment</p>
//         </div>
//         <div className="col">
//           <h5>
//             31,428.<span>95</span>
//           </h5>
//           <p>Current value</p>
//         </div>
//         <div className="col">
//           <h5>1,553.40 (+5.20%)</h5>
//           <p>P&L</p>
//         </div>
//       </div>

//       <VerticalGraph data={chartData} />
//     </>
//   );
// };

// export default Holdings;




// import React, { useContext } from "react";
// import { GeneralContext } from "../GeneralContext";
// import { VerticalGraph } from "./VerticalGraph";

// const Holdings = () => {
//   const { holdings = [] } = useContext(GeneralContext);

//   // If you need to compute labels/data for the graph:
//   const labels = holdings.map((s) => s.name || "");

//   const data = {
//     labels,
//     datasets: [
//       {
//         label: "Stock Price",
//         data: holdings.map((s) => s.price || 0),
//         // do not set explicit colors unless you want
//       },
//     ],
//   };


//   const totalInvestment = holdings.reduce((acc, h) => acc + h.avg * h.qty, 0);
// const currentValue = holdings.reduce((acc, h) => acc + h.price * h.qty, 0);
// const totalPL = currentValue - totalInvestment;


//   return (
//     <>
//       <h3 className="title">Holdings ({holdings.length})</h3>

//       <div className="order-table">
//         <table>
//           <thead>
//             <tr>
//               <th>Instrument</th>
//               <th>Qty.</th>
//               <th>Avg. cost</th>
//               <th>LTP</th>
//               <th>Cur. val</th>
//               <th>P&L</th>
//               <th>Net chg.</th>
//               <th>Day chg.</th>
//             </tr>
//           </thead>
//           <tbody>
//             {holdings.map((stock, index) => {
//               const curValue = (stock.price || 0) * (stock.qty || 0);
//               const isProfit = curValue - (stock.avg || 0) * (stock.qty || 0) >= 0.0;
//               const profClass = isProfit ? "profit" : "loss";
//               const dayClass = stock.isLoss ? "loss" : "profit";

//               return (
//                 <tr key={stock._id || index}>
//                   <td>{stock.name}</td>
//                   <td>{stock.qty}</td>
//                   <td>{(stock.avg || 0).toFixed(2)}</td>
//                   <td>{(stock.price || 0).toFixed(2)}</td>
//                   <td>{curValue.toFixed(2)}</td>
//                   <td className={profClass}>
//                     {(curValue - (stock.avg || 0) * (stock.qty || 0)).toFixed(2)}
//                   </td>
//                   <td className={profClass}>{stock.net}</td>
//                   <td className={dayClass}>{stock.day}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* <div className="row">
//         <div className="col">
//           <h5>
//             29,875.<span>55</span>
//           </h5>
//           <p>Total investment</p>
//         </div>
//         <div className="col">
//           <h5>
//             31,428.<span>95</span>
//           </h5>
//           <p>Current value</p>
//         </div>
//         <div className="col">
//           <h5>1,553.40 (+5.20%)</h5>
//           <p>P&L</p>
//         </div>
//       </div> */}


//       <div className="row">
//   <div className="col">
//     <h5>{totalInvestment.toFixed(2)}</h5>
//     <p>Total investment</p>
//   </div>
//   <div className="col">
//     <h5>{currentValue.toFixed(2)}</h5>
//     <p>Current value</p>
//   </div>
//   <div className="col">
//     <h5 className={totalPL >= 0 ? "profit" : "loss"}>
//       {totalPL.toFixed(2)} ({((totalPL / totalInvestment) * 100 || 0).toFixed(2)}%)
//     </h5>
//     <p>P&amp;L</p>
//   </div>
// </div>


//       <VerticalGraph data={data} />
//     </>
//   );
// };


// export default Holdings;














import React, { useContext } from "react";
import { GeneralContext } from "../GeneralContext";
import { VerticalGraph } from "./VerticalGraph";

const Holdings = () => {
  const { holdings = [] } = useContext(GeneralContext);

  // If you need to compute labels/data for the graph:
  const labels = holdings.map((s) => s.name || "");

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: holdings.map((s) => Number(s.price) || 0),
        // do not set explicit colors unless you want
      },
    ],
  };

  // Robust calculations (handle strings, missing fields)
  const totalInvestment = holdings.reduce((acc, h) => {
    const qty = Number(h.qty) || 0;
    const avg = Number(h.avg) || 0;
    return acc + qty * avg;
  }, 0);

  const currentValue = holdings.reduce((acc, h) => {
    const qty = Number(h.qty) || 0;
    // prefer `price` (LTP) if present, otherwise fallback to curVal or 0
    const price = Number(h.price ?? h.ltp ?? h.curVal) || 0;
    return acc + qty * price;
  }, 0);

  const totalPL = currentValue - totalInvestment;

  return (
    <>
      <h3 className="title">Holdings ({holdings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((stock, index) => {
              const qty = Number(stock.qty) || 0;
              const avg = Number(stock.avg) || 0;
              const price = Number(stock.price ?? stock.ltp ?? 0) || 0;
              const curValue = price * qty;
              const profitValue = curValue - avg * qty;
              const isProfit = profitValue >= 0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={stock._id || index}>
                  <td>{stock.name}</td>
                  <td>{qty}</td>
                  <td>{avg.toFixed(2)}</td>
                  <td>{price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profClass}>{profitValue.toFixed(2)}</td>
                  <td className={profClass}>{stock.net ?? "-"}</td>
                  <td className={dayClass}>{stock.day ?? "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>{totalInvestment.toFixed(2)}</h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>{currentValue.toFixed(2)}</h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 className={totalPL >= 0 ? "profit" : "loss"}>
            {totalPL.toFixed(2)} (
            {totalInvestment !== 0
              ? `${((totalPL / totalInvestment) * 100).toFixed(2)}%`
              : "0.00%"}
            )
          </h5>
          <p>P&amp;L</p>
        </div>
      </div>

      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
