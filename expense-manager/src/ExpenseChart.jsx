// src/ExpenseChart.jsx
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00C49F'];

function ExpenseChart({ expenses }) {
  // カテゴリごとに金額を集計
  const categoryTotals = expenses.reduce((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + Number(expense.amount);
    return totals;
  }, {});

  const data = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

  return (
    <div className="flex justify-center mt-6">
      <PieChart width={300} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={100}
          fill="#8884d8"
          startAngle={90}
          endAngle={-270}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default ExpenseChart;
