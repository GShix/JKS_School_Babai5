
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import About from './pages/about/About'
import GameZone from './pages/game/GameZone'
import AllBlogs from './pages/blogs/AllBlogs'

function App() {
  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/blogs' element={<AllBlogs/>}/>
            <Route path='/admin/login' element={<Login/>}/>
            <Route path='/user/register' element={<Register/>}/>
            <Route path='/game-zone' element={<GameZone/>}/>
            {/* 
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/productdetails/:id' element={<ProductDetail/>}/> */}
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
