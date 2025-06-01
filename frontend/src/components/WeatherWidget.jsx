import React, { useState, useEffect } from 'react';
import './componentsStyle/WeatherWidget.css';


function WeatherWidget({ user }) {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_KEY = '54db5503a9274a00dda9316a209e423b';
    const city = 'Kyiv'; // або зробити вибір міста динамічним
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Помилка запиту до OpenWeatherMap");
        return res.json();
      })
      .then((data) => {
        // Виберемо прогноз лише на певні години (наприклад, кожні 24 години)
        const dailyForecast = data.list.filter(item => item.dt_txt.includes("12:00:00"));
        setForecast(dailyForecast);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="weather-widget">
        <h3>Погода на кілька днів (Kyiv)</h3>
        {loading && <p>Завантаження погоди...</p>}
        {error && <p style={{ color: 'red' }}>Помилка: {error}</p>}
        {!loading && !error && (
          <ul>
            {forecast.map((day) => (
              <li key={day.dt}>
                <strong>{new Date(day.dt_txt).toLocaleDateString()}</strong> — {day.weather[0].description}, {Math.round(day.main.temp)}°C
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}


export default WeatherWidget;