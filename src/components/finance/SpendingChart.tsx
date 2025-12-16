import { DailySpending } from '@/types/finance';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { formatCompactCurrency } from '@/lib/calculations';

interface SpendingChartProps {
  data: DailySpending[];
  currencySymbol?: string;
}

export function SpendingChart({ data, currencySymbol = '$' }: SpendingChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    day: format(parseISO(d.date), 'd'),
    label: format(parseISO(d.date), 'MMM d'),
  }));
  
  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickMargin={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickFormatter={(value) => formatCompactCurrency(value, currencySymbol)}
            width={50}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
              boxShadow: 'var(--shadow-md)',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
            formatter={(value: number) => [
              formatCompactCurrency(value, currencySymbol),
              'Spent',
            ]}
            labelFormatter={(label, payload) => {
              if (payload?.[0]?.payload?.label) {
                return payload[0].payload.label;
              }
              return label;
            }}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#colorSpending)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
