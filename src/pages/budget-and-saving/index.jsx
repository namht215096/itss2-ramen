import React from 'react';

const CashCard = () => {
  return (
    <div className=" flex justify-between items-center shadow-md p-4 rounded-sm border-2">
      <div className=" flex flex-col">
        <span className=" text-gray-500">12 february, 2022</span>
        <span className=" text-2xl">car</span>
      </div>
      <div className=" flex flex-col">500 euros</div>
    </div>
  );
};

const BudgetAddSavingPage = () => {
  return (
    <div className=" ">
      <div style={{ backgroundColor: '#D4F4E4' }}>
        <h1 className=" p-6">Budget and Saving</h1>
        <div className=" grid grid-cols-2">
          <div
            className=" text-center p-2 border-t-0 border-x-0 border-b-4 "
            style={{
              color: '#006C52',
              borderColor: '#006C52',
            }}>
            Personal
          </div>
          <div></div>
        </div>
      </div>

      <div className=" flex flex-col items-center justify-center shadow-md m-6 p-4 gap-2">
        <div
          className=" flex justify-between items-center w-full"
          style={{ color: '#707974' }}>
          <div>Total balance:</div>
          <div>60,28</div>
        </div>

        <div
          className=" flex justify-between items-center w-full"
          style={{ color: '#3799D2' }}>
          <div>Spending account:</div>
          <div>60,28</div>
        </div>
        <div
          style={{ color: '#006C52' }}
          className=" flex justify-between items-center w-full">
          <div>Saving account: </div>
          <div>60,28</div>
        </div>
        <div className=" flex justify-between items-center w-full text-gray-70">
          <div>Cash:</div>
          <div>60,28</div>
        </div>
      </div>

      <div
        style={{
          borderColor: '#44BF99',
        }}
        className="m-6 grid grid-cols-3  border-2 rounded-sm overflow-hidden">
        <button
          className=" p-2 "
          style={{
            backgroundColor: '#44BF99',
          }}>
          Transactions
        </button>
        <button className="text-center">Expenses</button>

        <button> Goals</button>
      </div>
      <div className=" text-center">Cash</div>

      <div className=" flex flex-col gap-2 p-4">
        <CashCard></CashCard>
        <CashCard></CashCard>
        <CashCard></CashCard>
        <CashCard></CashCard>
      </div>
    </div>
  );
};

export default BudgetAddSavingPage;
