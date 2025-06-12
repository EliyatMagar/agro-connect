import {BrowserRouter as Router, Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/LoginPage'
import Signup from './pages/SignupPage'
function App() {


  return (
    <Router>
      <Routes>
        <Route path='/' element ={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Signup/>}/>
        {/* Add more routes as needed */}


      </Routes>
    </Router>

   
  )
}

export default App
