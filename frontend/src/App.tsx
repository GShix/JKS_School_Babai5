
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/shared/ScrollToTop'
import Home from './pages/home/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import About from './pages/about/About'
import GameZone from './pages/game/GameZone'
import AllBlogs from './pages/blogs/AllBlogs'
import CreateBlog from './pages/blogs/CreateBlog'
import SingleBlog from './pages/blogs/SingleBlog'
import Announcements from './pages/announcements/Announcements'
import AnnouncementDetail from './pages/announcements/AnnouncementDetail'
import Downloads from './pages/download/Downloads'
import Career from './pages/career/Career'
import Gallery from './pages/Gallery/Gallery'
import JKSSTeachers from './pages/about/JKSSTeachers'
import JKSSStaffs from './pages/about/JKSSStaffs'
import AcademicPrograms from './pages/academicPrograms/AcademicPrograms'
import Education from './pages/academicPrograms/Education'
import Agriculture from './pages/academicPrograms/Agriculture'
import Management from './pages/academicPrograms/Management'
import Results from './pages/results/Results'
import Admission from './pages/admission/Admission'
import SecondaryLevelProgram from './pages/academicPrograms/SecondaryLevelProgram'
import BasicLevelProgram from './pages/academicPrograms/BasicLevelProgram'
import AdminPanel from './pages/admin/AdminPanel'
import StudentLogin from './pages/auth/StudentLogin'

function App() {
  return (
    <>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/results' element={<Results/>}/>
            <Route path='/admission' element={<Admission/>}/>
            <Route path='/about/jkss' element={<About/>}/>
            <Route path='/about/teachers' element={<JKSSTeachers/>}/>
            <Route path='/about/staffs' element={<JKSSStaffs/>}/>

            {/* Group the academic program routes together */}
            
            <Route path='/academic-programs/' element={<AcademicPrograms/>}/>
            <Route path='/academic-programs/education' element={<Education/>}/>
            <Route path='/academic-programs/agriculture' element={<Agriculture/>}/>
            <Route path='/academic-programs/management' element={<Management/>}/>
            <Route path='/academic-programs/secondary-level' element={<SecondaryLevelProgram/>}/>
            <Route path='/academic-programs/basic-level' element={<BasicLevelProgram/>}/>
            <Route path='/gallery' element={<Gallery/>}/>
            <Route path='/announcements' element={<Announcements/>}/>
            <Route path='/announcements/:id' element={<AnnouncementDetail/>}/>
            <Route path='/downloads' element={<Downloads/>}/>
            <Route path='/career' element={<Career/>}/>
            <Route path='/blogs' element={<AllBlogs/>}/>
            <Route path='/blogs/create' element={<CreateBlog/>}/>
            <Route path='/blogs/:id' element={<SingleBlog/>}/>

            <Route path='/admin/login' element={<Login/>}/>
            <Route path='/admin/dashboard' element={<AdminPanel/>}/>

            <Route path='/student/login' element={<StudentLogin/>}/>
            {/* <Route path='/student/dashboard' element={<St/>}/> */}

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
