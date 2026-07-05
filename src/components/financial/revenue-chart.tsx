"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts"

interface ChartData {
  month: string
  revenue: number
  count?: number
}

interface RevenueChartProps {
  data: ChartData[]
  color?: string
  gradientId?: string
  height?: number
}

export function RevenueChart({
  data,
  color = "#5750f1",
  gradientId = "revenueGradient",
  height = 300,
}: RevenueChartProps) {
  if (data.length === 0) return null

  const formatRupee = (value: number) =>
    `\u20B9${value.toLocaleString("en-IN")}`

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27303e" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            tickFormatter={(v) => `\u20B9${(v / 100000).toFixed(1)}L`}
          />
          <Tooltip
            contentStyle={{
              background: "#1f2a37",
              border: "1px solid #27303e",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "13px",
            }}
            formatter={(value) => [formatRupee(Number(value)), "Revenue"]}
            labelStyle={{ color: "#9ca3af" }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            fill={`url(#${gradientId})`}
            stroke="none"
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke={color}
            strokeWidth={2.5}
            dot={{ fill: color, stroke: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
