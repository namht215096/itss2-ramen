import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Input } from '../../components/input';
import { useNavigate } from 'react-router-dom';


const AddDailyBudgetPages = () => {
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [expenseInfo, setExpenseInfo] = useState(null);
  const [goalInfo, setGoalInfo] = useState(null);
  const [popupPos, setPopupPos] = useState(null);
  const [tab, setTab] = useState('expense');
  const navigate = useNavigate();

  const calendarRef = useRef(null);
  const popupRef = useRef(null);

  const apiBase =
    process.env.REACT_APP_API_URL ||
    process.env.API_URL ||
    window.API_URL ||
    'http://localhost:3000';

  const formatDate = (d) => d.toISOString().split('T')[0];

  const fetchData = async (selectedDate) => {
    const isoDate = formatDate(selectedDate);

    try {
      const expenseRes = await fetch(`${apiBase}/expenseHistory?date=${isoDate}`);
      const expenseData = await expenseRes.json();
      const totalExpense = expenseData.reduce((sum, item) => sum + (item.amount || 0), 0);
      setExpenseInfo({ amount: totalExpense });

      const goalRes = await fetch(`${apiBase}/Goal`);
      const goalData = await goalRes.json();
      const dailyGoal = goalData.item?.dailyGoal?.find((item) => item.date === isoDate);
      setGoalInfo(dailyGoal || null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setExpenseInfo(null);
      setGoalInfo(null);
    }
  };

  const handleDayClick = async (value, event) => {
    setDate(value);
    await fetchData(value);

    const rect = event.target.getBoundingClientRect();
    const calendarRect = calendarRef.current.getBoundingClientRect();
    setPopupPos({
      top: rect.bottom - calendarRect.top + 5,
      left: rect.left - calendarRect.left,
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target)
      ) {
        setPopupPos(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConfirm = async () => {
    if (!amount) return;
    const isoDate = formatDate(date);
    const newAmount = Number(amount);

    try {
      if (tab === 'expense') {
        await fetch(`${apiBase}/expenseHistory`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: isoDate,
            amount: newAmount,
            note: note || '',
          }),
        });
      } else if (tab === 'goal') {
        const goalRes = await fetch(`${apiBase}/Goal`);
        const goalData = await goalRes.json();
        const goalItem = goalData.item || {};
        const dailyGoals = goalItem.dailyGoal || [];

        const existingIndex = dailyGoals.findIndex((g) => g.date === isoDate);
        if (existingIndex !== -1) {
          dailyGoals[existingIndex].amount = newAmount;
        } else {
          dailyGoals.push({ date: isoDate, amount: newAmount });
        }

        await fetch(`${apiBase}/Goal`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            item: {
              ...goalItem,
              dailyGoal: dailyGoals,
            },
          }),
        });
      }

      setAmount('');
      setNote('');
      await fetchData(date);
      alert('Saved!');
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Check the console.');
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <div style={{ backgroundColor: '#D4F4E4' }}>
        <h1 className=" p-6 text-2xl font-bold">{tab === 'expense' ? 'Add daily expense' : 'Set daily goal'}</h1>

        <div className="grid grid-cols-2">
          <div
            onClick={() => setTab('expense')}
            className={`text-center p-2 cursor-pointer border-b-4 ${tab === 'expense' ? 'text-[#006C52] border-[#006C52]' : 'border-transparent text-gray-400'}`}
          >
            New expense
          </div>
          <div
            onClick={() => setTab('goal')}
            className={`text-center p-2 cursor-pointer border-b-4 ${tab === 'goal' ? 'text-[#006C52] border-[#006C52]' : 'border-transparent text-gray-400'}`}
          >
            New goal
          </div>
        </div>
      </div>

      {/* Input amount */}
      <div className="flex border-x-0 my-2 mx-2 justify-center items-baseline">
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          placeholder="expense (VND)"
          className="w-full border p-2 rounded"
        />
        <div className="text-2xl"></div>
      </div>

      {/* Note input (only for expense) */}
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

      {/* Confirm button */}
      <div className="m-4 text-center">
        <button
          onClick={handleConfirm}
          className="text-white w-60 rounded-sm p-2"
          style={{ backgroundColor: '#1CA380' }}
        >
          Confirm
        </button>
      </div>

      {/* Calendar */}
      <div className="flex justify-center relative" ref={calendarRef}>
        <Calendar
          value={date}
          onClickDay={handleDayClick}
          className="rounded-md border text-xl z-10"
        />

        {/* Popup nổi gần ô ngày */}
        {popupPos && (
          <div
            ref={popupRef}
            className="absolute bg-white shadow-xl rounded-md p-4 w-64 border z-20 animate-fade-in"
            style={{ top: popupPos.top, left: popupPos.left }}
          >
            <p className="font-semibold">{formatDate(date)}</p>
            {expenseInfo ? (
              <p className="text-green-700">expensed: {expenseInfo.amount} VND</p>
            ) : (
              <p className="text-gray-500">expensed: 0 VND</p>
            )}
            {goalInfo ? (
              <p className="text-blue-600">Goal: {goalInfo.amount} VND</p>
            ) : (
              <p className="text-gray-500">No goal set</p>
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

      {/* Fade animation */}
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
