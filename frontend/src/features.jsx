import { useNavigate } from 'react-router-dom';
import React from 'react';
import './Styles/features.css'

function Features() {
  const navigate = useNavigate()

  return (
    <div className="site-features">
  <h2>✨ Можливості сайту</h2>
  <p>
    Це веб-додаток для управління проєктами, командами та завданнями. Дає змогу створювати проєкти, запрошувати учасників, керувати доступом та працювати із завданнями.
  </p>

  <ul className="features-list">
  <li data-icon="🔐">Аутентифікація: реєстрація та вхід користувачів.</li>
  <li data-icon="📁">Створення проєктів з назвою, описом і кольором.</li>
  <li data-icon="🔗">Запрошення учасників через посилання.</li>
  <li data-icon="🛠️">Редагування команди (адмін-панель).</li>
  <li data-icon="🗑️">Видалення проєкту (доступне лише творцю).</li>
  <li data-icon="🚪">Вихід з проєкту будь-яким учасником.</li>
  <li data-icon="✅">
    Робота із завданнями: створення, призначення учасників, встановлення статусу, пріоритету, а також фільтрування за різними критеріями.
  </li>
</ul>


  <div className="role-section">
    <h3>🔑 Ролі користувачів</h3>
    <ul>
      <li><strong>Творець:</strong> повний контроль, включаючи видалення проєкту та керування командою.</li>
      <li><strong>Адміністратор:</strong> може створювати та призначати завдання.</li>
      <li><strong>Учасник:</strong> може виходити з проєкту та самостійно брати завдання без виконавця.</li>
    </ul>
  </div>

  <div className="test-user-section">
    <h3>🧪 Тестовий профіль</h3>
    <p>Спробуйте можливості сайту, увійшовши як тестовий користувач:</p>
    <ul>
      <li><strong>Email:</strong> <code>oleg@team.com</code></li>
      <li><strong>Пароль:</strong> <code>oleg1234</code></li>
    </ul>
    <p><em>Цей профіль містить 3 демонстраційні проєкти з різними ролями.</em></p>
  </div>



      <button
        onClick={() => navigate('/')}
      >
        Назад на головну
      </button>
    </div>
  )
}

export default Features
