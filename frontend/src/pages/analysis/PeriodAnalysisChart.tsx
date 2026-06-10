import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export const PeriodAnalysisChart = ({ chartData }: { chartData: any[] }) => {
  return (
    <div
      style={{
        width: "100%",
        height: 400,
      }}
    >
      <ResponsiveContainer>
        <ComposedChart data={chartData}>
          <CartesianGrid />
          <XAxis dataKey="month" scale="band" />

          <YAxis
            yAxisId="left"
            tickFormatter={(value) => `${(value / 10000).toLocaleString()}만원`}
          />
          <YAxis yAxisId="right" orientation="right" />

          <Tooltip
            formatter={(value: any, name: any) => [
              name === "총 발주 금액"
                ? `${value.toLocaleString()}원`
                : `${value}건`,
              name,
            ]}
          />
          <Legend />

          <Bar yAxisId="left" dataKey="totalAmount" name="총 발주 금액" />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="projectCount"
            name="발주 건수"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
