import React, { useEffect, useState, useContext } from 'react';
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AuthContext } from '../index'; // chỉnh đúng path nếu khác

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [expenseData, setExpenseData] = useState([]);
  const [goalData, setGoalData] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const res = await fetch(`http://localhost:3000/users/${user.id}`);
        const data = await res.json();

        const sortedExpense = [...data.expenseHistory].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setExpenseData(sortedExpense);
        setGoalData(data.Goal);
      } catch (err) {
        console.error('Lỗi khi fetch dữ liệu user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const spendingYearly = expenseData
    .filter((item) => new Date(item.date).getFullYear() === currentYear)
    .reduce((sum, item) => sum + item.amount, 0);

  const spendingMonthly = expenseData
    .filter((item) => {
      const d = new Date(item.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    })
    .reduce((sum, item) => sum + item.amount, 0);

  const spendingDaily = expenseData
    .filter((item) => item.date === yesterdayStr)
    .reduce((sum, item) => sum + item.amount, 0);

  const yearlyGoal = goalData?.item?.yearlyGoal ?? null;
  const monthlyGoal = goalData?.item?.monthlyGoal ?? null;
  const dailyGoalEntry = goalData?.item?.dailyGoal?.find(
    (entry) => entry.date === yesterdayStr
  );
  const dailyGoal = dailyGoalEntry?.amount ?? null;

  const getColors = (spending, goal) => {
    const over = goal != null && spending > goal;
    return over ? ['#f87171', '#f87171'] : ['#bfdbfe', '#d1fae5'];
  };

  const daysToShow = 5;
  const dates = Array.from({ length: daysToShow }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (daysToShow - 1 - i));
    return d.toISOString().slice(0, 10);
  });

  const groupedData = dates.map((date) => {
    const sameDayItems = expenseData.filter((item) => item.date === date);
    const totalAmount = sameDayItems.reduce((sum, item) => sum + item.amount, 0);
    return { date, amount: totalAmount };
  });

  if (loading || !goalData || expenseData.length === 0)
    return <div className="p-4">Loading...</div>;

  return (
    <div className="px-6 py-4 space-y-6 bg-gray-50 min-h-screen">
      {/* Yearly */}
      <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
        <div>
          <div className="text-4xl font-semibold text-gray-700">
            {(yearlyGoal ? yearlyGoal - spendingYearly : 0)
              .toFixed(2)
              .replace('.', ',')}
          </div>
          <div className="text-gray-400 text-xl">yearly saving</div>
          <div className="mt-2 space-y-1 text-sm">
            <div>
              <span className="text-blue-700 font-semibold">Spending:</span>{' '}
              {spendingYearly.toFixed(2).replace('.', ',')}
            </div>
            <div>
              <span className="text-green-700 font-semibold">goal:</span>{' '}
              {yearlyGoal != null
                ? yearlyGoal.toFixed(2).replace('.', ',')
                : 'not set'}
            </div>
          </div>
        </div>
        <PieChart width={180} height={180}>
          <Pie
            data={[
              { name: 'Spending', value: spendingYearly },
              {
                name: 'Saving',
                value: yearlyGoal ? yearlyGoal - spendingYearly : 0,
              },
            ]}
            innerRadius={50}
            outerRadius={70}
            dataKey="value">
            {getColors(spendingYearly, yearlyGoal).map((color, index) => (
              <Cell key={index} fill={color} />
            ))}
          </Pie>
        </PieChart>
      </div>

      {/* Monthly & Daily */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Monthly */}
        <div className="bg-white p-4 mr-1 rounded-xl shadow flex flex-col items-center text-center">
          <div className="font-semibold text-lg mb-2">Monthly saving</div>
          <PieChart width={180} height={180}>
            <Pie
              data={[
                { name: 'Spending', value: spendingMonthly },
                {
                  name: 'Saving',
                  value: monthlyGoal ? monthlyGoal - spendingMonthly : 0,
                },
              ]}
              innerRadius={50}
              outerRadius={70}
              dataKey="value">
              {getColors(spendingMonthly, monthlyGoal).map((color, index) => (
                <Cell key={index} fill={color} />
              ))}
            </Pie>
          </PieChart>
          <div className="text-sm mt-2 space-y-1">
            <div>
              <span className="text-blue-700 font-semibold">Spending:</span>{' '}
              {spendingMonthly.toFixed(2).replace('.', ',')}
            </div>
            <div>
              <span className="text-green-700 font-semibold">goal:</span>{' '}
              {monthlyGoal != null
                ? monthlyGoal.toFixed(2).replace('.', ',')
                : 'not set'}
            </div>
          </div>
        </div>

        {/* Daily */}
        <div className="bg-white p-4 ml-1 rounded-xl shadow flex flex-col items-center text-center">
          <div className="font-semibold text-lg mb-2">daily saving</div>
          <PieChart width={180} height={180}>
            <Pie
              data={[
                { name: 'Spending', value: spendingDaily },
                {
                  name: 'Saving',
                  value: dailyGoal ? dailyGoal - spendingDaily : 0,
                },
              ]}
              innerRadius={50}
              outerRadius={70}
              dataKey="value">
              {getColors(spendingDaily, dailyGoal).map((color, index) => (
                <Cell key={index} fill={color} />
              ))}
            </Pie>
          </PieChart>
          <div className="text-sm mt-2 space-y-1">
            <div>
              <span className="text-blue-700 font-semibold">Spending:</span>{' '}
              {spendingDaily.toFixed(2).replace('.', ',')}
            </div>
            <div>
              <span className="text-green-700 font-semibold">goal:</span>{' '}
              {dailyGoal != null
                ? dailyGoal.toFixed(2).replace('.', ',')
                : 'not set'}
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="font-semibold text-lg mb-4">Expenses (Last 5 Days)</div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={groupedData}>
            <XAxis
              dataKey="date"
              tickFormatter={(dateStr) => {
                const d = new Date(dateStr);
                d.setDate(d.getDate() + 1);
                const day = d.getDate().toString().padStart(2, '0');
                const month = (d.getMonth() + 1).toString().padStart(2, '0');
                return `${day}/${month}`;
              }}
            />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#3b82f6"
              fill="#bfdbfe"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
