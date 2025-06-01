import React, { useState, useEffect, useRef, useContext } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Input } from '../../components/input';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../index';

const AddDailyBudgetPages = () => {
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [expenseInfo, setExpenseInfo] = useState(null);
  const [goalInfo, setGoalInfo] = useState(null);
  const [popupPos, setPopupPos] = useState(null);
  const [tab, setTab] = useState('expense');
  const [goalType, setGoalType] = useState('daily');
  const navigate = useNavigate();

  const calendarRef = useRef(null);
  const popupRef = useRef(null);

  const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  const formatDate = (d) => d.toISOString().split('T')[0];

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Reset amount và note khi đổi tab hoặc goalType
  useEffect(() => {
    setAmount('');
    setNote('');
  }, [tab, goalType]);

  const fetchData = async (selectedDate) => {
    const isoDate = formatDate(selectedDate);

    try {
      const res = await fetch(`${apiBase}/users/${user.id}`);
      const data = await res.json();

      // Lấy tổng expense trong ngày
      const expenses = data.expenseHistory?.filter(e => e.date === isoDate) || [];
      const totalExpense = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
      setExpenseInfo({ amount: totalExpense });

      // Lấy goal trong ngày (dựa vào dailyGoal, có thể tùy chỉnh)
      let goalItem = null;
      if (tab === 'goal') {
        const goals = data.Goal?.item || {};
        if (goalType === 'daily') {
          goalItem = (goals.dailyGoal || []).find(g => g.date === isoDate) || null;
        } else if (goalType === 'monthly') {
          goalItem = goals.monthlyGoal != null ? { amount: goals.monthlyGoal } : null;
        } else if (goalType === 'yearly') {
          goalItem = goals.yearlyGoal != null ? { amount: goals.yearlyGoal } : null;
        }
      } else {
        // Nếu tab là expense thì lấy dailyGoal tương ứng để hiển thị
        const goals = data.Goal?.item || {};
        goalItem = (goals.dailyGoal || []).find(g => g.date === isoDate) || null;
      }
      setGoalInfo(goalItem);
    } catch (err) {
      console.error('Error fetching data:', err);
      setExpenseInfo(null);
      setGoalInfo(null);
    }
  };

  // Gọi fetchData khi date, tab hoặc goalType thay đổi
  useEffect(() => {
    if (user) {
      fetchData(date);
    }
  }, [date, tab, goalType, user]);

  const handleDayClick = (value, event = null) => {
    setDate(value);

    // Chỉ hiện popup nếu tab === 'expense' hoặc goalType === 'daily'
    if ((tab === 'expense' || goalType === 'daily') && event && event.target && calendarRef.current) {
      const rect = event.target.getBoundingClientRect();
      const calendarRect = calendarRef.current.getBoundingClientRect();
      setPopupPos({
        top: rect.bottom - calendarRect.top + 5,
        left: rect.left - calendarRect.left,
      });
    } else {
      setPopupPos(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setPopupPos(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConfirm = async () => {
    if (!amount) {
      alert('Please enter an amount');
      return;
    }

    const isoDate = formatDate(date);
    const newAmount = Number(amount);
    if (isNaN(newAmount) || newAmount <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }

    try {
      // Fetch dữ liệu mới nhất trước khi cập nhật
      const res = await fetch(`${apiBase}/users/${user.id}`);
      const data = await res.json();

      if (tab === 'expense') {
        const newExpense = {
          id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
          date: isoDate,
          amount: newAmount,
          note: note || '',
        };

        const updatedExpenses = [...(data.expenseHistory || []), newExpense];

        await fetch(`${apiBase}/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ expenseHistory: updatedExpenses }),
        });
      } else if (tab === 'goal') {
        const goalItem = { ...(data.Goal?.item || {}) };

        if (goalType === 'daily') {
          const dailyGoals = [...(goalItem.dailyGoal || [])];
          const existingIndex = dailyGoals.findIndex((g) => g.date === isoDate);
          if (existingIndex !== -1) {
            dailyGoals[existingIndex] = { ...dailyGoals[existingIndex], amount: newAmount };
          } else {
            dailyGoals.push({ date: isoDate, amount: newAmount });
          }
          goalItem.dailyGoal = dailyGoals;
        } else if (goalType === 'monthly') {
          goalItem.monthlyGoal = newAmount;
        } else if (goalType === 'yearly') {
          goalItem.yearlyGoal = newAmount;
        }

        await fetch(`${apiBase}/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Goal: { item: goalItem } }),
        });
      }

      setAmount('');
      setNote('');
      await fetchData(date);

      // Cập nhật lại popupPos nếu đang ở tab expense hoặc daily goal
      if (tab === 'expense' || goalType === 'daily') {
        if (calendarRef.current) {
          const calendarRect = calendarRef.current.getBoundingClientRect();
          const todayCell = calendarRef.current.querySelector('.react-calendar__tile--active');
          if (todayCell) {
            const rect = todayCell.getBoundingClientRect();
            setPopupPos({
              top: rect.bottom - calendarRect.top + 5,
              left: rect.left - calendarRect.left,
            });
          }
        }
      } else {
        setPopupPos(null);
      }

      alert('Saved!');
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Check the console.');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen relative">
      <div style={{ backgroundColor: '#D4F4E4' }}>
        <h1 className="p-6 text-2xl font-bold">{tab === 'expense' ? 'Add daily expense' : 'Set goal'}</h1>

        <div className="grid grid-cols-2">
          <div
            onClick={() => setTab('expense')}
            className={`text-center p-2 cursor-pointer border-b-4 ${
              tab === 'expense' ? 'text-[#006C52] border-[#006C52]' : 'border-transparent text-gray-400'
            }`}
          >
            New expense
          </div>
          <div
            onClick={() => setTab('goal')}
            className={`text-center p-2 cursor-pointer border-b-4 ${
              tab === 'goal' ? 'text-[#006C52] border-[#006C52]' : 'border-transparent text-gray-400'
            }`}
          >
            New goal
          </div>
        </div>
      </div>

      <div className="flex border-x-0 my-2 mx-2 justify-center items-baseline">
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          placeholder="(VND)"
          className="w-full border p-2 rounded"
        />
      </div>

      {tab === 'goal' && (
        <div className="mx-2 mb-2">
          <label className="block mb-1 font-semibold">Goal type</label>
          <select
            value={goalType}
            onChange={(e) => setGoalType(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="daily">Daily Goal</option>
            <option value="monthly">Monthly Goal</option>
            <option value="yearly">Yearly Goal</option>
          </select>
        </div>
      )}

      {tab === 'expense' && (
        <div className="mx-2">
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            type="text"
            placeholder="Enter note (optional)"
            className="w-full border p-2 rounded"
          />
        </div>
      )}

      <div className="m-4 text-center">
        <button
          onClick={handleConfirm}
          className="text-white w-60 rounded-sm p-2"
          style={{ backgroundColor: '#1CA380' }}
        >
          Confirm
        </button>
      </div>

      <div className="flex justify-center relative" ref={calendarRef}>
        <Calendar
          value={date}
          onClickDay={handleDayClick}
          className="rounded-md border text-xl z-10"
        />

        {popupPos && (
          <div
            ref={popupRef}
            className="absolute bg-white shadow-xl rounded-md p-4 w-40 border z-20 animate-fade-in"
            style={{ top: popupPos.top, left: popupPos.left }}
          >
            <p className="font-semibold">{formatDate(date)}</p>
            {expenseInfo ? (
              <p className="text-green-700 text-sm">expensed: {expenseInfo.amount} VND</p>
            ) : (
              <p className="text-gray-500 text-sm">expensed: 0 VND</p>
            )}
            {goalInfo ? (
              <p className="text-blue-600 text-sm">Goal: {goalInfo.amount} VND</p>
            ) : (
              <p className="text-gray-500 text-sm">No goal set</p>
            )}
            <button
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => navigate(`/budget-and-saving?date=${formatDate(date)}`)}
            >
              Detail
            </button>
          </div>
        )}
      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.2s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AddDailyBudgetPages;
