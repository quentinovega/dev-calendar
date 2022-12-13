import './App.css'
import { Calendar } from './calendar'

function App() {

  return (
    <>
      <header className='navbar sticky-top'>
        <div className="navbar-brand p-0 ps-3 me-0 me-lg-2">
          Agenda de la guilde DEV
        </div>
      </header>
      <div className='container-fluid'>
        <div className="row">
          <Calendar />
        </div>
      </div>
    </>
  )
}

export default App
