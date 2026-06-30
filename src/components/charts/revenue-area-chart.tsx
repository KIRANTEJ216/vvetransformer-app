"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

interface DataPoint {
  month: string
  revenue: number
  count: number
}

export function RevenueAreaChart({ data }: { data: DataPoint[] }) {
  if (data.length === 0) return null

  const formatCurrency = (v: number) =>
    `₹${v.toLocaleString("en-IN", { minimumFractionDigits: 0 })}`

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9a84c" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#c9a84c" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e8e4de" vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#8c8780", fontSize: 11 }}
        />
        <YAxis
          tickFormatter={formatCurrency}
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#8c8780", fontSize: 11 }}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null
            const val = payload[0].value as number
            return (
              <div className="bg-[#1a1a2e] text-white px-4 py-3 rounded-lg shadow-xl text-xs border border-white/10">
                <p className="text-white/60 mb-1">{label}</p>
                <p className="font-bold text-[#c9a84c] text-sm">{formatCurrency(val)}</p>
              </div>
            )
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#c9a84c"
          strokeWidth={2}
          fill="url(#revenueGradient)"
          dot={false}
          activeDot={{ r: 4, fill: "#c9a84c", stroke: "#fff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
