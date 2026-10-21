import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartFrame } from './AccuracyChart'

interface LossChartProps {
  training: number[]
  validation: number[]
}

export function LossChart({ training, validation }: LossChartProps) {
  const data = training.map((loss, index) => ({
    epoch: index + 1,
    training: loss,
    validation: validation[index] ?? 0,
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
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#89918b', fontSize: 10 }}
        />
        <Tooltip
          formatter={(value) => [Number(value).toFixed(4)]}
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
