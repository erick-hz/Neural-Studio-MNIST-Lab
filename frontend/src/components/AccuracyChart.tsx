import type { ReactElement } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface AccuracyChartProps {
  training: number[]
  validation: number[]
}

export function AccuracyChart({ training, validation }: AccuracyChartProps) {
  const data = training.map((accuracy, index) => ({
    epoch: index + 1,
    training: accuracy * 100,
    validation: (validation[index] ?? 0) * 100,
  }))
  return (
    <ChartFrame empty={!data.length}>
      <LineChart
        data={data}
        margin={{ top: 8, right: 10, bottom: 0, left: -18 }}
      >
        <CartesianGrid stroke="#29302b" strokeDasharray="3 5" />
        <XAxis
          dataKey="epoch"
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#89918b', fontSize: 11 }}
        />
        <YAxis
          domain={[0, 100]}
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#89918b', fontSize: 10 }}
        />
        <Tooltip
          formatter={(value) => [`${Number(value).toFixed(2)}%`]}
          labelFormatter={(epoch) => `Epoch ${epoch}`}
          contentStyle={{
            background: '#1b211d',
            border: '1px solid #353e37',
            borderRadius: 6,
          }}
        />
        <Line
          type="monotone"
          dataKey="training"
          name="Training"
          stroke="#a8d78e"
          strokeWidth={2}
          dot={{ r: 2, fill: '#a8d78e' }}
        />
        <Line
          type="monotone"
          dataKey="validation"
          name="Validation"
          stroke="#e3a765"
          strokeWidth={2}
          dot={{ r: 2, fill: '#e3a765' }}
        />
      </LineChart>
    </ChartFrame>
  )
}

export function ChartFrame({
  children,
  empty,
}: {
  children: ReactElement
  empty: boolean
}) {
  if (empty)
    return (
      <div className="chart-empty">
        Real training metrics will appear after the model has been trained.
      </div>
    )
  return (
    <div className="chart-frame">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}
