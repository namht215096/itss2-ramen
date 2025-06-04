import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      yearlyGoal: 0,
    },
  },
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
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/users?username=${username}`
      );
      const data = await res.json();

      if (data.length > 0) {
        setError('Username exists');
        return;
      }

      // Tạo user mới dựa trên mẫu
      const newUser = defaultUserTemplate(
        `user${Date.now()}`,
        username,
        password,
        displayname
      );

      // Gửi POST để thêm user vào db
      const postRes = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!postRes.ok) throw new Error('Sign up failed.');

      const createdUser = await postRes.json();
      setUser(createdUser);
      localStorage.setItem('user', JSON.stringify(createdUser));
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Sign up error. ');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-4 my-60 bg-white rounded shadow">
      <h2 className="text-xl mb-4 font-semibold">Sign up</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
        required
      />

      <input
        type="text"
        placeholder="Display Name"
        value={displayname}
        onChange={(e) => setDisplayname(e.target.value)}
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
        className="w-full bg-green-600 text-white py-2 rounded">
        Sign Up
      </button>
      <p className="text-sm mt-4 text-center">
        having account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
};

export default SignUp;
