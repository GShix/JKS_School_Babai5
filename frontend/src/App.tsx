
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import About from './pages/about/About'
import GameZone from './pages/game/GameZone'
import AllBlogs from './pages/blogs/AllBlogs'
import CreateBlog from './pages/blogs/CreateBlog'
import SingleBlog from './pages/blogs/SingleBlog'
import EditBlog from './pages/blogs/EditBlog'
import Notices from './pages/notices/Notices'
import Downloads from './pages/download/Downloads'
import Career from './pages/career/Career'
import Gallery from './pages/Gallery/Gallery'
import OurTeam from './pages/ourTeam/OurTeam'
import AcademicPrograms from './pages/academicPrograms/AcademicPrograms'
import Education from './pages/academicPrograms/Education'
import Agriculture from './pages/academicPrograms/Agriculture'
import Management from './pages/academicPrograms/Management'
import Results from './pages/results/Results'

function App() {
  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/results' element={<Results/>}/>
            <Route path='/about/jkss' element={<About/>}/>
            <Route path='/about/jkss-team' element={<OurTeam/>}/>
            <Route path='/academic-programs/' element={<AcademicPrograms/>}/>
            <Route path='/academic-programs/education' element={<Education/>}/>
            <Route path='/academic-programs/agriculture' element={<Agriculture/>}/>
            <Route path='/academic-programs/management' element={<Management/>}/>
            <Route path='/gallery' element={<Gallery/>}/>
            <Route path='/notices' element={<Notices/>}/>
            <Route path='/downloads' element={<Downloads/>}/>
            <Route path='/career' element={<Career/>}/>
            <Route path='/blogs' element={<AllBlogs/>}/>
            <Route path='/blogs/create' element={<CreateBlog/>}/>
            <Route path='/blogs/:id' element={<SingleBlog/>}/>
            <Route path='/blogs/edit/:id' element={<EditBlog/>}/>
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
