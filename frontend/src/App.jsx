import { useNavigate } from 'react-router-dom'
import Logo from '/icon.svg'
import './Styles/App.css'

function App() {
  const navigate = useNavigate()

  const handleStartClick = () => {
    navigate('/register')
  }

  return (
    <>
      <div>
        <img src={Logo} className="logo" alt="logo" />
      </div>
      <h1 className="animated-text">Foldee</h1>
      <h3 className='motivation'>Unfold your potential</h3>

      <div className="card">
        <button className='start-button' onClick={handleStartClick}>
          Почати
        </button>
        
        <button onClick={() => navigate('/features')}>
          Можливості вебзастосунку
          </button>
      </div>
    </>
  )
}

export default App
