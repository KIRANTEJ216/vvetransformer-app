"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const COLORS = ["#1a1a2e", "#2d2d44", "#c9a84c"]

interface TaxData {
  name: string
  value: number
}

export function TaxDonutChart({ data }: { data: TaxData[] }) {
  if (data.every((d) => d.value === 0)) return null

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="flex items-center gap-6">
      <div className="w-40 h-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={32}
              outerRadius={56}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0].payload as TaxData
                return (
                  <div className="bg-[#1a1a2e] text-white px-4 py-3 rounded-lg shadow-xl text-xs border border-white/10">
                    <p className="text-white/60 mb-1">{d.name}</p>
                    <p className="font-bold text-sm">
                      ₹{d.value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2.5">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2.5">
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-xs text-[#8c8780] min-w-[60px]">{d.name}</span>
            <span className="text-xs font-semibold text-[#1a1a2e]">
              {total > 0 ? ((d.value / total) * 100).toFixed(1) : "0"}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
