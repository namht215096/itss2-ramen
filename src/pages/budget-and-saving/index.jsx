
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PiggyBank from '../../components/PiggyBank';



const CashCard = ({ date, note, amount }) => {
  return (
    <div className="flex justify-between items-center shadow-md p-4 rounded-sm border-2">
      <div className="flex flex-col">
        <span className="text-gray-500">{date}</span>
        <span className="text-2xl">{note}</span>
      </div>
      <div className="flex flex-col">{amount} euros</div>
    </div>
  );
};

const BudgetAddSavingPage = () => {
  const [goalData, setGoalData] = useState(1);
  const [activeTab, setActiveTab] = useState('expenses');
  const [balanceData, setBalanceData] = useState(1);
  const [expensesData, setExpensesData] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/Goal')
      .then((res) => {
        console.log('Goal API Response:', res.data);
        setGoalData(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:3000/balance')
      .then((res) => setBalanceData(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:3000/expenses')
      .then((res) => setExpensesData(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div style={{ backgroundColor: '#D4F4E4' }}>
        <h1 className="p-6">Budget and Saving</h1>
        <div className="grid grid-cols-2">
        </div>
      </div>

      <div className="flex flex-col items-center justify-center shadow-md m-6 p-4 gap-2">
        <div className="flex justify-center my-4">
          <PiggyBank value={goalData?.monthlyGoal ?? 0} />
        </div>

        <div className="flex justify-between items-center w-full" style={{ color: '#707974' }}>
          <div>Total balance:</div>
          <div>{((balanceData.spending ?? 0) + (balanceData.saving ?? 0))
            .toFixed(2)
            .replace('.', ',')}
          </div>
        </div>
        <div className="flex justify-between items-center w-full" style={{ color: '#3799D2' }}>
          <div>Spending account:</div>
          <div>{(balanceData.spending ?? 0)
            .toFixed(2)
            .replace('.', ',')}
          </div>
        </div>
        <div style={{ color: '#006C52' }} className="flex justify-between items-center w-full">
          <div>Saving account:</div>
          <div>{(balanceData.saving ?? 0)
            .toFixed(2)
            .replace('.', ',')}
          </div>
        </div>
      </div>

      <div className="m-6 grid grid-cols-2 border-2 rounded-sm overflow-hidden">
        <button
          className={`p-2 ${activeTab === 'expenses' ? 'bg-green-500' : ''}`}
          onClick={() => handleTabChange('expenses')}
        >
          Expenses
        </button>
        <button
          className={`p-2 ${activeTab === 'goals' ? 'bg-green-500' : ''}`}
          onClick={() => handleTabChange('goals')}
        >
          Goals
        </button>
      </div>

      <div className="flex flex-col gap-2 p-4">
        {activeTab === 'expenses' ? (
          <>
            {expensesData.map((expense, index) => (
              <CashCard
                key={index}
                date={expense.date}
                note={expense.note}
                amount={expense.amount}
              />
            ))}
          </>
        ) : (
          <div className="goals-section bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Goals</h2>
            <div className="goal-list mb-4">
              <div className="goal-item bg-gray-100 p-4 mb-2 rounded border">

                <p className="font-semibold">Goal: Car</p>
                <p>Target Amount: <span className="font-bold">500 euros</span></p>
                <p>Current Savings: <span className="font-bold">300 euros</span></p>

              </div>
            </div>
            <form className="add-goal-form">
              <div>
                <label for="goalName">Goal Name:</label>
                <select id="goalName">
                  <option value="daily">Daily Goal</option>
                  <option value="weekly">Weekly Goal</option>
                  <option value="monthly">Monthly Goal</option>
                </select>
              </div>
              <input type="number" placeholder="Target Amount" required className="input-field" />
              <input type="date" required className="input-field" />
              <button type="submit" className="submit-button">Add Goal</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetAddSavingPage;
