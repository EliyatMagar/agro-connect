import {BrowserRouter as Router, Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/LoginPage'
import Signup from './pages/SignupPage'
import FarmerDashboard from './components/Dashboard/FarmerDashboard'
import TransporterDashboard from './components/Dashboard/TransporterDashboard'
import BuyerDashboard from './components/Dashboard/BuyerDashboard'

function App() {


  return (
    <Router>
      <Routes>
        <Route path='/' element ={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Signup/>}/>
       
       <Route path='/buyer-dashboard' element={<BuyerDashboard/>}/>
       <Route path='/transporter-dashboard' element={<TransporterDashboard/>}/>
       <Route path='/farmer-dashboard' element={<FarmerDashboard/>}/>
      </Routes>
    </Router>

   
  )
}

export default App
