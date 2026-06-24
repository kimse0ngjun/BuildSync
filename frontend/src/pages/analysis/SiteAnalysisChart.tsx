import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export const SiteAnalysisChart = ({ chartData }: { chartData: any[] }) => {
  // 차트 색 지정
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div
      style={{
        width: "100%",
        height: 350,
        backgroundColor: "#fff",
      }}
    >
      <ResponsiveContainer>
        <PieChart>
          <Pie data={chartData}>
            {chartData &&
              chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
          </Pie>

          <Tooltip formatter={(value: any) => `${value.toLocaleString()}원`} />

          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
