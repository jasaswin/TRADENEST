
import React, { useContext, useMemo } from "react";
import { GeneralContext } from "../GeneralContext";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function PortfolioMovement({ days = 30, historical = null }) {
  const { userSummary = {}, holdings = [] } = useContext(GeneralContext) || {};

  // -----------------------------
  // Generate synthetic history if no real history passed
  // -----------------------------
  const synthesizeSeries = (startValue, n) => {
    const series = [];
    let value = Number(startValue || 0);

    // If no value, calculate from holdings
    if (!value) {
      value = holdings.reduce((acc, it) => {
        const qty = Number(it.qty || 0);
        const price = Number(it.price || it.ltp || it.curVal || 0);
        return acc + qty * price;
      }, 0);
    }

    if (!value) {
      // still zero? fallback simple series
      for (let i = n - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        series.push({
          date: d.toISOString().slice(0, 10),
          value: 100,
        });
      }
      return series;
    }

    const rng = () => (Math.random() - 0.5) * 0.02; // ±1%

    const temp = new Array(n).fill(0);
    temp[n - 1] = value;

    for (let i = n - 2; i >= 0; i--) {
      const pct = rng();
      let prev = temp[i + 1] / (1 + pct);
      if (i < n - 3) prev = (prev + temp[i + 2]) / 2;
      temp[i] = Number(prev.toFixed(2));
    }

    for (let i = 0; i < n; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (n - 1 - i));
      series.push({
        date: d.toISOString().slice(0, 10),
        value: temp[i],
      });
    }

    return series;
  };

  // -----------------------------
  // Data to display in the chart
  // -----------------------------
  const data = useMemo(() => {
    if (Array.isArray(historical) && historical.length > 0) {
      return historical.map((r) => ({
        date: String(r.date),
        value: Number(r.value),
      }));
    }

    const currentValue = Number(userSummary.currentValue || 0);
    return synthesizeSeries(currentValue, days);
  }, [historical, userSummary.currentValue, holdings, days]);

  const formatY = (v) => {
    if (v >= 10000000) return (v / 10000000).toFixed(2) + "Cr";
    if (v >= 100000) return (v / 100000).toFixed(2) + "L";
    return v.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const tooltipFormatter = (value) => [formatY(value), "Portfolio"];

  return (
    <div
      style={{
        width: "100%",
        height: 260,
        padding: 12,
        background: "#fff",
        borderRadius: 8,
      }}
    >
      <h4 style={{ margin: "4px 0 8px 8px", fontWeight: 600 }}>
        Portfolio Movement
      </h4>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 16, left: -8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} minTickGap={10} />
          <YAxis tickFormatter={formatY} width={70} />
          <Tooltip
            formatter={tooltipFormatter}
            labelFormatter={(l) => "Date: " + l}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2ecc71"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
