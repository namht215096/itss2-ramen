import axios from 'axios';
import { format } from 'date-fns'; // npm install date-fns
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Input } from '../../components/input';
const AddDailyBudgetPages = () => {
  const [date, setDate] = useState(new Date());
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const [selectingMode, setSelectionMode] = useState('expense');
  const [moneyData, setMoneyData] = useState([]);
  const [newMoney, setnewMoney] = useState({
    money: 0,
    reason: null,
    date: null,
    type: selectingMode,
  });

  const fetchMoneyData = () => {
    axios
      .get('http://localhost:3000/money')
      .then((res) => setMoneyData(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMoneyData();
  }, []);
  useEffect(() => {
    setnewMoney({ ...newMoney, date: date });
  }, [date]);

  const getTotalForDate = (currentDate) => {
    const formatted = format(currentDate, 'yyyy-MM-dd');

    const filtered = moneyData.filter((entry) => {
      const entryDate = entry.date
        ? format(new Date(entry.date), 'yyyy-MM-dd')
        : null;
      return entryDate === formatted;
    });

    const expense = filtered
      .filter((item) => item.type === 'expense')
      .reduce((total, item) => total + Number(item.money), 0);

    const goal = filtered
      .filter((item) => item.type === 'goal')
      .reduce((total, item) => total + Number(item.money), 10000);

    return { expense, goal };
  };

  const submitMoney = () => {
    console.log(newMoney);

    if (newMoney.money && newMoney.date)
      axios
        .post('http://localhost:3000/money', newMoney)
        .then(() => {
          setShowConfirmPopup(false);
          setPendingSubmit(false);
          setnewMoney({
            money: 0,
            reason: null,
            date: null,
            type: selectingMode,
          });
          fetchMoneyData(); // 👈 refresh data after submit
        })

        .catch((err) => console.error(err));
  };

  const handleConfirm = () => {
    const { expense, goal } = getTotalForDate(date);
    const newExpenseValue = Number(newMoney.money);

    // Nếu là goal thì cho phép luôn
    if (newMoney.type === 'goal') {
      return submitMoney();
    }

    const totalExpense = expense + newExpenseValue;

    if (goal && totalExpense > goal) {
      setWarningMessage(
        'Chi tiêu vượt quá hạn mức ngày! Bạn có chắc muốn tiếp tục?'
      );
      setPendingSubmit(true);
      setShowConfirmPopup(true);
    } else if (goal && totalExpense >= goal * 0.9) {
      setWarningMessage('Bạn sắp đạt mức chi tiêu trong ngày!');
      setPendingSubmit(true);
      setShowConfirmPopup(true);
    } else {
      submitMoney();
    }
  };

  return (
    <>
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-sm text-center">
            <p className="mb-4 text-lg">{warningMessage}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  submitMoney();
                }}
                className="bg-green-600 text-white px-4 py-2 rounded">
                Xác nhận
              </button>
              <button
                onClick={() => {
                  setShowConfirmPopup(false);
                  setPendingSubmit(false);
                }}
                className="bg-gray-300 px-4 py-2 rounded">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
      <div className=" min-h-screen">
        <div style={{ backgroundColor: '#D4F4E4' }}>
          <h1 className=" p-6">Add daily budget</h1>
          <div className=" grid grid-cols-2">
            <div
              onClick={() => setSelectionMode('expense')}
              className=" text-center p-2 border-t-0 border-x-0 border-b-4 "
              style={{
                color: '#006C52',
                borderColor: selectingMode === 'expense' ? '#006C52' : '',
              }}>
              New expense
            </div>

            <div
              onClick={() => setSelectionMode('goal')}
              className=" text-center p-2 border-t-0 border-x-0 border-b-4 "
              style={{
                color: '#006C52',
                borderColor: selectingMode === 'goal' ? '#006C52' : '',
              }}>
              New goal
            </div>
          </div>
        </div>
        <div className="flex border-x-0 my-8 mx-2 justify-center items-baseline ">
          <Input
            placeholder={`New ${selectingMode}`}
            type="number"
            value={newMoney.money || ''}
            onChange={(e) =>
              setnewMoney({ ...newMoney, money: e.target.value })
            }
            className="text-4xl h-14 shadow-none border-x-0 border-t-0 border-b-2 rounded-none"
          />
          <div className=" text-2xl">VND</div>
        </div>
        <div className="flex border-x-0 my-8 mx-2 justify-center items-baseline  ">
          <Input
            value={newMoney.reason || ''}
            onChange={(e) =>
              setnewMoney({ ...newMoney, reason: e.target.value })
            }
            placeholder="Reason"
            className=" text-xl h-8 shadow-none border-x-0 border-t-0 border-b-2 rounded-none"></Input>
        </div>
        <div className=" flex justify-center items-center p-3">
          <Calendar
            value={date}
            onChange={setDate}
            tileContent={({ date }) => {
              const { expense, goal } = getTotalForDate(date);

              return (
                <div
                  style={{
                    fontSize: '0.65rem',
                    textAlign: 'center',
                  }}>
                  <div>{expense ? expense : '--'}</div>
                  <div>{goal ? goal : '--'}</div>
                </div>
              );
            }}
            className="rounded-md border w-fit text-xl"
          />
        </div>

        <div className=" m-4 text-center">
          <button
            onClick={handleConfirm}
            className=" text-white w-60 rounded-sm p-2"
            style={{ backgroundColor: '#1CA380' }}>
            Confirm
          </button>
        </div>
      </div>
    </>
  );
};

export default AddDailyBudgetPages;
