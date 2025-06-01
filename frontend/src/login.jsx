import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/register.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        localStorage.setItem('token', data.token);
  
        // Декодуємо payload токена (частина між крапками)
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        localStorage.setItem('loggedInUser', JSON.stringify(payload));
  
        navigate('/home');
      } else {
        setError(data.error || 'Невдала спроба входу');
      }
    } catch (err) {
      setError('Помилка зʼєднання з сервером');
      console.error(err);
    }
  };

  
  return (
    <div className="form-page">
      <h2>Вхід</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Пароль:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        {error && <div className="error">{error}</div>}
        <button type="submit" className="submit-button">Увійти</button>
      </form>
    </div>
  );
}

export default Login;
