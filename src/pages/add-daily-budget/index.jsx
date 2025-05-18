import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Input } from '../../components/input';

const AddDailyBudgetPages = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className=" min-h-screen">
      <div style={{ backgroundColor: '#D4F4E4' }}>
        <h1 className=" p-6">Add daily budget</h1>
        <div className=" grid grid-cols-2">
          <div
            className=" text-center p-2 border-t-0 border-x-0 border-b-4 "
            style={{
              color: '#006C52',
              borderColor: '#006C52',
            }}>
            New expense
          </div>
        </div>
      </div>
      <div className="flex border-x-0 my-8 mx-2 justify-center items-baseline">
        <Input className=" text-7xl h-20 shadow-none border-x-0 border-t-0 border-b-8 rounded-none"></Input>
        <div className=" text-2xl">VND</div>
      </div>
      <div className=" flex justify-center items-center">
        <Calendar
          value={date}
          onChange={setDate}
          className="rounded-md border w-fit text-xl"
        />
      </div>

      <div className=" m-4 text-center">
        <button
          className=" text-white w-60 rounded-sm p-2"
          style={{ backgroundColor: '#1CA380' }}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default AddDailyBudgetPages;
