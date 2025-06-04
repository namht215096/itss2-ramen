import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../index';
import { NavLink } from 'react-router-dom';


const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-start border-b pb-2">
    <div className="text-gray-800 font-semibold">{label}</div>
    <div className="flex-1 text-right text-gray-600 ml-4">{value}</div>
  </div>
);

const UserPage = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (user?.id) {
      axios.get(`${apiBase}/users/${user.id}`)
        .then(res => setUserData(res.data))
        .catch(err => console.error('Lỗi khi lấy dữ liệu người dùng:', err));
    }
  }, [user, apiBase]);

  if (!userData) {
    return <div className="p-6">Đang tải thông tin người dùng...</div>;
  }console.log('userData.Goal.item.dailyGoal:', userData.Goal?.item?.dailyGoal);
  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full bg-green-100">
        <h1 className="p-6 text-2xl font-bold">User</h1>
      </div>

      <div className="p-6 w-full max-w-md space-y-6">
        <div className="text-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvXlikjlp1ElJ3n-8qFt5bCS8xlCQ2p3nIZQ&s"
            alt="avatar"
            className="w-24 h-24 rounded-full mx-auto"
          />
          <h2 className="text-xl font-semibold flex justify-center items-center mt-2">{userData.displayname}
            <p className="text-gray-500 flex justify-center items-center gap-1">
          </p>
          </h2>
          
        </div>

        <InfoRow label="Username" value={userData.username} />
        <InfoRow label="Monthly Goal" value={userData.Goal?.item?.monthlyGoal || '—'} />
        <InfoRow label="Yearly Goal" value={userData.Goal?.item?.yearlyGoal || '—'} />

        

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/Login';
          }}
          className="text-red-500 text-sm hover:underline mt-6 block mx-auto"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserPage;
