import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../index'; // đường dẫn đúng tới nơi tạo context

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { setUser } = useContext(AuthContext); // Lấy setUser từ context

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/users?username=${username}`);
      if (!res.ok) throw new Error('Lỗi kết nối đến server');

      const data = await res.json();
      if (data.length === 0) {
        setError('User không tồn tại');
        return;
      }

      const userData = data[0];
      if (userData.password === password) {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Lưu user vào localStorage
        navigate('/dashboard');// Điều hướng sau khi đăng nhập
      } else {
        setError('Sai mật khẩu');
      }
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi khi đăng nhập');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl mb-4 font-semibold">Đăng nhập</h2>
      <input
        type="text"
        placeholder="Tên đăng nhập"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        Đăng nhập
      </button>
    </form>
  );
};

export default Login;
