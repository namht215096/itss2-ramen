import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Input } from '../../components/input';

/**
 * "Add daily budget" page (no Vite). Works out‑of‑the‑box with
 * Create React App or any React setup that exposes `process.env`.
 *
 * ➡️  Set `REACT_APP_API_URL` (CRA) or `API_URL` in your env files
 *     if your json‑server is **not** at http://localhost:3000.
 */
const AddDailyBudgetPages = () => {
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState('');

  // Fallback hierarchy: custom env → window level → localhost
  const apiBase =
    process.env.REACT_APP_API_URL ||
    process.env.API_URL ||
    window.API_URL ||
    'http://localhost:3000';

  const formatDate = (d) => d.toISOString().split('T')[0];

  const handleConfirm = async () => {
    if (!amount) return;
    const isoDate = formatDate(date);
    const payload = { date: isoDate, amount: Number(amount) };

    try {
      const res = await fetch(`${apiBase}/savingHistory?date=${isoDate}`);
      const existing = await res.json();

      if (existing.length) {
        await fetch(`${apiBase}/savingHistory/${existing[0].id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: payload.amount }),
        });
      } else {
        await fetch(`${apiBase}/savingHistory`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setAmount('');
      alert('Saved!');
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Check the console.');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div style={{ backgroundColor: '#D4F4E4' }}>
        <h1 className="p-6">Add daily budget</h1>
        <div className="grid grid-cols-2">
          <div
            className="text-center p-2 border-t-0 border-x-0 border-b-4"
            style={{ color: '#006C52', borderColor: '#006C52' }}
          >
            New expense
          </div>
        </div>
      </div>

      {/* Amount input */}
      <div className="flex border-x-0 my-8 mx-2 justify-center items-baseline">
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          placeholder="0"
          className="text-7xl h-20 shadow-none border-x-0 border-t-0 border-b-8 rounded-none"
        />
        <div className="text-2xl">VND</div>
      </div>

      {/* Calendar */}
      <div className="flex justify-center items-center">
        <Calendar
          value={date}
          onChange={setDate}
          className="rounded-md border w-fit text-xl"
        />
      </div>

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
    </div>
  );
};

export default AddDailyBudgetPages;
