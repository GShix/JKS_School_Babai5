
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'

function App() {
  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home/>}/>
            {/* <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/productdetails/:id' element={<ProductDetail/>}/> */}
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
