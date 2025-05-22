import React, { useEffect, useState, useMemo, useContext } from 'react';
import axios from 'axios';
import PiggyBank from '../../components/PiggyBank';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../index'; // giả sử AuthContext ở đây

const CashCard = ({ date, note, amount }) => {
  return (
    <div className="flex justify-between items-center shadow-md p-4 rounded-sm border-2">
      <div className="flex flex-col">
        <span className="text-gray-500">{date}</span>
        <span className="text-2xl">{note}</span>
      </div>
      <div className="flex flex-col">{amount} VND</div>
    </div>
  );
};

const BudgetAddSavingPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const filterDate = searchParams.get('date');

  const { user } = useContext(AuthContext);
  const [dailyGoal, setDailyGoal] = useState(0);
  const [expensesData, setExpensesData] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [saving, setSaving] = useState(0);

  const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const displayDate = useMemo(() => {
    if (!filterDate) return '';
    const dateObj = new Date(filterDate);
    dateObj.setDate(dateObj.getDate() - 1);
    return dateObj.toISOString().split('T')[0];
  }, [filterDate]);

  // Load user data when filterDate or user changes
  useEffect(() => {
    if (!filterDate || !user) return;

    // Lấy data user từ API
    axios.get(`${apiBase}/users/${user.id}`)
      .then(res => {
        const userData = res.data;

        // Lấy dailyGoal từ userData.Goal.item.dailyGoal
        const dailyGoals = userData.Goal?.item?.dailyGoal || [];
        const goalForDate = dailyGoals.find(g => g.date === filterDate);
        setDailyGoal(goalForDate ? goalForDate.amount : 0);

        // Lấy expenseHistory lọc theo ngày
        const allExpenses = userData.expenseHistory || [];
        const filtered = allExpenses.filter(item => item.date === filterDate);
        setExpensesData(filtered);

        const total = filtered.reduce((sum, item) => sum + item.amount, 0);
        setTotalExpense(total);
      })
      .catch(err => {
        console.error(err);
        setDailyGoal(0);
        setExpensesData([]);
        setTotalExpense(0);
      });
  }, [filterDate, user, apiBase]);

  useEffect(() => {
    setSaving(dailyGoal - totalExpense);
  }, [dailyGoal, totalExpense]);

  if (!user) return <div className="p-4 text-center">Please login to see your budget and saving.</div>;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div style={{ backgroundColor: '#D4F4E4' }}>
        <h1 className="p-6 text-2xl font-bold">Budget and Saving</h1>
      </div>

      <div className="flex flex-col items-center justify-center shadow-md m-6 p-4 gap-2">
        <div className="flex justify-center my-4">
          <PiggyBank value={saving} />
        </div>

        <div className="flex justify-between items-center w-full" style={{ color: '#707974' }}>
          <div>Goal ({displayDate}):</div>
          <div>{dailyGoal.toFixed(2).replace('.', ',')}</div>
        </div>
        <div className="flex justify-between items-center w-full" style={{ color: '#3799D2' }}>
          <div>Expense ({displayDate}):</div>
          <div>{totalExpense.toFixed(2).replace('.', ',')}</div>
        </div>
        <div style={{ color: '#006C52' }} className="flex justify-between items-center w-full">
          <div>Saving ({displayDate}):</div>
          <div>{saving.toFixed(2).replace('.', ',')}</div>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <h2 className="text-xl font-semibold mb-2">Expense ({displayDate})</h2>
        {expensesData.length > 0 ? (
          expensesData.map((expense, index) => (
            <CashCard
              key={expense.id || index}
              date={expense.date}
              note={expense.note}
              amount={expense.amount}
            />
          ))
        ) : (
          <div className="text-center text-gray-500">No expenses found.</div>
        )}
      </div>
    </div>
  );
};

export default BudgetAddSavingPage;
