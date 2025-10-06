
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { formatCurrency } from "@/lib/utils";

const data = [
  { name: "Jan", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Feb", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Mar", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Apr", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "May", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Jun", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Jul", total: Math.floor(Math.random() * 500000) + 100000 },
  { name_:"Aug", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Sep", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Oct", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Nov", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Dec", total: Math.floor(Math.random() * 500000) + 100000 },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatCurrency(value as number, 'NGN', 0)}
        />
        <Tooltip
            contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))'
            }}
            formatter={(value) => formatCurrency(value as number, 'NGN')}
        />
        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
