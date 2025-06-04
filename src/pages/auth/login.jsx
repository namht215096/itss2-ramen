import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/users?username=${username}`
      );
      if (!res.ok) throw new Error('conect to server error');

      const data = await res.json();
      if (data.length === 0) {
        setError('User not found');
        return;
      }

      const userData = data[0];
      if (userData.password === password) {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/dashboard'); // Điều hướng sau khi đăng nhập
      } else {
        setError('Wrong password');
      }
    } catch (err) {
      console.error(err);
      setError('error');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-4 my-60 bg-white rounded shadow">
      <h2 className="text-xl mb-4 font-semibold">Đăng nhập</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
        required
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
        required
      />
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded">
        Login
      </button>
      <p className="text-sm mt-4 text-center">
        No account?{' '}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default Login;
