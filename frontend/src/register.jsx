import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import './Styles/register.css'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username.trim()) {
      newErrors.username = 'Імʼя користувача обовʼязкове';
    }

    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Введіть коректний email';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Пароль має містити мінімум 6 символів';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      const res = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert('Реєстрація успішна!');
        console.log('Зареєстровано:', data);
        setFormData({ username: '', email: '', password: '' });
        setErrors({});
        navigate('/login');
      } else {
        alert(data.error || 'Щось пішло не так при реєстрації');
      }
    } catch (err) {
      alert('Помилка зʼєднання з сервером');
      console.error(err);
    }
  };
  
  return (
    <div className="form-page">
      <h2>Реєстрація</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Ім'я користувача:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && <div className="error">{errors.username}</div>}
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <div className="error">{errors.email}</div>}
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
          {errors.password && <div className="error">{errors.password}</div>}
        </label>
        <br />
        <button type="submit" className="submit-button">Зареєструватися</button>
      </form>
      <button className="link-button" onClick={() => navigate('/login')}>Вже маєте акаунт?</button>
    </div>
  );
}

export default Register;
