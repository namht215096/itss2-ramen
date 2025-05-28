import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../index';

const defaultUserTemplate = (newId, username, password, displayname) => ({
  id: newId,
  username,
  password,
  displayname,
  expenseHistory: [],
  Goal: {
    item: {
      dailyGoal: [],
      monthlyGoal: 0,
      yearlyGoal: 0
    }
  }
});

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [displayname, setDisplayname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const res = await fetch(`http://localhost:3000/users?username=${username}`);
    const data = await res.json();

    if (data.length > 0) {
      setError('Tên đăng nhập đã tồn tại');
      return;
    }

    // Tạo user mới dựa trên mẫu
    const newUser = defaultUserTemplate(`user${Date.now()}`, username, password, displayname);

    // Gửi POST để thêm user vào db
    const postRes = await fetch(`http://localhost:3000/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });

    if (!postRes.ok) throw new Error('Đăng ký thất bại');

    const createdUser = await postRes.json();
    setUser(createdUser);
    localStorage.setItem('user', JSON.stringify(createdUser));
    navigate('/dashboard');
  } catch (err) {
    console.error(err);
    setError('Đã xảy ra lỗi khi đăng ký');
  }
};


  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 my-60 bg-white rounded shadow">
      <h2 className="text-xl mb-4 font-semibold">Đăng ký</h2>

      <input
        type="text"
        placeholder="Tên đăng nhập"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
        required
      />

      <input
        type="text"
        placeholder="Tên hiển thị"
        value={displayname}
        onChange={(e) => setDisplayname(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
        required
      />

      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
        required
      />

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
        Đăng ký
      </button>
      <p className="text-sm mt-4 text-center">
        Đã có tài khoản?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
            Đăng nhập
        </Link>
      </p>
    </form>
  );
};

export default SignUp;
